const Like = require('../models/Like');
const jwt = require('jsonwebtoken');
require ('dotenv').config();



exports.getLikesByUserId = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET );
        const userId = decodedToken.id;

        const likes = await Like.find({ userId: userId });
        res.status(200).json(likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteLikeUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;

        await Like.deleteMany({ userId: userId });

        res.status(200).json({ message: 'All likes deleted for this user' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getLikesByMatchId = async (req, res) => {
    try {
        const likes = await Like.find({ matchId: req.params.matchId });
        res.status(200).json(likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createLike = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;

        const like = new Like({
            userId: userId,
            matchId: req.body.matchId,
            tyoe: req.body.type
        });

        const newLike = await like.save();
        res.status(201).json(newLike);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteLike = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;

        const like = await Like.findById(req.params.id);
        if (!like) {
            return res.status(404).json({ message: 'Like not found' });
        }

        if (like.userId.toString() !== userId) {
            return res.status(403).json({ message: 'User not authorized' });
        }

        await like.remove();
        res.status(200).json({ message: 'Like deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};