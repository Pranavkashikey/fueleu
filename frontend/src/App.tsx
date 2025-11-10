import React, { useState } from 'react';
import RoutesTab from './adapters/ui/components/Routes/RoutesTab';
import CompareTab from './adapters/ui/components/Compare/CompareTab';
import BankingTab from './adapters/ui/components/Banking/BankingTab';
import PoolingTab from './adapters/ui/components/Pooling/PoolingTab';

function App() {
  const [activeTab, setActiveTab] = useState('routes');

  const tabs = [
    { id: 'routes', label: 'Routes', icon: '🚢' },
    { id: 'compare', label: 'Compare', icon: '📊' },
    { id: 'banking', label: 'Banking', icon: '🏦' },
    { id: 'pooling', label: 'Pooling', icon: '🔄' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold">⚓ FuelEU Maritime Compliance Dashboard</h1>
          <p className="text-blue-200 mt-2 text-xs sm:text-sm">
            Monitoring GHG emissions compliance for maritime vessels
          </p>
        </div>
      </header>

      {/* Tab Navigation - ✅ RESPONSIVE */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto">
          {/* ✅ Added: flex-wrap, gap-1, overflow-x-auto for mobile */}
          <div className="flex flex-wrap sm:flex-nowrap border-b overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'border-b-4 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
                aria-label={`Switch to ${tab.label} tab`}
              >
                <span className="text-lg sm:text-xl">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden text-xs">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <main className="container mx-auto px-4 sm:px-6">
        {activeTab === 'routes' && <RoutesTab />}
        {activeTab === 'compare' && <CompareTab />}
        {activeTab === 'banking' && <BankingTab />}
        {activeTab === 'pooling' && <PoolingTab />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 sm:px-6 py-4 text-center text-xs sm:text-sm">
          <p>FuelEU Maritime Compliance Platform | Built with React + TypeScript + Tailwind CSS</p>
          <p className="text-gray-400 mt-1">Hexagonal Architecture Implementation</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
