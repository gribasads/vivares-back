const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/auth');

// Rotas para agendamentos
router.post('/', auth, bookController.createBook);
router.get('/', bookController.getBooks);
router.get('/user', auth, bookController.getUserBooks);
router.get('/:id', bookController.getBook);
router.patch('/:id/status', auth, bookController.updateBookStatus);
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router; 