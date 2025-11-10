import React from 'react';
import type { Route } from '../../../../core/domain/entities/Route';

interface Props {
  routes: Route[];
  onSetBaseline: (routeId: string) => void;
}

const RouteTable: React.FC<Props> = ({ routes, onSetBaseline }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">Route ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Vessel Type</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Fuel Type</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Year</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">GHG Intensity (gCO₂e/MJ)</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">Fuel (t)</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">Distance (km)</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">Emissions (t)</th>
            <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                No routes found
              </td>
            </tr>
          ) : (
            routes.map((route) => (
              <tr key={route.routeId} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-sm font-medium">{route.routeId}</td>
                <td className="px-4 py-3 text-sm">{route.vesselType}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {route.fuelType}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{route.year}</td>
                <td className="px-4 py-3 text-sm text-right font-mono">
                  {route.ghgIntensity.toFixed(1)}
                </td>
                <td className="px-4 py-3 text-sm text-right">{route.fuelConsumption}</td>
                <td className="px-4 py-3 text-sm text-right">{route.distance.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-right">{route.totalEmissions}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onSetBaseline(route.routeId)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                  >
                    Set Baseline
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RouteTable;
