const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { upload } = require('../config/s3');
const auth = require('../middleware/auth'); // Assumindo que você tem um middleware de autenticação

// Rotas para posts
router.post('/', auth, upload.array('images', 5), postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.put('/:id', auth, upload.array('images', 5), postController.updatePost);
router.delete('/:id', auth, postController.deletePost);

module.exports = router; 