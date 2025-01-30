const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Like = require('../models/Like');
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
        res.json({ token, user: { id: user.id, username: user.username, email } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        console.log('Fetching user profile for user ID:', req.user.id);
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (err) {
        console.log('Error fetching user profile:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.resetUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        user.point = 0;
        await Like.deleteMany({ userId: user.id });
        await user.save();
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};