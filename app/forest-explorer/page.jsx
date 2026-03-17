"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import ForestSearchBar from "./components/ForestSearchBar";
import LocationWeatherPanel from "./components/LocationWeatherPanel";
import { INDIAN_FORESTS } from "../data/forests";

// Dynamic import to avoid SSR issues with Leaflet
const ForestExplorerMap = dynamic(
  () => import("./components/ForestExplorerMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-2xl">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mb-4" />
          <p className="text-white/60">Loading satellite map...</p>
        </div>
      </div>
    ),
  }
);

export default function ForestExplorerPage() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedForest, setSelectedForest] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  // Timer state to force re-renders every 60 seconds
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000); // 1 minute
    return () => clearInterval(timer);
  }, []);

  // Reference to the Map Container block to allow auto-scrolling
  const mapSectionRef = useRef(null);

  const handleLocationSelect = useCallback((loc) => {
    setSelectedLocation(loc);
    setPanelOpen(true);
  }, []);

  // Unified delayed handler for BOTH map clicks and search bar selections
  const handleForestSelect = useCallback((forest) => {
    // 1. Show the routing toast message immediately
    setToastMessage(`Routing satellite to ${forest.name}...`);
    // 2. Clear any open panel during routing
    setPanelOpen(false);

    // 3. Wait 3 seconds before flying and loading data
    setTimeout(() => {
      setToastMessage(null);
      setSelectedForest(forest);
      setSelectedLocation({ lat: forest.lat, lon: forest.lon });
      setPanelOpen(true); // Open the weather panel after arrival
      
      // Auto-scroll the window down to the map
      if (mapSectionRef.current) {
        mapSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 3000);
  }, []);

  const handleAlertClick = (alertLocationString) => {
    // The alert location format is "Name of Forest, State"
    const forestName = alertLocationString.split(',')[0].trim();
    const foundForest = INDIAN_FORESTS.find(f => f.name === forestName);
    
    if (foundForest) {
      handleForestSelect(foundForest);
    } else {
      alert("Forest coordinates not available for direct routing.");
    }
  };

  const getTimeAgo = (date) => {
    const diffInMinutes = Math.floor((now - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes === 1) return "1 min ago";
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  // Pre-calculate fixed timestamps so they don't reset on every render block
  // We use useState solely so they initialize once on mount
  const [alerts] = useState([
    {
      id: "alert-1",
      title: "🔥 HIGH RISK alert for Sariska Tiger Reserve micro-sectors due to 40°C heat",
      location: "Sariska Tiger Reserve, Rajasthan",
      severity: "High",
      type: "Heatwave & Dryness",
      description: "Sustained temperatures exceeding 40°C combined with <20% humidity over the past 48 hours have created highly combustible conditions in the central and southern micro-sectors.",
      time: new Date(Date.now() - 120 * 60000) // 2 hours ago
    },
    {
      id: "alert-2",
      title: "⚠️ Moderate dryness reported in southern Bandipur National Park",
      location: "Bandipur National Park, Karnataka",
      severity: "Moderate",
      type: "Vegetation Dryness",
      description: "Satellite NDVI readings indicate a sharp drop in moisture content in the southern deciduous belts. Early warning patrols have been intensified.",
      time: new Date(Date.now() - 300 * 60000) // 5 hours ago
    },
    {
      id: "alert-3",
      title: "🚨 EXTREME FIRE DANGER in Simlipal National Park — all access restricted",
      location: "Simlipal National Park, Odisha",
      severity: "Extreme",
      type: "Active Threat",
      description: "Critical fire weather conditions. High wind speeds (25km/h) and extreme surface dryness. Tourism and non-essential access have been temporarily restricted.",
      time: new Date(Date.now() - 60 * 60000) // 1 hour ago
    },
    {
      id: "alert-4",
      title: "📡 Satellite detects thermal anomalies in eastern periphery of Kaziranga",
      location: "Kaziranga National Park, Assam",
      severity: "High",
      type: "Thermal Anomaly",
      description: "NASA FIRMS has detected 3 distinct thermal hotspots near the eastern boundary. Forest squads have been dispatched for immediate ground verification.",
      time: new Date(Date.now() - 15 * 60000) // 15 mins ago
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* ─── Active Alerts Marquee ─────────────────────────────────────── */}
      <div className="bg-red-600/20 border-b border-red-500/30 text-red-100 py-2.5 overflow-hidden flex items-center shadow-[0_0_15px_rgba(220,38,38,0.2)]">
        <div className="px-4 font-bold text-red-500 tracking-wider text-sm flex-shrink-0 flex items-center gap-2 border-r border-red-500/30 mr-4">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          ACTIVE ALERTS
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee whitespace-nowrap flex gap-12 text-sm font-medium">
            {alerts.map((alert) => (
              <span key={alert.id}>{alert.title}</span>
            ))}
            {/* Duplicate for seamless looping */}
            {alerts.map((alert) => (
              <span key={`dup-${alert.id}`}>{alert.title}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Hero Header ─────────────────────────────────────────────── */}
      <div
        className="relative py-12 px-4 text-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0a1a0a 0%, #0d2e16 40%, #1a0a0a 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, #16a34a 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, #dc2626 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-30 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 rounded-full px-4 py-1.5 text-green-400 text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live Satellite Data · Forest Survey of India
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
            🛰️ Forest Fire{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              Risk Explorer
            </span>
          </h1>

          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            Explore India's forests using real-time satellite imagery. Click any
            location to get live weather and fire risk analysis powered by
            meteorological data.
          </p>

          {/* Search Bar */}
          <div className="flex justify-center">
            <ForestSearchBar onSelect={handleForestSelect} />
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 w-full max-w-5xl mx-auto mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 px-2 sm:px-0">
          {[
            { label: "National Parks", value: "107", icon: "🌲" },
            { label: "Tiger Reserves", value: "54", icon: "🐅" },
            { label: "Wildlife Sanctuaries", value: "573", icon: "🦌" },
            { label: "Biosphere Reserves", value: "18", icon: "🌿" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 transition-all hover:bg-white/10 flex flex-col items-center justify-center text-center"
            >
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{stat.icon}</div>
              <div className="text-white font-extrabold text-xl sm:text-2xl leading-tight">{stat.value}</div>
              <div className="text-green-400/80 text-xs sm:text-sm font-medium mt-1 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Data Sources Credit */}
        <div className="relative z-10 w-full max-w-4xl mx-auto mt-6 text-center px-4">
          <div className="inline-flex flex-wrap justify-center gap-x-2 sm:gap-x-3 gap-y-1.5 sm:gap-y-2 items-center text-white/40 text-[10px] sm:text-xs px-4 sm:px-6 py-2 rounded-full bg-black/20 border border-white/5">
            <span>Data integrated from:</span>
            <span className="text-white/70 font-medium whitespace-nowrap">WII</span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/20"></span>
            <span className="text-white/70 font-medium whitespace-nowrap">Global Forest Watch</span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/20"></span>
            <span className="text-white/70 font-medium whitespace-nowrap">NASA FIRMS</span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/20"></span>
            <span className="text-white/70 font-medium whitespace-nowrap">FSI</span>
          </div>
        </div>
      </div>

      {/* ─── Main Content: Map + Panel ───────────────────────────────── */}
      <div 
        ref={mapSectionRef}
        className="max-w-screen-2xl mx-auto px-4 py-6"
        style={{ scrollMarginTop: "5rem" }}
      >
        <div
          className={`flex flex-col ${
            panelOpen ? "lg:flex-row" : ""
          } gap-4 transition-all duration-500`}
        >
          {/* Map */}
          <div
            className={`${
              panelOpen ? "lg:flex-1" : "w-full"
            } rounded-3xl overflow-hidden border border-white/10 shadow-2xl`}
            style={{ minHeight: "570px" }}
          >
            <ForestExplorerMap
              onLocationSelect={handleLocationSelect}
              selectedForest={selectedForest}
              onForestSelect={handleForestSelect}
              toastMessage={toastMessage}
            />
          </div>

          {/* Weather Panel (slides in from right) */}
          {panelOpen && selectedLocation && (
            <div className="lg:w-[420px] xl:w-[460px] flex-shrink-0">
              <div className="sticky top-20">
                <LocationWeatherPanel
                  location={selectedLocation}
                  onClose={() => setPanelOpen(false)}
                />
              </div>
            </div>
          )}
        </div>

        {/* How it works */}
        {!panelOpen && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: "🗺️",
                title: "Real Satellite Imagery",
                desc: "View India's forests using high-resolution ESRI satellite imagery, just like Google Earth.",
              },
              {
                icon: "🔍",
                title: "Search & Navigate",
                desc: "Find any national park, tiger reserve, or wildlife sanctuary instantly with the smart search bar.",
              },
              {
                icon: "🔥",
                title: "Live Fire Risk Analysis",
                desc: "Click any location to get real-time weather data and AI-powered forest fire probability assessment.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/3 border border-white/10 rounded-2xl p-6 text-center hover:border-green-500/30 transition-colors"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        )}
        {/* Detailed Active Alerts Grid */}
        <div className="mt-16 mb-8">
          <div className="flex items-center gap-3 mb-6 px-2">
            <span className="text-red-500 text-2xl animate-pulse">🔴</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Active Forest Fire Alerts & Anomalies</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className="bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col relative overflow-hidden group hover:bg-black/60 transition-colors"
                style={{
                  borderTopColor: 
                    alert.severity === 'Extreme' ? '#dc2626' : 
                    alert.severity === 'High' ? '#ea580c' : '#ca8a04',
                  borderTopWidth: '4px'
                }}
              >
                {/* Background glow based on severity */}
                <div 
                  className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity"
                  style={{
                    backgroundColor: 
                      alert.severity === 'Extreme' ? '#ef4444' : 
                      alert.severity === 'High' ? '#f97316' : '#eab308'
                  }}
                />

                <div className="flex justify-between items-start mb-3 relative z-10">
                  <span className={`text-xs font-bold px-2 py-1 rounded-sm ${
                    alert.severity === 'Extreme' ? 'bg-red-500/20 text-red-500' : 
                    alert.severity === 'High' ? 'bg-orange-500/20 text-orange-500' : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {alert.severity.toUpperCase()} RISK
                  </span>
                  <span className="text-white/40 text-xs text-right bg-white/5 px-2 py-1 rounded-md">{getTimeAgo(alert.time)}</span>
                </div>

                <div className="font-bold text-white text-[15px] mb-1 relative z-10 leading-snug">{alert.location}</div>
                <div className="text-[11px] font-medium text-white/50 mb-3 uppercase tracking-wider flex items-center gap-1.5 relative z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                  {alert.type}
                </div>

                <p className="text-white/70 text-sm leading-relaxed mb-4 flex-grow relative z-10">
                  {alert.description}
                </p>

                <div className="mt-auto relative z-10">
                  <button 
                    onClick={() => {
                      // Scroll up to the map immediately so the user sees the routing animation
                      if (mapSectionRef.current) {
                        mapSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                      handleAlertClick(alert.location);
                    }}
                    className="w-full text-center text-xs font-semibold py-2 bg-white/5 hover:bg-white/10 text-white/90 rounded-xl transition-colors border border-white/5 hover:border-white/20"
                  >
                    View on Map
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
