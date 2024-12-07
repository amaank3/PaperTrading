import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TradingChart = ({ selectedAsset }) => {
  // Sample data - in production, fetch real historical data
  const data = [
    { time: '9:00', price: 100 },
    { time: '10:00', price: 105 },
    { time: '11:00', price: 102 },
    { time: '12:00', price: 108 },
    { time: '13:00', price: 106 },
    { time: '14:00', price: 110 },
  ];

  if (!selectedAsset) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Select an asset to view price chart
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TradingChart;