"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icons issue when imported via modules
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function FireRiskMap({ zones }) {
  // Center of India roughly
  const indiaCenter = [22.9734, 78.6569];
  
  const getRiskColor = (risk) => {
    switch (risk) {
      case "Red": return "#DC2626"; // red-600
      case "Yellow": return "#EAB308"; // yellow-500
      case "Green": return "#16A34A"; // green-600
      default: return "#9CA3AF"; // gray-400
    }
  };

  const getRiskLabel = (risk) => {
    switch (risk) {
      case "Red": return "High Risk";
      case "Yellow": return "Medium Risk";
      case "Green": return "Low Risk";
      default: return "Unknown";
    }
  };

  if (!zones || zones.length === 0) {
    return (
      <div className="bg-slate-100 rounded-2xl animate-pulse h-full min-h-[400px] flex items-center justify-center">
        <span className="text-slate-400 font-semibold">Loading map data...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col z-0">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50 relative z-10">
        <h3 className="font-bold text-gray-800 flex items-center">
          <span className="text-xl mr-2">🗺️</span> Interactive Fire Risk Map
        </h3>
        <div className="flex gap-3 text-xs md:text-sm font-medium">
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-600 mr-1"></span> Low</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span> Medium</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-600 mr-1"></span> High</div>
        </div>
      </div>
      <div className="flex-1 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] isolate relative">
        <MapContainer center={indiaCenter} zoom={5} className="w-full h-full absolute inset-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {zones.map((zone) => (
            <CircleMarker
              key={zone.id}
              center={zone.location}
              radius={12}
              pathOptions={{
                color: getRiskColor(zone.riskLevel),
                fillColor: getRiskColor(zone.riskLevel),
                fillOpacity: 0.7,
                weight: 2
              }}
            >
              <Popup className="fire-popup rounded-xl">
                <div className="p-1 min-w-[200px]">
                  <h4 className="font-bold text-lg mb-2 text-gray-800 border-b pb-1">{zone.name}</h4>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mt-3">
                    <div className="text-gray-600">Status:</div>
                    <div className={`font-bold ${zone.riskLevel === 'Red' ? 'text-red-600' : zone.riskLevel === 'Yellow' ? 'text-yellow-600' : 'text-green-600'}`}>
                      {getRiskLabel(zone.riskLevel)} ({zone.riskPercentage}%)
                    </div>
                    
                    <div className="text-gray-600">Temperature:</div>
                    <div className="font-semibold">{zone.temperature}°C</div>
                    
                    <div className="text-gray-600">Humidity:</div>
                    <div className="font-semibold">{zone.humidity}%</div>
                    
                    <div className="text-gray-600">Wind Speed:</div>
                    <div className="font-semibold">{zone.windSpeed} km/h</div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
