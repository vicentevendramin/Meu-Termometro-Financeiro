const express = require('express');
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionsController');
const authMiddleware = require('../middleware/auth');

// Todas as rotas de transações são protegidas
router.use(authMiddleware);

// GET    /api/transactions         — lista todas (ou filtra por ?month=YYYY-MM)
router.get('/', getTransactions);

// POST   /api/transactions         — cria nova
router.post('/', addTransaction);

// PUT    /api/transactions/:id     — atualiza
router.put('/:id', updateTransaction);

// DELETE /api/transactions/:id     — deleta
router.delete('/:id', deleteTransaction);

module.exports = router;
