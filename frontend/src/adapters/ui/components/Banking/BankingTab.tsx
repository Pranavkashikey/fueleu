import React, { useState, useEffect } from 'react';
import { useBanking } from '../../hooks/useBanking';
import BankingKPIs from './Bankingkpis';

const BankingTab: React.FC = () => {
  const { cb, availableBanked, loading, error, fetchCB, bankSurplus, applyBanked } = useBanking();
  const [shipId, setShipId] = useState('SHIP001'); 
  const [year, setYear] = useState(2024);
  const [amount, setAmount] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    
    fetchCB(shipId, year);
  }, [year, shipId]);

const handleBankSurplus = async () => {
  if (!amount || parseFloat(amount) <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  const amountValue = parseFloat(amount);


  if (!cb || cb.cbGco2eq <= 0) {
    alert('Cannot bank surplus: Compliance balance must be positive');
    return;
  }

  
  if (amountValue > cb.cbGco2eq) {
    alert(`Cannot bank ${amountValue.toFixed(2)} gCO₂eq. Available surplus: ${cb.cbGco2eq.toFixed(2)} gCO₂eq`);
    return;
  }

  const result = await bankSurplus({ shipId, amount: amountValue, year });
  if (result.success && result.data) {
    setSuccessMessage('Surplus banked successfully!');
    setAmount('');
    setTimeout(() => setSuccessMessage(''), 3000);
  } else {
    alert(result.error || 'Failed to bank surplus');
  }
};


  const handleApplyBanked = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    
    const result = await applyBanked({ shipId, amount: parseFloat(amount), year });
    if (result.success) {
      setSuccessMessage('Banked amount applied successfully!');
      setAmount('');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Banking (Article 20)</h2>

      <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
        <p className="text-sm text-gray-700">
          <strong>Banking Mechanism:</strong> Ship operators can bank positive compliance balance 
          for future use or apply previously banked surplus to current deficit.
        </p>
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

      
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="banking-ship-id" className="block text-sm font-medium text-gray-700 mb-2">
            Select Ship:
          </label>
          <select
            id="banking-ship-id"
            value={shipId}
            onChange={(e) => setShipId(e.target.value)}
            aria-label="Select ship for banking operations"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="SHIP001">SHIP001</option>
            <option value="SHIP002">SHIP002</option>
            <option value="SHIP003">SHIP003</option>
          </select>
        </div>

        <div>
          <label htmlFor="banking-year" className="block text-sm font-medium text-gray-700 mb-2">
            Select Year:
          </label>
          <input
            id="banking-year"
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            min="2024"
            max="2050"
            aria-label="Select year for banking operations"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <BankingKPIs cb={cb} />

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Banking Actions</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="amount-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount:
                </label>
                <input
                  id="amount-input"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Enter amount"
                  step="0.01"
                  aria-label="Enter amount for banking operation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end gap-3">
                <button
                  onClick={handleBankSurplus}
                  disabled={!cb || cb.cbGco2eq <= 0 || loading}
                  aria-label="Bank positive surplus"
                  className="flex-1 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  Bank Surplus
                </button>
                <button
                  onClick={handleApplyBanked}
                  disabled={loading}
                  aria-label="Apply banked amount to deficit"
                  className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                  Apply Banked
                </button>
              </div>
            </div>

            {cb && cb.cbGco2eq <= 0 && (
              <p className="mt-4 text-sm text-red-600">
                ⚠️ Banking disabled: Compliance balance must be positive
              </p>
            )}
          </div>

          
        </>
      )}
    </div>
  );
};

export default BankingTab;
