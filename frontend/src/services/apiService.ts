import type { User, Transaction, NewTransactionData } from '../types';

/**
 * Simula a verificação de um usuário logado (essencial para o app não deslogar ao recarregar)
 */
const checkAuthStatus = (): Promise<User | null> => {
  console.log('SERVICE: checkAuthStatus()');
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail'); // Precisamos saber quem é o usuário

      if (token && userEmail) {
        // Se temos o token e o email, simulamos o usuário logado
        resolve({
          id: '1', // Na vida real, o ID viria do token
          email: userEmail,
        });
      } else {
        // Se não, usuário não está logado
        resolve(null);
      }
    }, 300); // Rápida verificação
  });
};

/**
 * Simula o logout, limpando o localStorage
 */
const logout = (): Promise<void> => {
  console.log('SERVICE: logout()');
  return new Promise((resolve) => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    resolve();
  });
};

// Dados mockados (movidos para fora para que addTransaction possa alterá-los)
let mockTransactions: Transaction[] = [
  { id: 't1', description: 'Salário', amount: 5000, date: '2025-11-01', type: 'income', category: 'Receitas' },
  { id: 't2', description: 'Aluguel', amount: 1500, date: '2025-11-05', type: 'expense', category: 'Moradia' },
  { id: 't3', description: 'Supermercado', amount: 450, date: '2025-11-07', type: 'expense', category: 'Alimentação' },
];

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
          // *** LINHAS ADICIONADAS ***
          // Precisamos salvar o token E o email para o checkAuthStatus funcionar
          localStorage.setItem('token', 'fake-token-123-xyz');
          localStorage.setItem('userEmail', email);
          // **************************

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
        // Retorna a lista atual de transações
        resolve([...mockTransactions]); // Retorna uma cópia
      }, 500);
    });
  },

  /**
   * Simula a adição de uma nova transação.
   */
  addTransaction: (data: NewTransactionData): Promise<Transaction> => {
    console.log('SERVICE: addTransaction()', data);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTransaction: Transaction = {
          ...data,
          id: `t${Math.floor(Math.random() * 1000)}`, // ID aleatório
          date: new Date().toISOString().split('T')[0], // Data de hoje
        };
        // Adiciona no início da lista
        mockTransactions.unshift(newTransaction);
        resolve(newTransaction);
      }, 500);
    });
  },

  checkAuthStatus,
  logout,
};
