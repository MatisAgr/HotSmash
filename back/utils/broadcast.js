const User = require('../models/User');
const Like = require('../models/Like');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

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

wss.on('connection', (ws) => {
    console.log('Nouvelle connexion WebSocket');

    ws.on('message', async (message) => {
        console.log('Message reçu du client:', message);
        try {
            const data = JSON.parse(message);
            if (data.type === 'authenticate') {
                const { token } = data;
                if (!token) {
                    ws.send(JSON.stringify({ type: 'error', message: 'Token manquant' }));
                    ws.close();
                    return;
                }

                jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                    if (err) {
                        ws.send(JSON.stringify({ type: 'error', message: 'Token invalide' }));
                        ws.close();
                        return;
                    }

                    const userId = decoded.id;
                    onlineUsers.set(ws, userId);
                    console.log(`Utilisateur connecté: ${userId}`);

                    await broadcastOnlineUsers();
                });
            }
        } catch (err) {
            console.log('Erreur lors du traitement du message:', err);
        }
    });

    ws.on('close', async () => {
        const userId = onlineUsers.get(ws);
        if (userId) {
            onlineUsers.delete(ws);
            console.log(`Utilisateur déconnecté: ${userId}`);
            await broadcastOnlineUsers();
        }
    });

    ws.on('error', (err) => {
        console.log('Erreur WebSocket:', err);
    });
});

module.exports = { broadcastOnlineUsers, onlineUsers, wss };