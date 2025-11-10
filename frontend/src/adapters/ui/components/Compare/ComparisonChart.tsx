import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { ComparisonData } from '../../../../core/domain/entities/Comparison';
import { TARGET_INTENSITY } from '../../../../core/domain/entities/Comparison';

interface Props {
  data: ComparisonData[];
}

const ComparisonChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">GHG Intensity Comparison</h3>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="routeId" 
            label={{ value: 'Route ID', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            label={{ value: 'GHG Intensity (gCO₂e/MJ)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: number) => value.toFixed(2)}
            contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '8px' }}
          />
          <Legend />
          
          <ReferenceLine 
            y={TARGET_INTENSITY} 
            stroke="#ef4444" 
            strokeDasharray="5 5"
            label={{ value: 'Target', position: 'right', fill: '#ef4444' }}
          />
          
          <Bar 
            dataKey="baseline" 
            fill="#3b82f6" 
            name="Baseline"
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="comparison" 
            fill="#10b981" 
            name="Comparison"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;
