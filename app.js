const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');

// Configuração do ambiente
dotenv.config();

// Inicialização do Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
const routes = require('./src/routes');
app.use('/api', routes);

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo deu errado!' });
});

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Conectar ao MongoDB e iniciar o servidor
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
};

startServer(); 