const express = require('express');
const router = express.Router();
const controllerMatch = require('../controllers/controllerMatch');
const auth = require('../middleware/auth');

router.post('/', auth.authHeader, controllerMatch.createMatchProfile);
router.get('/all', auth.authHeader, controllerMatch.getAllMatches);
router.get('/:id', auth.authHeader, controllerMatch.getMatchProfile);
router.put('/:id', auth.isAdmin, controllerMatch.updateMatchProfile);
router.delete('/:id', auth.isAdmin, controllerMatch.deleteMatchProfile);

module.exports = router;