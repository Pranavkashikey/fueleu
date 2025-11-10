import React, { useState, useEffect } from 'react';
import { usePooling } from '../../hooks/usePooling';
import PoolMembersList from './PoolMembersList';


const PoolingTab: React.FC = () => {
  const { members, loading, error, fetchMembers, createPool } = usePooling();
  const [year, setYear] = useState(2024);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [poolSum, setPoolSum] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchMembers(year);
  }, [year]);

  useEffect(() => {
    const sum = members
      .filter(m => selectedMembers.includes(m.shipId))
      .reduce((acc, m) => acc + m.adjustedCB, 0);
    
    setPoolSum(sum);
    setIsValid(sum >= 0 && selectedMembers.length > 0);
  }, [selectedMembers, members]);

  const handleToggleMember = (shipId: string) => {
    setSelectedMembers(prev =>
      prev.includes(shipId)
        ? prev.filter(id => id !== shipId)
        : [...prev, shipId]
    );
  };

  const handleCreatePool = async () => {
    if (!isValid) {
      alert('Invalid pool: Sum of adjusted CB must be ≥ 0');
      return;
    }
    console.log('Creating pool with:', { members: selectedMembers, year });

    const result = await createPool({ members: selectedMembers, year });
    if (result.success) {
      setSuccessMessage('Pool created successfully!');
      setSelectedMembers([]);

      await fetchMembers(year);

      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Pooling (Article 21)</h2>

      <div className="mb-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Pooling Mechanism:</strong> Multiple ships can pool their compliance balances through private agreements.
        </p>
        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
          <li>Sum of adjusted CB must be ≥ 0</li>
          <li>Deficit ships cannot exit worse than entry</li>
          <li>Surplus ships cannot exit with negative CB</li>
        </ul>
      </div>

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

      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <label htmlFor="pooling-year" className="block text-sm font-medium text-gray-700 mb-2">
          Select Year:
        </label>
        <input
          id="pooling-year"
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          min="2024"
          max="2050"
          aria-label="Select year for pooling"
          className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pool Sum:</p>
            <p className={`text-3xl font-bold ${poolSum >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {poolSum.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Selected Ships:</p>
            <p className="text-3xl font-bold text-blue-600">{selectedMembers.length}</p>
          </div>
        </div>
        
        {!isValid && selectedMembers.length > 0 && (
          <p className="mt-3 text-sm text-red-600">
            ⚠️ Invalid pool: Sum must be ≥ 0
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <PoolMembersList
            members={members}
            selectedMembers={selectedMembers}
            onToggleMember={handleToggleMember}
          />

          <div className="mt-6">
            <button
              onClick={handleCreatePool}
              disabled={!isValid || loading}
              aria-label="Create pool with selected ships"
              className="px-8 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-lg font-semibold"
            >
              Create Pool
            </button>

            
          </div>
        </>
      )}
    </div>
  );
};

export default PoolingTab;
