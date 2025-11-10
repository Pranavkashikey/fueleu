import React from 'react';
import { useComparison } from '../../hooks/useComparison';
import ComparisonTable from './ComparisonTable';
import ComparisonChart from './ComparisonChart';
import { TARGET_INTENSITY } from '../../../../core/domain/entities/Comparison';

const CompareTab: React.FC = () => {
  const { data, loading, error } = useComparison();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Baseline vs Comparison</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Error: {error}
        </div>
      )}

      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-sm text-gray-700">
          <strong>Target GHG Intensity:</strong> {TARGET_INTENSITY} gCO₂e/MJ
          <span className="text-gray-600 ml-2">(2% reduction from baseline 91.16)</span>
        </p>
      </div>

      <ComparisonTable data={data} />
      <ComparisonChart data={data} />
    </div>
  );
};

export default CompareTab;
