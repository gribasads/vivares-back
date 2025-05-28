const Book = require('../models/Books');

// Criar um novo agendamento
exports.createBook = async (req, res) => {
    try {
        const { placeName, dateHour, address } = req.body;
        
        const book = new Book({
            id: Date.now().toString(), // Gerando um ID único baseado no timestamp
            placeName,
            dateHour,
            username: req.user._id, // Assumindo que o usuário está autenticado
            address,
            status: 'pending'
        });

        await book.save();
        
        // Populando os dados do lugar e do usuário
        await book.populate('placeName', 'name');
        await book.populate('username', 'name');
        
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar agendamento', error: error.message });
    }
};

// Buscar todos os agendamentos
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find()
            .populate('placeName', 'name')
            .populate('username', 'name')
            .sort({ dateHour: 1 });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar agendamentos', error: error.message });
    }
};

// Buscar agendamentos de um usuário específico
exports.getUserBooks = async (req, res) => {
    try {
        const books = await Book.find({ username: req.user._id })
            .populate('placeName', 'name')
            .populate('username', 'name')
            .sort({ dateHour: 1 });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar agendamentos do usuário', error: error.message });
    }
};

// Buscar um agendamento específico
exports.getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('placeName', 'name')
            .populate('username', 'name');
        
        if (!book) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }
        
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar agendamento', error: error.message });
    }
};

// Atualizar status do agendamento
exports.updateBookStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }

        // Verificar se o usuário é o dono do agendamento ou admin
        if (book.username.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Não autorizado' });
        }

        book.status = status;
        await book.save();
        
        await book.populate('placeName', 'name');
        await book.populate('username', 'name');
        
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar status do agendamento', error: error.message });
    }
};

// Deletar um agendamento
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }

        // Verificar se o usuário é o dono do agendamento
        if (book.username.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Não autorizado' });
        }

        await book.deleteOne();
        res.json({ message: 'Agendamento deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar agendamento', error: error.message });
    }
}; 