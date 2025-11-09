import React from 'react';
import type { User, ActiveView, Transaction } from '../types';

// Componentes
import Sidebar from '../components/Sidebar';
import TransactionsPage from '../pages/TransactionsPage';
import GoalsPage from '../pages/GoalsPage';
import ReportsPage from '../pages/ReportsPage';
import DashboardPage from '../pages/DashboardPage';

interface AppLayoutProps {
  user: User;
  onLogout: () => void;
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  onOpenModal: () => void;
  contentKey: number; // Para forçar o re-render
  // Props para passar para as páginas
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  user,
  onLogout,
  activeView,
  onViewChange,
  onOpenModal,
  contentKey,
  onEditTransaction,
  onDeleteTransaction
}) => {

  // Renderiza a página correta baseada na 'activeView'
  const renderActiveView = () => {
    // Passamos a 'key' E os handlers para as páginas que listam transações
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardPage
            user={user}
            key={contentKey}
            onEdit={onEditTransaction}
            onDelete={onDeleteTransaction}
          />
        );
      case 'transactions':
        return (
          <TransactionsPage
            key={contentKey}
            onEdit={onEditTransaction}
            onDelete={onDeleteTransaction}
          />
        );
      case 'goals':
        return <GoalsPage key={contentKey} />;
      case 'reports':
        return <ReportsPage key={contentKey} />;
      default:
        return (
          <DashboardPage
            user={user}
            key={contentKey}
            onEdit={onEditTransaction}
            onDelete={onDeleteTransaction}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Fixa */}
      <Sidebar
        user={user}
        onLogout={onLogout}
        activeView={activeView}
        onViewChange={onViewChange}
        onOpenModal={onOpenModal}
      />

      {/* Área de Conteúdo Principal (com scroll) */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default AppLayout;
