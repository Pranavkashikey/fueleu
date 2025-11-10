import React, { useState } from 'react';
import { useRoutes } from '../../hooks/useRoutes.ts';
import RouteTable from './RouteTable.tsx';
import  RouteFilters from './RouteFilters.tsx';  // ← Simple default import (component)
import type { RouteFilters as RouteFiltersType } from '../../../../core/domain/entities/Route.ts';  // ← Type renamed

const RoutesTab: React.FC = () => {
  const { routes, loading, error, fetchRoutes, setBaseline } = useRoutes();
  const [successMessage, setSuccessMessage] = useState('');

  const handleFilterChange = (filters: RouteFiltersType) => {  // ← Use renamed type
    fetchRoutes(filters);
  };

  const handleSetBaseline = async (routeId: string) => {
    const result = await setBaseline(routeId);
    if (result.success) {
      setSuccessMessage(`Baseline set for route ${routeId}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Routes Management</h2>
      
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Error: {error}
        </div>
      )}

      <RouteFilters onFilterChange={handleFilterChange} />  {/* ← Component (original name) */}
      
      <RouteTable routes={routes} onSetBaseline={handleSetBaseline} />
    </div>
  );
};

export default RoutesTab;
