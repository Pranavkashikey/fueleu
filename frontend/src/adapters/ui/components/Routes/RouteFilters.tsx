import React, { useState } from 'react';
import type { RouteFilters } from '../../../../core/domain/entities/Route';

interface Props {
  onFilterChange: (filters: RouteFilters) => void;
}

const RouteFilters: React.FC<Props> = ({ onFilterChange }) => {
  const [vesselType, setVesselType] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [year, setYear] = useState('');

  const handleApplyFilters = () => {
    const filters: RouteFilters = {};
    if (vesselType) filters.vesselType = vesselType;
    if (fuelType) filters.fuelType = fuelType;
    if (year) filters.year = parseInt(year);
    
    onFilterChange(filters);
  };

  const handleReset = () => {
    setVesselType('');
    setFuelType('');
    setYear('');
    onFilterChange({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label 
            htmlFor="vessel-type-filter" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Vessel Type
          </label>
          <select
            id="vessel-type-filter"
            value={vesselType}
            onChange={(e) => setVesselType(e.target.value)}
            aria-label="Filter by vessel type"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="Container">Container</option>
            <option value="BulkCarrier">Bulk Carrier</option>
            <option value="Tanker">Tanker</option>
            <option value="RoRo">RoRo</option>
          </select>
        </div>

        <div>
          <label 
            htmlFor="fuel-type-filter" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Fuel Type
          </label>
          <select
            id="fuel-type-filter"
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            aria-label="Filter by fuel type"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="HFO">HFO</option>
            <option value="LNG">LNG</option>
            <option value="MGO">MGO</option>
          </select>
        </div>

        <div>
          <label 
            htmlFor="year-filter" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Year
          </label>
          <input
            id="year-filter"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2024"
            aria-label="Filter by year"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={handleApplyFilters}
            aria-label="Apply filters"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Apply
          </button>
          <button
            onClick={handleReset}
            aria-label="Reset all filters"
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteFilters;  // ← This MUST be here (not "export type")
