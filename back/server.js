const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoute');
const matchRoutes = require('./routes/matchRoute');
const likeRoutes = require('./routes/likeRoute');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Like = require('./models/Like');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "ctrosecretlemotlàvrmt";

const startServers = () => {
    app.use('/api/match', matchRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/like', likeRoutes);

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

connectWithRetry();



////////////////////////////////////////////


