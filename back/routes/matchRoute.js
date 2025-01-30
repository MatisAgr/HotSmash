const express = require('express');
const router = express.Router();
const controllerMatch = require('../controllers/controllerMatch');
const auth = require('../middleware/auth');

router.post('/', auth.authHeader, controllerMatch.createMatchProfile);
router.get('/all', auth.authHeader, controllerMatch.getAllMatches);
router.get('/allRandom', auth.authHeader, controllerMatch.getRandomMatches);
router.get('/myMatch/:id', auth.authHeader, controllerMatch.getRandomMatches);
router.get('/:id', auth.authHeader, controllerMatch.getMatchProfile);
router.put('/:id', auth.isAdmin, controllerMatch.updateMatchProfile);
router.delete('/:id', auth.isAdmin, controllerMatch.deleteMatchProfile);

// Routes for pass and smash actions
router.post('/pass', auth.authHeader, controllerMatch.passMatch);
router.post('/smash', auth.authHeader, controllerMatch.smashMatch);

module.exports = router;