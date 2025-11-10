import React from 'react';
import type { ComparisonData } from '../../../../core/domain/entities/Comparison';
import { TARGET_INTENSITY } from '../../../../core/domain/entities/Comparison';

interface Props {
  data: ComparisonData[];
}

const ComparisonTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg mb-8">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">Route ID</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">Baseline (gCO₂e/MJ)</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">Comparison (gCO₂e/MJ)</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">% Difference</th>
            <th className="px-4 py-3 text-center text-sm font-semibold">Compliant</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                No comparison data available
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.routeId} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-sm font-medium">{item.routeId}</td>
                <td className="px-4 py-3 text-sm text-right font-mono">
                  {item.baseline.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-right font-mono">
                  {item.comparison.toFixed(2)}
                </td>
                <td className={`px-4 py-3 text-sm text-right font-mono ${
                  item.percentDiff < 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.percentDiff > 0 ? '+' : ''}{item.percentDiff.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-center">
                  {item.compliant ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      ❌ No
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-600">
        <strong>Target Intensity:</strong> {TARGET_INTENSITY} gCO₂e/MJ (2% below baseline of 91.16)
      </div>
    </div>
  );
};

export default ComparisonTable;
