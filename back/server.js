const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoute');
const matchRoutes = require('./routes/matchRoute');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const wss = new WebSocket.Server({ port: 8080 });

const JWT_SECRET = process.env.JWT_SECRET || "ctrosecretlemotlàvrmt";

let onlineUsers = new Map();

const broadcastOnlineUsers = async () => {
    try {
        const users = await User.find({ _id: { $in: Array.from(onlineUsers.values()) } }).select('username');
        const userList = users.map(user => ({ id: user._id, username: user.username }));
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

const startServers = () => {
    wss.on('connection', (ws) => {
        console.log('Client connecté');

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);
                if (data.type === 'authenticate') {
                    const token = data.token;
                    const decoded = jwt.verify(token, JWT_SECRET);
                    onlineUsers.set(ws, decoded.userId);
                    console.log(`Utilisateur connecté: ${decoded.userId}`);
                    await broadcastOnlineUsers();
                }
            } catch (err) {
                console.log('Erreur lors de l\'authentification WebSocket:', err);
                ws.send(JSON.stringify({ type: 'error', message: 'Authentification échouée' }));
            }
        });

        ws.on('close', async () => {
            if (onlineUsers.has(ws)) {
                console.log(`Utilisateur déconnecté: ${onlineUsers.get(ws)}`);
                onlineUsers.delete(ws);
                await broadcastOnlineUsers();
            }
            console.log('Client déconnecté');
        });
    });

    app.use('/api/match', matchRoutes);
    app.use('/api/user', userRoutes);

    const PORT = process.env.PORT || 5060;
    app.listen(PORT, () => console.log(`Serveur Express démarré sur le port ${PORT}`));
};

const connectWithRetry = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("MongoDB connecté");
        startServers();
    }).catch(err => {
        console.log('Échec de la connexion à MongoDB, nouvelle tentative dans 5 secondes...', err);
        setTimeout(connectWithRetry, 5000);
    });
};

mongoose.connection.on('connected', () => {
    console.log('Mongoose connecté à la base de données');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose déconnecté');
});

connectWithRetry();