import React from 'react';

const GoalsPage: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">
        Minhas Metas
      </h3>
      <div className="text-center text-gray-500 py-10">
        <p className="text-lg">Página de Metas em construção.</p>
        <p>Em breve você poderá cadastrar e acompanhar seus objetivos aqui!</p>
      </div>
      {/* O componente <GoalsList /> que já existe poderia ser movido para cá */}
    </div>
  );
};

export default GoalsPage;
