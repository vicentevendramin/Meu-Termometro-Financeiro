import React, { useState, useEffect } from 'react';
import type { User, Transaction } from '../types';
import { apiService } from '../services/apiService'; 
import { Pencil, Trash2 } from 'lucide-react'; // Ícones

import CategoryChart from '../components/CategoryChart';
import GoalsList from '../components/GoalsList';

interface DashboardPageProps {
  user: User;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onEdit, onDelete }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Este useEffect agora vai rodar toda vez que o componente
  // for remontado (quando a 'key' do App.tsx mudar)
  useEffect(() => {
    console.log("DashboardPage: Buscando transações...");
    setLoading(true);
    apiService.getTransactions()
      .then(data => {
        setTransactions(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []); // O array vazio ainda está correto, pois o componente *inteiro* é remontado

  const summary = transactions.reduce((acc, tx) => {
    if (tx.type === 'income') {
      acc.totalReceitas += tx.amount;
    } else if (tx.type === 'expense') {
      acc.totalDespesas += tx.amount;
    }
    acc.saldoMes = acc.totalReceitas - acc.totalDespesas;
    return acc;
  }, { totalReceitas: 0, totalDespesas: 0, saldoMes: 0 });


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Coluna Principal (esquerda) */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Receitas</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? '...' : `R$ ${summary.totalReceitas.toFixed(2)}`}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-red-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Despesas</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? '...' : `R$ ${summary.totalDespesas.toFixed(2)}`}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Saldo</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? '...' : `R$ ${summary.saldoMes.toFixed(2)}`}
            </p>
          </div>
        </div>

        {/* Lançamentos Recentes */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Lançamentos Recentes
          </h3>
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-500">Carregando transações...</p>
            ) : transactions.length === 0 ? (
              <p className="text-gray-500">Nenhuma transação encontrada.</p>
            ) : (
              // Mostra apenas as 5 transações mais recentes
              transactions.slice(0, 5).map((t) => (
                <div key={t.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{t.description}</p>
                    <p className="text-sm text-gray-500">{t.category}</p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <p className={`font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                    </p>
                  </div>
                  {/* Botões de Ação */}
                  <div className="flex-shrink-0 ml-4 space-x-2">
                    <button
                      onClick={() => onEdit(t)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(t.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      
      </div>

      {/* Coluna Lateral (direita) */}
      <div className="lg:col-span-1 space-y-8">
        <CategoryChart />
        <GoalsList />
      </div>

    </div>
  );
};

export default DashboardPage;
