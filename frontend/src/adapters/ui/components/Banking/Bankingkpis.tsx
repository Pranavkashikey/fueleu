import React from 'react';
import type { ComplianceBalance } from '../../../../core/domain/entities/ComplianceBalance';

interface Props {
  cb: ComplianceBalance | null;
}

const BankingKPIs: React.FC<Props> = ({ cb }) => {
  if (!cb) {
    return (
      <div className="text-center py-8 text-gray-500">
        No compliance balance data available
      </div>
    );
  }

  const cbValue = cb?.cbGco2eq ?? 0; // ✅ Safe fallback

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* CB Balance */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
        <p className="text-sm text-gray-600 mb-2">CB Balance</p>
        <p className={`text-3xl font-bold ${cbValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {cbValue.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500 mt-1">gCO₂eq</p>
      </div>

      {/* Ship Info */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
        <p className="text-sm text-gray-600 mb-2">Ship ID</p>
        <p className="text-2xl font-bold text-gray-800">
          {cb.shipId ?? 'N/A'}
        </p>
        <p className="text-xs text-gray-500 mt-1">Year: {cb.year ?? 'N/A'}</p>
      </div>

      {/* Status */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
        <p className="text-sm text-gray-600 mb-2">Status</p>
        <p className={`text-xl font-bold ${cbValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {cbValue >= 0 ? '✅ Surplus' : '❌ Deficit'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {cbValue >= 0 ? 'Can bank surplus' : 'Need to reduce or apply banked'}
        </p>
      </div>
    </div>
  );
};

export default BankingKPIs;
