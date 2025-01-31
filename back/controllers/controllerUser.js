const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Like = require('../models/Like');
const Match = require('../models/Match');
const JWT_SECRET = process.env.JWT_SECRET || "ctrosecretlemotlàvrmt";

exports.register = async (req, res) => {
    console.log('register route');
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email déjà utilisé" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, email, password: hashedPassword });

        await user.save();

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        console.log('utilisateur enregistré');
        res.status(201).json({ token, user: { id: user.id, username, email } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    console.log('login route');
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Identifiants incorrects" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Identifiants incorrects" });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        console.log('Generated token:', token);
        console.log('utilisateur connecté');
        res.status(200).json({ token, user: { id: user.id, username: user.username, email } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.getProfile = async (req, res) => {
    console.log('getProfile route');
    try {
        console.log('Fetching user profile for user ID:', req.user.id);
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const likes = await Like.find({ userId: req.user.id }).populate('matchId');
        const pointsByDay = likes.reduce((acc, like) => {
            if (like.createdAt) {
                const date = like.createdAt.toISOString().split('T')[0];
                const points = like.type === 1 ? like.matchId.point : -like.matchId.point;
                if (!acc[date]) {
                    acc[date] = 0;
                }
                acc[date] += points;
            }
            return acc;
        }, {});

        const matches = likes.map(like => ({
            matchId: like.matchId._id,
            name: like.matchId.name,
            age: like.matchId.age,
            gender: like.matchId.gender,
            url_img: like.matchId.url_img,
            type: like.type,
            points: like.matchId.point,
            date: like.createdAt
        }));

        console.log('User profile fetched successfully');
        res.status(200).json({ user, pointsByDay, matches });
    } catch (err) {
        console.log('Error fetching user profile:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.resetUser = async (req, res) => {
    console.log('resetUser route');
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userId = decodedToken.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        user.point = 0;
        await Like.deleteMany({ userId: user.id });
        await user.save();
        console.log('User reset successfully');
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};