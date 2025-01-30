const Like = require('../models/Like');
const jwt = require('jsonwebtoken');


exports.getLikesByUserId = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'your_jwt_secret_key'); // Replace 'your_jwt_secret_key' with your actual secret key
        const userId = decodedToken.id;

        const likes = await Like.find({ userId: userId });
        res.status(200).json(likes);
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
        const decodedToken = jwt.verify(token, 'your_jwt_secret_key'); // Replace 'your_jwt_secret_key' with your actual secret key
        const userId = decodedToken.id;

        const like = new Like({
            userId: userId,
            matchId: req.body.matchId,
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
        const decodedToken = jwt.verify(token, 'your_jwt_secret_key'); // Replace 'your_jwt_secret_key' with your actual secret key
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