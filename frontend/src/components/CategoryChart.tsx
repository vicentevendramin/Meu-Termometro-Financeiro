import React from 'react';

const CategoryChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Gastos por Categoria</h3>
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        {/* Um gráfico de pizza/donut (ex: Recharts, Chart.js) iria aqui */}
        <p className="text-gray-500">Placeholder para o Gráfico 📈</p>
      </div>
    </div>
  );
};

export default CategoryChart;
