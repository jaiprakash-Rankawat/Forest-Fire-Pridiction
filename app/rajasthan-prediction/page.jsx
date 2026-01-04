"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import RajasthanPredictionForm from "../components/RajasthanPredictionForm";
import './map-styles.css';

// Dynamic import for Map to avoid SSR issues
const RajasthanFireMap = dynamic(
  () => import("../components/RajasthanFireMap"),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-gray-50 text-gray-400">
        <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading Map...
      </div>
    )
  }
);

export default function RajasthanPredictionPage() {
  const [selectedForest, setSelectedForest] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Rajasthan Forest Fire Prediction</h1>
          <p className="text-xl max-w-3xl text-orange-100">
            Analyze fire risks in Rajasthan's top wildlife sanctuaries using zone-based prediction models 
            and real-time environmental data.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Column: Form & Controls */}
          <div className="lg:col-span-5 space-y-6">
            <RajasthanPredictionForm 
              onForestSelect={setSelectedForest}
              onPredictionResult={setPredictionResult}
            />

            {/* Prediction Summary Panel */}
            {predictionResult && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-fire-500 animate-fade-in">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Prediction Results</h2>
                    <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase
                      ${predictionResult.overallRisk === 'Extreme' ? 'bg-red-100 text-red-800' : 
                        predictionResult.overallRisk === 'High' ? 'bg-orange-100 text-orange-800' :
                        predictionResult.overallRisk === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                      {predictionResult.overallRisk} Risk
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {predictionResult.analysis}
                  </p>

                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Key Recommendations:</h4>
                    <ul className="space-y-1">
                      {predictionResult.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start text-sm text-blue-800">
                          <span className="mr-2">•</span>{rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-xs text-gray-500 text-right">
                    Calculated at: {new Date(predictionResult.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}
            
            {/* Legend */}
             <div className="bg-white rounded-lg shadow-sm p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Risk Level Legend</h4>
              <div className="flex justify-between text-xs">
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span> Low (&lt;30%)</div>
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span> Moderate (30-50%)</div>
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-orange-500 mr-1"></span> High (50-75%)</div>
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span> Extreme (&gt;75%)</div>
              </div>
            </div>

          </div>

          {/* Right Column: Map Visualization */}
          <div className="lg:col-span-7 h-[600px] lg:h-auto lg:min-h-[700px] sticky top-8">
            <div className="h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 relative">
              <RajasthanFireMap 
                selectedForest={selectedForest} 
                predictionResult={predictionResult} 
              />
              
              {/* Overlay info if no prediction yet */}
              {!predictionResult && selectedForest && (
                 <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md border border-gray-200 z-[1000]">
                   <p className="text-gray-600 text-center text-sm">
                     Map centered on <b>{selectedForest.name}</b>. Fill out parameters and run analysis to see zone-specific risk overlays.
                   </p>
                 </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
