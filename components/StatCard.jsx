'use client';

import React from 'react';
import { CardComponent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, changeType, icon: Icon }) {
  const isPositive = changeType === 'positive';
  const changeIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <CardComponent className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          {Icon && <Icon className="w-6 h-6 text-blue-600" />}
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center">
          {React.createElement(changeIcon, {
            className: `w-4 h-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`
          })}
          <span className={`ml-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
          <span className="ml-1 text-sm text-gray-500">from last month</span>
        </div>
      )}
    </CardComponent>
  );
}