import type { Transaction } from '../types';
import CategoryChart from '../components/CategoryChart';
import GoalsList from '../components/GoalsList';

// Dados mockados para os lançamentos
const mockTransactions: Transaction[] = [
  { id: '1', description: 'Salário', amount: 5000, type: 'receita', date: '2025-11-05', category: 'Salário' },
  { id: '2', description: 'Aluguel', amount: 1500, type: 'despesa', date: '2025-11-05', category: 'Moradia' },
  { id: '3', description: 'Supermercado', amount: 650, type: 'despesa', date: '2025-11-03', category: 'Alimentação' },
  { id: '4', description: 'Conta de Luz', amount: 120, type: 'despesa', date: '2025-11-01', category: 'Contas' },
];

export default function DashboardPage() {
  // Lógica de cálculo (ainda mockada)
  const receitas = 5000;
  const despesas = 2270;
  const saldo = receitas - despesas;

  return (
    // O layout em Grid que vimos no seu Figma
    // 1 coluna no celular, 3 colunas em telas grandes (lg)
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Coluna Principal (ocupa 2 das 3 colunas em telas grandes) */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Seção dos Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Receitas */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Receitas</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              R$ {receitas.toFixed(2)}
            </p>
          </div>
          
          {/* Card Despesas */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-red-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Despesas</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              R$ {despesas.toFixed(2)}
            </p>
          </div>
          
          {/* Card Saldo */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Saldo</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              R$ {saldo.toFixed(2)}
            </p>
          </div>
        </div> {/* Fim dos Cards de Resumo */}

        {/* Seção de Lançamentos Recentes */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Lançamentos Recentes
          </h3>
          <div className="space-y-4">
            {mockTransactions.map((t) => (
              <div key={t.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">{t.description}</p>
                  <p className="text-sm text-gray-500">{t.category}</p>
                </div>
                <p className={`font-medium ${t.type === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'receita' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div> {/* Fim dos Lançamentos Recentes */}
      
      </div> {/* Fim da Coluna Principal */}

      {/* Coluna Lateral (Sidebar - ocupa 1 das 3 colunas em telas grandes) */}
      <div className="lg:col-span-1 space-y-8">
        <CategoryChart />
        <GoalsList />
      </div> {/* Fim da Coluna Lateral */}

    </div> /* Fim do Grid Layout */
  );
}
