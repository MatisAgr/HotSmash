const express = require('express');
const router = express.Router();
const controllerLike = require('../controllers/controllerLike');
const auth = require('../middleware/auth');

router.post('/', auth.authHeader, controllerLike.createLike);
router.get('/user', auth.authHeader, controllerLike.getLikesByUserId);
router.delete('/user', auth.authHeader, controllerLike.deleteLikeUser);
router.get('/user/smash', auth.authHeader, controllerLike.getSmashLikesByUserId);
router.get('/:matchId', auth.authHeader, controllerLike.getLikesByMatchId);
router.delete('/:id', auth.authHeader, controllerLike.deleteLike);


// // Routes for pass and smash actions
// router.post('/pass', auth.authHeader, controllerLike.passMatch);
// router.post('/smash', auth.authHeader, controllerLike.smashMatch);

module.exports = router;