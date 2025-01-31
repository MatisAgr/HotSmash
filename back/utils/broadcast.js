const User = require('../models/User');
const Like = require('../models/Like');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let onlineUsers = new Map();

const broadcastOnlineUsers = async () => {
    try {
        const users = await User.find({ _id: { $in: Array.from(onlineUsers.values()) } }).select('username point');
        const userList = await Promise.all(users.map(async user => {
            const smashesToDo = await Like.countDocuments({ userId: user._id, type: 2 });
            return { id: user._id, username: user.username, points: user.point, smashesToDo };
        }));
        const message = JSON.stringify({ type: 'onlineUsers', users: userList });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    } catch (err) {
        console.log('Erreur lors de la diffusion des utilisateurs en ligne:', err);
    }
};

module.exports = { broadcastOnlineUsers, onlineUsers, wss };