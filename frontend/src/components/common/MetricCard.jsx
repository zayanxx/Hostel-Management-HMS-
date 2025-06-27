import React from 'react';

const MetricCard = ({ title, value }) => (
  <div className="bg-white shadow rounded-2xl p-4 w-full sm:w-1/2 lg:w-1/4">
    <h4 className="text-gray-600 text-sm mb-2">{title}</h4>
    <p className="text-2xl font-bold text-indigo-600">{value}</p>
  </div>
);

export default MetricCard;