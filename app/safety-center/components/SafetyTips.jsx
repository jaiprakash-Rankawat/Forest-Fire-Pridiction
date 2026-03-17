"use client";

import React from "react";
import { FaCheckCircle, FaTimesCircle, FaTractor, FaTrash, FaSmokingBan, FaCampground } from "react-icons/fa";

export default function SafetyTips() {
  const dos = [
    { icon: <FaCampground />, text: "Use designated fire rings for campfires and completely extinguish them before leaving." },
    { icon: <FaTractor />, text: "Keep off-road vehicles on designated trails to prevent hot exhaust from igniting dry grass." },
    { icon: <FaCheckCircle />, text: "Report unattended fires or suspicious smoke immediately to local authorities." },
    { icon: <FaCheckCircle />, text: "Create a defensible space around your home by clearing dry leaves and brush." }
  ];

  const donts = [
    { icon: <FaSmokingBan />, text: "Never discard burning cigarettes or matches out of a moving vehicle." },
    { icon: <FaTrash />, text: "Do not burn debris or agricultural waste on windy or dry days." },
    { icon: <FaTimesCircle />, text: "Never leave a fire unattended, even for a short time." },
    { icon: <FaTimesCircle />, text: "Avoid using equipment that creates sparks near dry vegetation." }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full">
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-4">
        <h3 className="text-white font-bold text-xl flex items-center">
          <span className="text-2xl mr-2">🛡️</span> Fire Prevention Guidelines
        </h3>
      </div>
      
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-bold text-green-700 mb-4 flex items-center border-b pb-2">
            <FaCheckCircle className="mr-2" /> What to Do
          </h4>
          <ul className="space-y-4 text-gray-700">
            {dos.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mt-1 mr-3 flex-shrink-0 text-lg">{item.icon}</span>
                <span className="leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-bold text-red-700 mb-4 flex items-center border-b pb-2">
            <FaTimesCircle className="mr-2" /> What to Avoid
          </h4>
          <ul className="space-y-4 text-gray-700">
            {donts.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mt-1 mr-3 flex-shrink-0 text-lg">{item.icon}</span>
                <span className="leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
