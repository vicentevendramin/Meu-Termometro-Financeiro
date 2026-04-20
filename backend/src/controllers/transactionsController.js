const pool = require('../config/database');

/**
 * GET /api/transactions
 * Retorna todas as transações do usuário logado.
 * Query params opcionais: ?month=2025-11 (filtra por mês)
 */
const getTransactions = async (req, res) => {
  const userId = req.user.id;
  const { month } = req.query; // ex: "2025-11"

  try {
    let query;
    let params;

    if (month && /^\d{4}-\d{2}$/.test(month)) {
      // Filtra pelo mês informado
      query = `
        SELECT id, description, amount, date, type, category, created_at
        FROM transactions
        WHERE user_id = $1
          AND TO_CHAR(date, 'YYYY-MM') = $2
        ORDER BY date DESC, created_at DESC
      `;
      params = [userId, month];
    } else {
      // Retorna todas, ordenadas por data mais recente
      query = `
        SELECT id, description, amount, date, type, category, created_at
        FROM transactions
        WHERE user_id = $1
        ORDER BY date DESC, created_at DESC
      `;
      params = [userId];
    }

    const result = await pool.query(query, params);

    // Formata para o padrão esperado pelo frontend
    const transactions = result.rows.map((t) => ({
      id: String(t.id),
      description: t.description,
      amount: parseFloat(t.amount),
      date: t.date instanceof Date
        ? t.date.toISOString().split('T')[0]
        : String(t.date),
      type: t.type,
      category: t.category,
    }));

    return res.status(200).json(transactions);
  } catch (err) {
    console.error('Erro em getTransactions:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

/**
 * POST /api/transactions
 * Body: { description, amount, date, type, category }
 */
const addTransaction = async (req, res) => {
  const userId = req.user.id;
  const { description, amount, date, type, category } = req.body;

  // Validações
  if (!description || !amount || !type || !category) {
    return res.status(400).json({
      error: 'Campos obrigatórios: description, amount, type, category.',
    });
  }
  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ error: 'type deve ser "income" ou "expense".' });
  }
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: 'amount deve ser um número positivo.' });
  }

  // Data: usa a fornecida ou hoje
  const transactionDate = date || new Date().toISOString().split('T')[0];

  try {
    const result = await pool.query(
      `INSERT INTO transactions (user_id, description, amount, date, type, category)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, description, amount, date, type, category`,
      [userId, description.trim(), parsedAmount, transactionDate, type, category.trim()]
    );

    const t = result.rows[0];
    return res.status(201).json({
      id: String(t.id),
      description: t.description,
      amount: parseFloat(t.amount),
      date: t.date instanceof Date
        ? t.date.toISOString().split('T')[0]
        : String(t.date),
      type: t.type,
      category: t.category,
    });
  } catch (err) {
    console.error('Erro em addTransaction:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

/**
 * PUT /api/transactions/:id
 * Body: { description, amount, date, type, category }
 */
const updateTransaction = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { description, amount, date, type, category } = req.body;

  // Validações
  if (!description || !amount || !type || !category) {
    return res.status(400).json({
      error: 'Campos obrigatórios: description, amount, type, category.',
    });
  }
  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ error: 'type deve ser "income" ou "expense".' });
  }
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: 'amount deve ser um número positivo.' });
  }

  try {
    // Verifica se a transação pertence ao usuário logado (segurança!)
    const existing = await pool.query(
      'SELECT id FROM transactions WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Transação não encontrada.' });
    }

    const result = await pool.query(
      `UPDATE transactions
       SET description = $1, amount = $2, date = $3, type = $4, category = $5
       WHERE id = $6 AND user_id = $7
       RETURNING id, description, amount, date, type, category`,
      [description.trim(), parsedAmount, date, type, category.trim(), id, userId]
    );

    const t = result.rows[0];
    return res.status(200).json({
      id: String(t.id),
      description: t.description,
      amount: parseFloat(t.amount),
      date: t.date instanceof Date
        ? t.date.toISOString().split('T')[0]
        : String(t.date),
      type: t.type,
      category: t.category,
    });
  } catch (err) {
    console.error('Erro em updateTransaction:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

/**
 * DELETE /api/transactions/:id
 */
const deleteTransaction = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    // Só deleta se a transação pertencer ao usuário logado
    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transação não encontrada.' });
    }

    return res.status(204).send(); // 204 No Content = sucesso sem corpo
  } catch (err) {
    console.error('Erro em deleteTransaction:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = { getTransactions, addTransaction, updateTransaction, deleteTransaction };
