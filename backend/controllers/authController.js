const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function generateToken(params = {}) {
  return jwt.sign(params, process.env.JWT_SECRET, {
    expiresIn: 86400, // Expira em 24 horas
  });
}

const AuthController = {
  async register(req, res) {
    const { name, email, password, role } = req.body;

    try {
      // Verifica se o usuário já existe
      const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ error: 'E-mail já cadastrado no sistema.' });
      }

      // Hash da senha antes de salvar
      const password_hash = await bcrypt.hash(password, 10);
      const userRole = role || 'user';

      const newUser = await db.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
        [name, email, password_hash, userRole]
      );

      const user = newUser.rows[0];

      return res.status(201).json({
        user,
        token: generateToken({ id: user.id, role: user.role }),
      });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao registrar usuário: ' + err.message });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'Usuário não encontrado.' });
      }

      const user = result.rows[0];

      // Compara hashes de senha
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Senha incorreta.' });
      }

      // Remove o hash do retorno
      delete user.password_hash;

      return res.json({
        user,
        token: generateToken({ id: user.id, role: user.role }),
      });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao autenticar: ' + err.message });
    }
  },
};

module.exports = AuthController;