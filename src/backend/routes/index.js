const express = require('express');
const routes = express.Router();

const AuthController = require('../controllers/authController');
const TicketController = require('../controllers/ticketController');

const authMiddleware = require('../middlewares/auth');
const uploadMiddleware = require('../middlewares/upload');

// Rotas Públicas (Autenticação)
routes.post('/auth/register', AuthController.register);
routes.post('/auth/login', AuthController.login);

// Rotas Protegidas (Exigem JWT)
routes.use(authMiddleware);

// Operações de Chamados
routes.post('/tickets', uploadMiddleware.single('attachment'), TicketController.create);
routes.get('/tickets', TicketController.listAll);
routes.put('/tickets/:id', TicketController.updateStatus);

module.exports = routes;