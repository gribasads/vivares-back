const Book = require('../models/Books');
const Place = require('../models/Places');
const User = require('../models/User');

// Criar uma nova reserva
exports.createBook = async (req, res) => {
    try {
        const { placeId, dateHour, address } = req.body;

        // Verificar se o lugar existe
        const place = await Place.findById(placeId);
        if (!place) {
            return res.status(404).json({ message: 'Lugar não encontrado' });
        }

        const book = await Book.create({
            placeId,
            dateHour,
            address,
            username: req.user.id,
            status: 'pending'
        });

        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar reserva', error: error.message });
    }
};

// Buscar todas as reservas
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.findAll();
        
        // Enriquecer os dados com informações do lugar e usuário
        const enrichedBooks = await Promise.all(books.map(async (book) => {
            const place = await Place.findById(book.placeId);
            const user = await User.findById(book.username);
            
            return {
                ...book,
                place: place ? { id: place.id, name: place.name } : null,
                user: user ? { id: user.id, name: user.name, email: user.email } : null
            };
        }));

        res.json(enrichedBooks);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar reservas', error: error.message });
    }
};

// Buscar uma reserva específica
exports.getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({ message: 'Reserva não encontrada' });
        }

        // Enriquecer os dados com informações do lugar e usuário
        const place = await Place.findById(book.placeId);
        const user = await User.findById(book.username);
        
        const enrichedBook = {
            ...book,
            place: place ? { id: place.id, name: place.name } : null,
            user: user ? { id: user.id, name: user.name, email: user.email } : null
        };
        
        res.json(enrichedBook);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar reserva', error: error.message });
    }
};

// Atualizar status da reserva
exports.updateBookStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status inválido' });
        }

        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({ message: 'Reserva não encontrada' });
        }

        const updatedBook = await Book.update(req.params.id, { status });
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar status da reserva', error: error.message });
    }
};

// Deletar uma reserva
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({ message: 'Reserva não encontrada' });
        }

        // Verificar se o usuário é o dono da reserva
        if (book.username !== req.user.id) {
            return res.status(403).json({ message: 'Não autorizado' });
        }

        await Book.delete(req.params.id);
        res.json({ message: 'Reserva deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar reserva', error: error.message });
    }
}; 