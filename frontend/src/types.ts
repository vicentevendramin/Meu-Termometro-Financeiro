export interface User {
  id: string;
  email: string;
  name?: string; // Deixamos 'name' como opcional, mas a API não o envia
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense'; 
  category: string;
}

export type NewTransactionData = Omit<Transaction, 'id' | 'date'>;

export interface Goal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
}

export type ActiveView = 'dashboard' | 'transactions' | 'goals' | 'reports';
