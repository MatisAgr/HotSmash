const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/controllerUser');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', [
    body('username').notEmpty().withMessage("Le nom d'utilisateur est requis"),
    body('email').isEmail().withMessage("Email invalide"),
    body('password').isLength({ min: 6 }).withMessage("Le mot de passe doit avoir au moins 6 caractères")
], userController.register);

router.post('/login', [
    body('email').isEmail().withMessage("Email invalide"),
    body('password').notEmpty().withMessage("Mot de passe requis")
], userController.login);

router.get('/profile', auth.authHeader , userController.getProfile);

module.exports = router;