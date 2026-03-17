"use client";

import React from "react";

export default function SafetyHeader() {
  return (
    <div className="bg-gradient-to-r from-fire-900 via-fire-700 to-fire-900 text-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-fire-600/30">
      <div className="px-6 py-12 md:px-12 md:py-16 text-center relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse ring-4 ring-red-500/50">
            <span className="text-4xl shadow-inner">🚨</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md">
            Forest Fire Safety & <span className="text-fire-300">Prediction Center</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-fire-100 font-medium tracking-wide">
            Real-time monitoring, predictive analytics, and community-driven reporting to keep our forests and people safe from devastating fires.
          </p>
        </div>
      </div>
    </div>
  );
}
