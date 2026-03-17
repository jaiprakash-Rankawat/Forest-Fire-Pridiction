"use client";

import React from "react";
import { FaTemperatureHigh, FaWind, FaCloudRain, FaTint } from "react-icons/fa";

export default function LiveWeatherPanel({ zones }) {
  // Calculate average weather from zones or show defaults
  const avgTemp = zones?.length ? Math.round(zones.reduce((acc, curr) => acc + curr.temperature, 0) / zones.length) : 32;
  const avgHum = zones?.length ? Math.round(zones.reduce((acc, curr) => acc + curr.humidity, 0) / zones.length) : 45;
  const avgWind = zones?.length ? Math.round(zones.reduce((acc, curr) => acc + curr.windSpeed, 0) / zones.length) : 15;
  const rainfall = 0; // Assuming dry season for these metrics

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-lg font-bold flex items-center text-gray-800">
          <span className="mr-2 text-2xl">🌦️</span> National Average Weather
        </h3>
        <p className="text-sm text-gray-500 mt-1">Based on monitored critical zones</p>
      </div>
      
      <div className="flex-1 p-6 grid grid-cols-2 gap-4">
        {/* Termperature */}
        <div className="bg-orange-50 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 duration-200">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mb-3">
            <FaTemperatureHigh className="text-xl" />
          </div>
          <span className="text-3xl font-bold text-gray-800">{avgTemp}°C</span>
          <span className="text-xs font-semibold text-orange-600 mt-1 uppercase tracking-wider">Temperature</span>
        </div>

        {/* Humidity */}
        <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 duration-200">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mb-3">
            <FaTint className="text-xl" />
          </div>
          <span className="text-3xl font-bold text-gray-800">{avgHum}%</span>
          <span className="text-xs font-semibold text-blue-600 mt-1 uppercase tracking-wider">Humidity</span>
        </div>

        {/* Wind Speed */}
        <div className="bg-teal-50 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 duration-200">
          <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
            <FaWind className="text-xl" />
          </div>
          <span className="text-3xl font-bold text-gray-800">{avgWind} <span className="text-lg">km/h</span></span>
          <span className="text-xs font-semibold text-teal-600 mt-1 uppercase tracking-wider">Wind Speed</span>
        </div>

        {/* Rainfall */}
        <div className="bg-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 duration-200">
          <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mb-3">
            <FaCloudRain className="text-xl" />
          </div>
          <span className="text-3xl font-bold text-gray-800">{rainfall} <span className="text-lg">mm</span></span>
          <span className="text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">Rainfall</span>
        </div>
      </div>
    </div>
  );
}
