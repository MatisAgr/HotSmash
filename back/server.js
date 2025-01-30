const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken'); // Ajout
const User = require('./models/User'); // Ajout

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const wss = new WebSocket.Server({ port: 8080 });

const JWT_SECRET = process.env.JWT_SECRET || "ctrosecretlemotlàvrmt";

let onlineUsers = new Map();

// Fonction pour diffuser la liste des utilisateurs en ligne
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

// Fonction pour démarrer les serveurs après la connexion à MongoDB
const startServers = () => {
    // Gestion des connexions WebSocket
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

    // Routes Express
    const forumRoutes = require('./routes/forum');
    app.use('/api/forum', forumRoutes);
    app.use('/api/auth', authRoutes);

    const PORT = process.env.PORT || 5060;
    app.listen(PORT, () => console.log(`Serveur Express démarré sur le port ${PORT}`));
};

// Connexion à MongoDB avec gestion des événements
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

// Écouter les événements de MongoDB
mongoose.connection.on('connected', () => {
    console.log('Mongoose connecté à la base de données');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose déconnecté');
});

// Initialiser la connexion
connectWithRetry();
