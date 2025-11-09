import type { User, Transaction } from '../types';

export const apiService = {
  /**
   * Simula o login de um usuário.
   */
  login: (email: string, password_hash: string): Promise<User> => {
    console.log('SERVICE: login()', { email, password_hash });
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simula uma resposta de sucesso
        if (email === 'teste@teste.com') {
          resolve({ id: '1', email: 'teste@teste.com' });
        } else {
          reject(new Error('Usuário ou senha inválidos'));
        }
      }, 500);
    });
  },

  /**
   * Simula o registro de um novo usuário.
   */
  register: (email: string, password_hash: string): Promise<User> => {
    console.log('SERVICE: register()', { email, password_hash });
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: '2', email: email });
      }, 500);
    });
  },

  /**
   * Simula a busca das transações do usuário.
   */
  getTransactions: (): Promise<Transaction[]> => {
    console.log('SERVICE: getTransactions()');
    return new Promise((resolve) => {
      setTimeout(() => {
        // Dados de exemplo
        resolve([
          { id: 't1', description: 'Salário', amount: 5000, date: '2025-11-01', type: 'income', category: 'Receitas' },
          { id: 't2', description: 'Aluguel', amount: 1500, date: '2025-11-05', type: 'expense', category: 'Moradia' },
          { id: 't3', description: 'Supermercado', amount: 450, date: '2025-11-07', type: 'expense', category: 'Alimentação' },
        ]);
      }, 500);
    });
  },
};
