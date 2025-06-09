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

        switch (req.method) {
            case 'POST':
                if (req.url.includes('request-code')) {
                    await userController.requestVerificationCode(req, res);
                } else if (req.url.includes('verify-code')) {
                    await userController.verifyCode(req, res);
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