const express = require('express');
const router = express.Router();
const controllerLike = require('../controllers/controllerLike');
const auth = require('../middleware/auth');

router.post('/', auth.authHeader, controllerLike.createLike);
router.get('/user', auth.authHeader, controllerLike.getLikesByUserId);
router.delete('/user', auth.authHeader, controllerLike.deleteLikeUser);
router.get('/:matchId', auth.authHeader, controllerLike.getLikesByMatchId);
router.delete('/:id', auth.authHeader, controllerLike.deleteLike);


module.exports = router;