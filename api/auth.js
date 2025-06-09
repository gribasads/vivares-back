const express = require('express');
const cors = require('cors');
const userController = require('../src/controllers/userController');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas de autenticação
app.post('/request-code', userController.requestVerificationCode);
app.post('/verify-code', userController.verifyCode);

module.exports = app; 