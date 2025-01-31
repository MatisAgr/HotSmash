const Match = require('../models/Match');
const User = require('../models/User');
const Like = require('../models/Like');
const jwt = require('jsonwebtoken');

exports.createMatchProfile = async (req, res) => {
    try {
        const match = new Match(req.body);
        await match.save();
        res.status(201).json(match);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getMatchProfile = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }
        res.status(200).json(match);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateMatchProfile = async (req, res) => {
    try {
        const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }
        res.status(200).json(match);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteMatchProfile = async (req, res) => {
    try {
        const match = await Match.findByIdAndDelete(req.params.id);
        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }
        res.status(200).json({ message: 'Match deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllMatches = async (req, res) => {
    try {
        const matches = await Match.find({});
        res.status(200).json(matches);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getRandomMatches = async (req, res) => {
    try {
        const matches = await Match.aggregate([{ $sample: { size: 5 } }]);
        res.status(200).json(matches);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getMatchesByUserId = async (req, res) => {
    try {
        const likes = await Like.find({ userId: req.params.id });
        if (!likes.length) {
            return res.status(404).json({ error: 'No matches found for this user' });
        }
        const matchIds = likes.map(like => like.matchId);
        const matches = await Match.find({ _id: { $in: matchIds } });
        res.status(200).json(matches);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.passMatch = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const like = new Like({
            userId: userId,
            matchId: req.body.matchId,
            type: 2 // Type 2 for pass
        });

        const newLike = await like.save();

        console.log(newLike);
        
        res.status(201).json(newLike);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.smashMatch = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const like = new Like({
            userId: userId,
            matchId: req.body.matchId,
            type: 1 // Type 1 for smash
        });

        const newLike = await like.save();

        console.log(newLike);

        res.status(201).json(newLike);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getMatchSmash = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const likes = await Like.find({ userId: userId, type: 2 });
        const matchIds = likes.map(like => like.matchId);

        const matches = await Match.find({ _id: { $in: matchIds } });

        console.log('Matches:', matches);
        res.status(200).json(matches);
    } catch (error) {
        console.error('Error in getMatchSmash:', error);
        res.status(500).json({ message: error.message });
    }
};