"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import RajasthanPredictionForm from "../components/RajasthanPredictionForm";
import "./map-styles.css";

// Dynamic import for Map to avoid SSR issues
const RajasthanFireMap = dynamic(
  () => import("../components/RajasthanFireMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-gray-50 text-gray-400">
        <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading Map...
      </div>
    ),
  }
);

export default function RajasthanPredictionPage() {
  const [selectedForest, setSelectedForest] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [highlightedZoneKey, setHighlightedZoneKey] = useState(null);
  const mapSectionRef = useRef(null);

  const fallbackHighRiskZone =
    predictionResult?.zoneRisks?.length > 0
      ? predictionResult.zoneRisks.reduce((prev, curr) =>
          prev.probability > curr.probability ? prev : curr
        )
      : null;

  const handlePredictedZoneClick = (zone) => {
    if (!zone) return;
    setHighlightedZoneKey(zone.zoneId || zone.zoneName);
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-700 text-white py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4">
            Rajasthan Forest Fire Prediction
          </h1>
          <p className="text-sm sm:text-base md:text-xl max-w-3xl text-orange-100">
            Analyze fire risks in Rajasthan's top wildlife sanctuaries using
            zone-based prediction models and real-time environmental data.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
          {/* Left Column: Form & Controls */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <RajasthanPredictionForm
              onForestSelect={setSelectedForest}
              onPredictionResult={setPredictionResult}
            />

            {/* Prediction Summary Panel */}
            {predictionResult && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-fire-500 animate-fade-in">
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 border-b pb-2">
                    Forest Fire Prediction Report
                  </h2>

                  {/* SECTION 1: RESULT BASED ON PRESENT DATA */}
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-base sm:text-lg font-bold text-blue-800 mb-3 flex items-center">
                      <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 border border-blue-200">
                        1
                      </span>
                      Result Based on Present Data
                    </h3>

                    <div className="bg-slate-50 rounded-lg p-3 sm:p-4 border border-slate-100">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                        <span className="text-sm sm:text-base text-gray-600 font-medium">
                          Current Overall Risk:
                        </span>
                        <span
                          className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold uppercase text-center
                          ${
                            predictionResult.overallRisk === "Extreme"
                              ? "bg-red-100 text-red-800"
                              : predictionResult.overallRisk === "High"
                              ? "bg-orange-100 text-orange-800"
                              : predictionResult.overallRisk === "Moderate"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {predictionResult.overallRisk}
                        </span>
                      </div>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                        {predictionResult.analysis.split("Critical Areas:")[0]}
                      </p>
                    </div>
                  </div>

                  {/* SECTION 2: PREDICTED LOCATIONS */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-red-800 mb-3 flex items-center">
                      <span className="bg-red-100 text-red-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 border border-red-200">
                        2
                      </span>
                      Predicted High-Risk Locations
                    </h3>

                    <div className="bg-red-50 rounded-lg p-3 sm:p-4 border border-red-100 mb-4 sm:mb-6">
                      <div className="mb-3">
                        <span className="block text-xs text-red-600 uppercase font-semibold mb-2">
                          Most Vulnerable Zones
                        </span>
                        <div className="space-y-2">
                          {predictionResult.highRiskZones &&
                          predictionResult.highRiskZones.length > 0 ? (
                            predictionResult.highRiskZones.map((z, i) => (
                              <div
                                key={i}
                                className="flex items-center text-red-900 font-bold text-base sm:text-lg cursor-pointer hover:bg-red-100/60 rounded-md px-2 py-1 -mx-2"
                                onClick={() => handlePredictedZoneClick(z)}
                              >
                                <span className="w-4 h-4 rounded-full bg-red-600 border-2 border-red-200 mr-3 flex-shrink-0 animate-pulse"></span>
                                <span className="flex-1">{z.zoneName}</span>
                                <span className="ml-2 text-xs font-normal bg-red-200 text-red-800 px-2 py-0.5 rounded-full whitespace-nowrap">
                                  {z.riskLevel}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div
                              className="flex items-center text-red-900 font-bold text-base sm:text-lg cursor-pointer hover:bg-red-100/60 rounded-md px-2 py-1 -mx-2"
                              onClick={() =>
                                handlePredictedZoneClick(fallbackHighRiskZone)
                              }
                            >
                              <span className="w-4 h-4 rounded-full bg-red-600 border-2 border-red-200 mr-3 flex-shrink-0 animate-pulse"></span>
                              {fallbackHighRiskZone?.zoneName}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-red-600 mt-2 italic ml-7">
                          * Locations marked with Red Circle on map
                        </div>
                      </div>

                      {predictionResult.peakRiskMonth && (
                        <div className="mt-4 pt-3 border-t border-red-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <span className="text-sm text-red-800 font-medium">
                            Peak Risk Month:
                          </span>
                          <span className="text-sm font-bold text-red-900 bg-white px-2 py-0.5 rounded border border-red-100 text-center">
                            {predictionResult.peakRiskMonth}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RESTORED: Contributing Factors Cards */}
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 border-b pb-2">
                      Contributing Factors
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {predictionResult.contributingFactors.map(
                        (factor, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border-l-4 ${
                              factor.impact === "Critical"
                                ? "bg-red-50 border-red-500"
                                : factor.impact === "Severe"
                                ? "bg-red-50 border-red-600"
                                : factor.impact === "High"
                                ? "bg-orange-50 border-orange-500"
                                : factor.impact === "Mitigating"
                                ? "bg-green-50 border-green-500"
                                : "bg-yellow-50 border-yellow-500"
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className="font-bold text-sm text-gray-800">
                                {factor.factor}
                              </span>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white bg-opacity-50 whitespace-nowrap">
                                {factor.impact}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {factor.description}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 text-right mt-4 sm:mt-6">
                    Calculated at:{" "}
                    {new Date(predictionResult.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Risk Level Legend
              </h4>
              <div className="grid grid-cols-2 sm:flex sm:justify-between gap-2 text-xs">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-1 flex-shrink-0"></span>{" "}
                  <span className="truncate">Low (&lt;30%)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-yellow-500 mr-1 flex-shrink-0"></span>{" "}
                  <span className="truncate">Moderate (30-50%)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-orange-500 mr-1 flex-shrink-0"></span>{" "}
                  <span className="truncate">High (50-75%)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-1 flex-shrink-0"></span>{" "}
                  <span className="truncate">Extreme (&gt;75%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Map Visualization */}
          <div
            ref={mapSectionRef}
            className="lg:col-span-7 h-[400px] sm:h-[500px] md:h-[600px] lg:h-auto lg:min-h-[700px] lg:sticky lg:top-8"
          >
            <div className="h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 relative">
              <RajasthanFireMap
                selectedForest={selectedForest}
                predictionResult={predictionResult}
                highlightedZoneKey={highlightedZoneKey}
              />

              {/* Overlay info if no prediction yet */}
              {!predictionResult && selectedForest && (
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-lg shadow-md border border-gray-200 z-[1000]">
                  <p className="text-gray-600 text-center text-xs sm:text-sm">
                    Map centered on <b>{selectedForest.name}</b>. Fill out
                    parameters and run analysis to see zone-specific risk
                    overlays.
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
