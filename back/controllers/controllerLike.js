const Like = require('../models/Like');
const Match = require('../models/Match');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { broadcastOnlineUsers } = require('../utils/broadcast');

exports.getLikesByUserId = async (req, res) => {
    try {
        console.log('getLikesByUserId called');
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        console.log('User ID:', userId);

        const likes = await Like.find({ userId: userId });
        console.log('Likes:', likes);
        res.status(200).json(likes);
    } catch (error) {
        console.error('Error in getLikesByUserId:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteLikeUser = async (req, res) => {
    try {
        console.log('deleteLikeUser called');
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        console.log('User ID:', userId);

        await Like.deleteMany({ userId: userId });
        console.log('All likes deleted for user:', userId);

        res.status(200).json({ message: 'All likes deleted for this user' });
    } catch (error) {
        console.error('Error in deleteLikeUser:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getLikesByMatchId = async (req, res) => {
    try {
        console.log('getLikesByMatchId called');
        const matchId = req.params.matchId;
        console.log('Match ID:', matchId);

        const likes = await Like.find({ matchId: matchId });
        console.log('Likes:', likes);
        res.status(200).json(likes);
    } catch (error) {
        console.error('Error in getLikesByMatchId:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getSmashLikesByUserId = async (req, res) => {
    try {
        console.log('getSmashLikesByUserId called');
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        console.log('User ID:', userId);

        const likes = await Like.find({ userId: userId, type: 2 });
        console.log('Smash Likes:', likes);
        res.status(200).json(likes);
    } catch (error) {
        console.error('Error in getSmashLikesByUserId:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.createLike = async (req, res) => {
    try {
        console.log('createLike called');
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        console.log('User ID:', userId);

        const match = await Match.findById(req.body.matchId);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        const like = new Like({
            userId: userId,
            matchId: req.body.matchId,
            type: req.body.type
        });
        console.log('Like to be created:', like);

        const newLike = await like.save();
        console.log('New Like:', newLike);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.body.type === 1) { // Smash
            user.point += match.point;
        } else if (req.body.type === 2) { // Pass
            user.point -= match.point;
        }

        await user.save();
        console.log('User points updated:', user.point);

        // Diffuser les utilisateurs en ligne avec les points mis à jour
        await broadcastOnlineUsers();

        res.status(201).json(newLike);
    } catch (error) {
        console.error('Error in createLike:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.deleteLike = async (req, res) => {
    try {
        console.log('deleteLike called');
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        console.log('User ID:', userId);

        const like = await Like.findById(req.params.id);
        if (!like) {
            console.log('Like not found');
            return res.status(404).json({ message: 'Like not found' });
        }

        if (like.userId.toString() !== userId) {
            console.log('User not authorized');
            return res.status(403).json({ message: 'User not authorized' });
        }

        await like.remove();
        console.log('Like deleted');
        res.status(200).json({ message: 'Like deleted' });
    } catch (error) {
        console.error('Error in deleteLike:', error);
        res.status(500).json({ message: error.message });
    }
};