const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rotas de autenticação
router.post('/auth/request-code', userController.requestVerificationCode);
router.post('/auth/verify-code', userController.verifyCode);

// Rotas de usuário
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUser);
router.post('/users/update-name', userController.updateUserName);

module.exports = router; 