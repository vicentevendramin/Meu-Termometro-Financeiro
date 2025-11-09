import React, { useState, useEffect } from 'react';
import type { Transaction } from '../types';
import { apiService } from '../services/apiService';

// (Este componente é uma versão simplificada do Dashboard)
const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiService.getTransactions()
      .then(data => {
        setTransactions(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">
        Todas as Transações
      </h3>
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500">Carregando transações...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500">Nenhuma transação encontrada.</p>
        ) : (
          transactions.map((t) => (
            <div key={t.id} className="flex justify-between items-center p-3 rounded-lg border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">{t.description}</p>
                <p className="text-sm text-gray-500">{t.category} - {new Date(t.date).toLocaleDateString()}</p>
              </div>
              <p className={`font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
