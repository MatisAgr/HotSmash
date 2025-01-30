const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    console.log('Route POST /api/forum appelée');
    console.log('Utilisateur authentifié:', req.user);
    try {
        const { title, content, author } = req.body;
        console.log('Données reçues pour le nouveau post:', { title, content, author });
        const newPost = new Post({ title, content, author });
        await newPost.save();
        console.log('Post enregistré dans la base de données:', newPost);
        res.status(201).json(newPost);
    } catch (err) {
        console.error('Erreur lors de la création du post:', err);
        res.status(500).json({ message: err.message });
    }
});

router.get('/before/:timestamp', auth, async (req, res) => {
    console.log('Route GET /api/forum/before/:timestamp appelée');
    console.log('Utilisateur authentifié:', req.user);
    console.log('Timestamp reçu:', req.params.timestamp);
    try {
        const { timestamp } = req.params;
        const limit = parseInt(req.query.limit) || 5; // Utiliser le limit passé en query ou 5 par défaut
        console.log('Paramètre limit reçu pour before:', limit);
        const posts = await Post.find({ createdAt: { $lt: timestamp } })
            .sort({ createdAt: -1 })
            .limit(limit);
        
        console.log('Nombre de posts récupérés avant timestamp:', posts.length);
        res.json(posts);
    } catch (err) {
        console.error('Erreur lors de la récupération des posts:', err);
        res.status(500).json({ message: err.message });
    }
});

router.get('/', auth, async (req, res) => {
    console.log('Route GET /api/forum appelée');
    console.log('Utilisateur authentifié:', req.user);
    try {
        const limit = parseInt(req.query.limit) || 5; // Appliquer le limit passé en query ou 5 par défaut
        console.log('Paramètre limit reçu:', limit);
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .limit(limit);
        console.log('Nombre de posts récupérés:', posts.length);
        res.json(posts);
    } catch (err) {
        console.error('Erreur lors de la récupération des posts:', err);
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', auth, async (req, res) => {
    console.log(`Route GET /api/forum/${req.params.id} appelée`);
    console.log('Utilisateur authentifié:', req.user);
    console.log('ID du post demandé:', req.params.id);
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            console.warn('Post non trouvé avec l\'ID:', req.params.id);
            return res.status(404).json({ message: 'Post non trouvé' });
        }
        console.log('Post récupéré:', post);
        res.json(post);
    } catch (err) {
        console.error('Erreur lors de la récupération du post:', err);
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    console.log(`Route DELETE /api/forum/${req.params.id} appelée`);
    console.log('Utilisateur authentifié:', req.user);
    console.log('ID du post à supprimer:', req.params.id);
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            console.warn('Post non trouvé pour suppression avec l\'ID:', req.params.id);
            return res.status(404).json({ message: 'Post non trouvé' });
        }
        console.log('Post supprimé:', post);
        res.json({ message: 'Post supprimé' });
    } catch (err) {
        console.error('Erreur lors de la suppression du post:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;