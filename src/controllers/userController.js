const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendVerificationCode } = require('../services/emailService');

// Gerar código de verificação
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Solicitar código de verificação
exports.requestVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email é obrigatório' });
        }

        // Verificar se usuário já existe
        let user = await User.findByEmail(email);
        
        if (!user) {
            // Criar novo usuário se não existir
            user = await User.create({
                email,
                name: email.split('@')[0], // Usa a parte antes do @ como nome
                isVerified: false
            });
        }

        // Gerar código de verificação
        const code = generateVerificationCode();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Código válido por 10 minutos

        // Atualizar usuário com o código
        await User.update(user.id, {
            verificationCode: {
                code,
                expiresAt: expiresAt.toISOString()
            }
        });

        // Enviar código por email
        const emailSent = await sendVerificationCode(email, code);
        
        if (!emailSent) {
            return res.status(500).json({ message: 'Erro ao enviar código de verificação' });
        }

        res.json({ message: 'Código de verificação enviado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verificar código e gerar token
exports.verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: 'Email e código são obrigatórios' });
        }

        const user = await User.findByEmail(email);
        
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verificar se o código existe e não expirou
        if (!user.verificationCode || 
            user.verificationCode.code !== code || 
            new Date(user.verificationCode.expiresAt) < new Date()) {
            return res.status(400).json({ message: 'Código inválido ou expirado' });
        }

        // Se o usuário já tem um token, retorna ele
        if (user.authToken) {
            return res.json({
                token: user.authToken,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '100y' } // Token válido por 100 anos
        );

        // Atualizar usuário
        await User.update(user.id, {
            isVerified: true,
            authToken: token,
            verificationCode: null
        });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Atualizar nome do usuário
exports.updateUserName = async (req, res) => {
    try {
        const { email, name } = req.body;

        if (!email || !name) {
            return res.status(400).json({ message: 'Email e nome são obrigatórios' });
        }

        const user = await User.findByEmail(email);
        
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const updatedUser = await User.update(user.id, { name });

        res.json({
            message: 'Nome atualizado com sucesso',
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Listar todos os usuários
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Buscar um usuário específico
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 