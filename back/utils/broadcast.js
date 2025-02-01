const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const redis = require('redis');
require('dotenv').config();

// Connect to Redis
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const connections = {};
const users = {};

const broadcast = (message) => {
    Object.values(connections).forEach(connection => {
        connection.send(JSON.stringify(message));
    });
};

const updateUsersList = () => {
    const userList = Object.values(users).map(user => ({ userId: user.userId, username: user.username }));
    broadcast({ type: 'users', users: userList });
};

const handleMessage = (text, id) => {
    const message = JSON.parse(text);
    const user = users[id];
    user.state = message;
    broadcast({ type: 'state', state: user.state });
};

const handleClose = (id) => {
    console.log('Connection closed:', id);
    delete connections[id];
    delete users[id];
    updateUsersList();
};

const sendMessage = async (senderId, recipientId, text) => {
    if (connections[recipientId]) {
        const payload = JSON.stringify({ from: senderId, message: text });
        connections[recipientId].send(payload);
    } else {
        console.log(`User ${recipientId} is not connected.`);
    }

    // Save message to Redis
    const message = { senderId, recipientId, text, timestamp: Date.now() };
    redisClient.lpush(`messages:${recipientId}`, JSON.stringify(message));
};

wss.on('connection', (connection, req) => {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
        connection.close(4001, 'Unauthorized');
        return;
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        connection.close(4001, 'Unauthorized');
        return;
    }

    const userId = decodedToken.userId;
    const username = decodedToken.username; // Assuming the token contains the username
    const id = uuidv4();
    console.log('New connection:', id);

    connections[id] = connection;
    users[id] = { userId, username, state: {} };

    // Load previous messages from Redis
    redisClient.lrange(`messages:${userId}`, 0, -1, (err, messages) => {
        if (err) {
            console.error('Redis error:', err);
            return;
        }
        messages.forEach(message => {
            connection.send(message);
        });
    });

    updateUsersList();

    connection.on('message', async message => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'broadcast') {
            handleMessage(parsedMessage.text, id);
        } else if (parsedMessage.type === 'private') {
            await sendMessage(userId, parsedMessage.recipientId, parsedMessage.text);
        }
    });

    connection.on('close', () => handleClose(id));
});

server.listen(8080, () => {
    console.log('WebSocket server is running on ws://localhost:8080');
});