const Post = require('../models/Post');

// Criar um novo post
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const images = req.files ? req.files.map(file => file.location) : [];

    const post = await Post.create({
      content,
      images,
      author: req.user.id // Assumindo que você tem autenticação e o usuário está disponível em req.user
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar post', error: error.message });
  }
};

// Buscar todos os posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar posts', error: error.message });
  }
};

// Buscar um post específico
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar post', error: error.message });
  }
};

// Atualizar um post
exports.updatePost = async (req, res) => {
  try {
    const { content } = req.body;
    const images = req.files ? req.files.map(file => file.location) : undefined;

    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    // Verificar se o usuário é o autor do post
    if (post.author !== req.user.id) {
      return res.status(403).json({ message: 'Não autorizado' });
    }

    const updates = {
      content,
      ...(images && { images })
    };

    const updatedPost = await Post.update(req.params.id, updates);
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar post', error: error.message });
  }
};

// Deletar um post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    // Verificar se o usuário é o autor do post
    if (post.author !== req.user.id) {
      return res.status(403).json({ message: 'Não autorizado' });
    }

    await Post.delete(req.params.id);
    res.json({ message: 'Post deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar post', error: error.message });
  }
}; 