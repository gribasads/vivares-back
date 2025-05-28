const Post = require('../models/Post');

// Criar um novo post
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const images = req.files ? req.files.map(file => file.location) : [];

    const post = new Post({
      content,
      images,
      author: req.user._id // Assumindo que você tem autenticação e o usuário está disponível em req.user
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar post', error: error.message });
  }
};

// Buscar todos os posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar posts', error: error.message });
  }
};

// Buscar um post específico
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email');
    
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
    const images = req.files ? req.files.map(file => file.location) : [];

    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    // Verificar se o usuário é o autor do post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Não autorizado' });
    }

    post.content = content;
    if (images.length > 0) {
      post.images = images;
    }
    post.updatedAt = Date.now();

    await post.save();
    res.json(post);
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
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Não autorizado' });
    }

    await post.remove();
    res.json({ message: 'Post deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar post', error: error.message });
  }
}; 