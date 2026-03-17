"use client";

import React, { useState, useEffect } from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

export default function FireAlertSystem({ zones }) {
  const [isVisible, setIsVisible] = useState(true);

  // Determine if there is an active high risk alert
  const highRiskZones = zones?.filter(z => z.riskPercentage >= 70) || [];
  
  if (!isVisible || highRiskZones.length === 0) return null;

  return (
    <div className="bg-red-50 border-l-8 border-red-600 p-4 md:p-6 mb-8 rounded-r-xl shadow-md animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-red-500 text-3xl">⚠️</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg md:text-xl font-bold text-red-800">CRITICAL FIRE ALERT: HIGH RISK ZONES DETECTED</h3>
            <div className="mt-2 text-sm md:text-base text-red-700">
              <p className="font-medium">Severe fire risk ({">"}70%) has been identified in the following areas:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                {highRiskZones.map(zone => (
                  <li key={zone.id}>
                    <strong>{zone.name}</strong> - {zone.riskPercentage}% Risk (Temp: {zone.temperature}°C)
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-semibold">Immediate Action Required: Avoid all open flames, campfires, and agricultural burning in these areas. Report any smoke immediately.</p>
            </div>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            className="inline-flex text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors"
            onClick={() => setIsVisible(false)}
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
