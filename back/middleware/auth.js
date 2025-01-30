const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || "ctrosecretlemotlàvrmt";

module.exports = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Received token:', token);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');
        if (!req.user) {
            return res.status(401).json({ message: 'User not found, authorization denied' });
        }
        next();
    } catch (err) {
        console.error('Something went wrong with the auth middleware', err);
        res.status(500).json({ message: 'Server Error' });
    }
};