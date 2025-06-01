const Place = require('../models/Places');

// Criar um novo lugar
exports.createPlace = async (req, res) => {
    try {
        const { name, needPayment } = req.body;
        const image = req.file ? req.file.location : null;

        const place = await Place.create({
            name,
            image,
            needPayment
        });

        res.status(201).json(place);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar lugar', error: error.message });
    }
};

// Buscar todos os lugares
exports.getPlaces = async (req, res) => {
    try {
        const places = await Place.findAll();
        res.json(places);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar lugares', error: error.message });
    }
};

// Buscar um lugar específico
exports.getPlace = async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        
        if (!place) {
            return res.status(404).json({ message: 'Lugar não encontrado' });
        }
        
        res.json(place);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar lugar', error: error.message });
    }
};

// Atualizar um lugar
exports.updatePlace = async (req, res) => {
    try {
        const { name, needPayment } = req.body;
        const image = req.file ? req.file.location : undefined;

        const place = await Place.findById(req.params.id);
        
        if (!place) {
            return res.status(404).json({ message: 'Lugar não encontrado' });
        }

        const updates = {
            name,
            needPayment,
            ...(image && { image })
        };

        const updatedPlace = await Place.update(req.params.id, updates);
        res.json(updatedPlace);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar lugar', error: error.message });
    }
};

// Deletar um lugar
exports.deletePlace = async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        
        if (!place) {
            return res.status(404).json({ message: 'Lugar não encontrado' });
        }

        await Place.delete(req.params.id);
        res.json({ message: 'Lugar deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar lugar', error: error.message });
    }
};

// Remover uma imagem específica de um lugar
exports.removeImage = async (req, res) => {
    try {
        const { imageUrl } = req.body;
        const place = await Place.findById(req.params.id);
        
        if (!place) {
            return res.status(404).json({ message: 'Lugar não encontrado' });
        }

        // Remover a imagem do array
        place.image = place.image.filter(img => img !== imageUrl);
        await place.save();

        res.json(place);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover imagem', error: error.message });
    }
}; 