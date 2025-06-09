const userController = require('../../src/controllers/userController');
const connectDB = require('../../src/config/database');

module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Conectar ao banco de dados
        await connectDB();

        // Extrair o ID da URL se existir
        const id = req.query.id || req.url.split('/').pop();

        switch (req.method) {
            case 'GET':
                if (id && id !== 'users') {
                    req.params = { id };
                    await userController.getUser(req, res);
                } else {
                    await userController.getUsers(req, res);
                }
                break;
            case 'POST':
                if (req.url.includes('update-name')) {
                    await userController.updateUserName(req, res);
                } else {
                    res.status(404).json({ message: 'Rota não encontrada' });
                }
                break;
            default:
                res.status(405).json({ message: 'Método não permitido' });
        }
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ message: error.message });
    }
}; 