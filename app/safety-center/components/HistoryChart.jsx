"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function HistoryChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = [
    { year: "2018", incidents: 37049 },
    { year: "2019", incidents: 30006 },
    { year: "2020", incidents: 28416 },
    { year: "2021", incidents: 345989 },
    { year: "2022", incidents: 137834 },
    { year: "2023", incidents: 216345 },
    { year: "2024", incidents: 184500 }
  ];

  if (!isMounted) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fire-600"></div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-xl rounded-lg">
          <p className="font-bold text-gray-800 border-b pb-1 mb-2">Year: {label}</p>
          <p className="text-fire-600 font-semibold">
            {payload[0].value.toLocaleString()} incidents
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full">
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 flex justify-between items-center">
        <h3 className="text-white font-bold text-xl flex items-center">
          <span className="text-2xl mr-2">📊</span> Historical Fire Incidents (India)
        </h3>
        <span className="text-xs bg-gray-600 text-gray-200 px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
          Yearly Data
        </span>
      </div>
      
      <div className="p-6 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontWeight: '500'}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontWeight: '500'}} tickFormatter={(value) => `${value / 1000}k`} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: '#F3F4F6'}} />
            <Legend wrapperStyle={{paddingTop: '20px'}} />
            <Bar dataKey="incidents" name="Reported Fire Alerts" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={entry.incidents > 200000 ? '#DC2626' : '#F97316'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
