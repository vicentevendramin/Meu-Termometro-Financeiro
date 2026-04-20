const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

/**
 * POST /api/auth/register
 * Body: { email, password }
 */
const register = async (req, res) => {
  const { email, password } = req.body;

  // Validações básicas
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Formato de email inválido.' });
  }

  try {
    // Verifica se o email já está em uso
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Este email já está cadastrado.' });
    }

    // Gera o hash da senha (custo 12 = bom equilíbrio segurança/performance)
    const password_hash = await bcrypt.hash(password, 12);

    // Insere o usuário no banco
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email.toLowerCase().trim(), password_hash]
    );

    const user = result.rows[0];

    // Gera o JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(201).json({
      token,
      user: { id: String(user.id), email: user.email },
    });
  } catch (err) {
    console.error('Erro em register:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    // Busca o usuário pelo email
    const result = await pool.query(
      'SELECT id, email, password_hash FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      // Mensagem genérica para não revelar se o email existe
      return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }

    const user = result.rows[0];

    // Compara a senha com o hash
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }

    // Gera o JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      token,
      user: { id: String(user.id), email: user.email },
    });
  } catch (err) {
    console.error('Erro em login:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

/**
 * GET /api/auth/me
 * Protegida por authMiddleware — retorna os dados do usuário logado
 */
const me = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const user = result.rows[0];
    return res.status(200).json({
      user: { id: String(user.id), email: user.email },
    });
  } catch (err) {
    console.error('Erro em me:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = { register, login, me };
