import React from 'react';
import type { User, ActiveView } from '../types';

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
}

const AppLayout: React.FC<AppLayoutProps> = ({
  user,
  onLogout,
  activeView,
  onViewChange,
  onOpenModal,
  contentKey
}) => {

  // Renderiza a página correta baseada na 'activeView'
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardPage user={user} key={contentKey} />;
      case 'transactions':
        return <TransactionsPage key={contentKey} />;
      case 'goals':
        return <GoalsPage key={contentKey} />;
      case 'reports':
        return <ReportsPage key={contentKey} />;
      default:
        return <DashboardPage user={user} key={contentKey} />;
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
