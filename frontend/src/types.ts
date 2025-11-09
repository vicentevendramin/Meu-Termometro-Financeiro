/**
 * Representa um usuário autenticado no sistema.
 */
export interface User {
  id: string;
  email: string;
}

/**
 * Representa uma única transação financeira.
 */
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string; // Usamos string para simplificar (ex: "2025-11-08")
  type: 'income' | 'expense'; // 'income' (Receita) ou 'expense' (Despesa)
  category: string;
}

/**
 * Tipo para o estado de navegação (nosso roteador simples)
 */
export type Page = 'login' | 'register' | 'dashboard';
