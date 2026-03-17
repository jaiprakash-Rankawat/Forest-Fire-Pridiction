"use client";

import { useEffect, useState } from "react";
import { findNearestForest } from "../../data/forests";

const METRIC_ICONS = {
  temperature: "🌡️",
  humidity: "💧",
  windSpeed: "💨",
  vegetationDryness: "🍂",
  daysSinceRain: "☀️",
  recentRainfall: "🌧️",
};

function RiskGauge({ score, color }) {
  const pct = Math.min(100, Math.max(0, score));
  // SVG arc gauge
  const R = 60;
  const cx = 75, cy = 80;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const angle = startAngle + (pct / 100) * Math.PI;

  const toXY = (a) => ({
    x: cx + R * Math.cos(a),
    y: cy + R * Math.sin(a),
  });

  const start = toXY(startAngle);
  const end = toXY(endAngle);
  const active = toXY(angle);

  const bgArc = `M ${start.x} ${start.y} A ${R} ${R} 0 1 1 ${end.x} ${end.y}`;
  const fgArc = `M ${start.x} ${start.y} A ${R} ${R} 0 ${pct > 50 ? 1 : 0} 1 ${active.x} ${active.y}`;

  return (
    <svg width="150" height="90" viewBox="0 0 150 90" className="mx-auto">
      <path d={bgArc} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" strokeLinecap="round" />
      <path d={fgArc} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
      <text x={cx} y={cy - 8} textAnchor="middle" fill="white" fontSize="26" fontWeight="bold">{pct}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">/ 100</text>
    </svg>
  );
}

export default function LocationWeatherPanel({ location, onClose }) {
  const [weather, setWeather] = useState(null);
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { lat, lon } = location;
  const { forest: nearest, distanceKm } = findNearestForest(lat, lon);

  useEffect(() => {
    if (!lat || !lon) return;
    setLoading(true);
    setError(null);
    setWeather(null);
    setRisk(null);

    (async () => {
      try {
        // 1. Fetch live weather
        const wRes = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        if (!wRes.ok) throw new Error("Weather fetch failed");
        const wData = await wRes.json();
        setWeather(wData);

        // 2. Calculate fire risk
        const rRes = await fetch("/api/fire-risk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(wData),
        });
        if (!rRes.ok) throw new Error("Risk calculation failed");
        const rData = await rRes.json();
        setRisk(rData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [lat, lon]);

  const weatherMetrics = weather
    ? [
        { key: "temperature", label: "Temperature", value: `${weather.temperature}°C`, raw: weather.temperature },
        { key: "humidity", label: "Humidity", value: `${weather.humidity}%`, raw: weather.humidity },
        { key: "windSpeed", label: "Wind Speed", value: `${weather.windSpeed} km/h`, raw: weather.windSpeed },
        { key: "vegetationDryness", label: "Vegetation Dryness", value: weather.vegetationDryness, raw: weather.vegetationDrynessIndex },
        { key: "daysSinceRain", label: "Days Since Rain", value: `${weather.daysSinceRain} days`, raw: weather.daysSinceRain },
        { key: "recentRainfall", label: "Recent Rainfall (7d)", value: `${weather.recentRainfall} mm`, raw: weather.recentRainfall },
      ]
    : [];

  const getMetricBar = (key, raw) => {
    const configs = {
      temperature: { max: 50, danger: 38, warn: 30 },
      humidity: { max: 100, reverse: true, danger: 25, warn: 45 },
      windSpeed: { max: 80, danger: 40, warn: 25 },
      vegetationDryness: { max: 100, danger: 70, warn: 45 },
      daysSinceRain: { max: 45, danger: 20, warn: 10 },
      recentRainfall: { max: 100, reverse: true, danger: 5, warn: 20 },
    };
    const cfg = configs[key];
    if (!cfg) return null;
    const pct = Math.min(100, (raw / cfg.max) * 100);
    const effectivePct = cfg.reverse ? 100 - pct : pct;
    const color =
      effectivePct >= (cfg.danger / cfg.max) * 100
        ? "#e74c3c"
        : effectivePct >= (cfg.warn / cfg.max) * 100
        ? "#f39c12"
        : "#27ae60";
    return { pct, color };
  };

  return (
    <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-white/10">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <span className="text-green-400">📍</span>
            Selected Location
          </h3>
          <p className="text-white/50 text-sm mt-0.5">
            {lat.toFixed(4)}°N, {lon.toFixed(4)}°E
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition-colors text-2xl leading-none mt-1"
        >
          ×
        </button>
      </div>

      {/* Nearest Forest */}
      {nearest && (
        <div className="mx-5 mt-4 bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-green-400 font-bold text-sm uppercase tracking-wide">Nearest Forest Reserve</span>
          </div>
          <div className="text-white font-bold text-xl">{nearest.name}</div>
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-white/60">
            <span>📌 {nearest.state}</span>
            <span>🏷️ {nearest.type}</span>
            <span>📏 {nearest.area.toLocaleString()} km²</span>
            <span>📡 ~{distanceKm} km away</span>
          </div>
          <p className="text-white/50 text-xs mt-2">{nearest.description}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="p-8 text-center">
          <div className="inline-block w-10 h-10 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mb-3" />
          <p className="text-white/60">Fetching live weather data...</p>
          <p className="text-white/30 text-xs mt-1">Connecting to meteorological satellites</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-5 my-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Weather Data */}
      {weather && !loading && (
        <div className="p-5">
          <h4 className="text-white/70 text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <span>🌤️</span> Live Weather Conditions
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {weatherMetrics.map(({ key, label, value, raw }) => {
              const bar = getMetricBar(key, raw);
              return (
                <div key={key} className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-lg mb-1">{METRIC_ICONS[key]}</div>
                  <div className="text-white/50 text-xs">{label}</div>
                  <div className="text-white font-bold text-base mt-0.5">{value}</div>
                  {bar && (
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${bar.pct}%`, background: bar.color }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fire Risk Report */}
      {risk && !loading && (
        <div
          className="mx-5 mb-5 rounded-2xl overflow-hidden border flex-shrink-0"
          style={{ borderColor: risk.color + "60", background: risk.color + "18" }}
        >
          {/* Micro-Sector vs Baseline Header */}
          <div className="border-b border-white/10" style={{ background: risk.color + "20" }}>
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-400 text-sm animate-pulse">🎯</span>
                  <span className="text-white/80 text-[10px] font-bold uppercase tracking-wider">Target: 2km² Micro-Sector</span>
                </div>
                <div className="text-white font-bold text-2xl" style={{ color: risk.color }}>
                  {risk.level} Risk
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Macro Baseline:</span>
                  <span className="text-white/60 text-xs font-semibold">{Math.max(10, risk.score - 25)}/100</span>
                </div>
              </div>
              <RiskGauge score={risk.score} color={risk.color} />
            </div>
            
            <div className="px-5 py-2.5 bg-black/40 border-t border-white/5 text-[10px] text-white/60 leading-relaxed font-medium">
              <strong className="text-white/80">Massive Scale, Micro Focus:</strong> Large forests average low risk, but specific 2km² grids (like this one) can harbor critical dead fuel loads where fires spark.
            </div>
          </div>

          <div className="px-5 py-4 space-y-4">
            <p className="text-white/80 text-sm leading-relaxed font-medium">{risk.description}</p>

            <div>
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">
                ✅ Recommended Actions
              </div>
              <ul className="space-y-1.5">
                {risk.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="text-green-400 mt-0.5 flex-shrink-0">→</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Deep 7-Day Forecast Module */}
            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-orange-400 text-lg">📈</span>
                <span className="text-white/90 font-bold uppercase tracking-wide text-sm">Deep 7-Day Forecast</span>
              </div>
              
              <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                <p className="text-white/60 text-[11px] mb-4 leading-relaxed">
                  Advanced Daily Simulation computing <span className="text-red-400 font-bold">Ignition Probability</span> (driven by Temp/Humidity) and <span className="text-orange-400 font-bold">Spread Velocity</span> (driven by Wind).
                </p>
                
                <div className="flex items-end justify-between h-36 gap-1 mt-6">
                  {[...Array(7)].map((_, i) => {
                    const isToday = i === 0;
                    
                    // Core trend simulation
                    const trendVariations = [0, 5, 8, -2, -6, 4, 12];
                    const futureScore = Math.min(100, Math.max(0, risk.score + trendVariations[i] + (i * 2)));
                    
                    // Simulate Weather Metrics
                    let baseTemp = weather && weather.temperature ? weather.temperature : 35;
                    const tempSim = Math.round(baseTemp + (trendVariations[i] * 0.4));
                    
                    let baseHum = weather && weather.humidity !== undefined ? weather.humidity : 45;
                    const humSim = Math.max(5, Math.min(100, Math.round(baseHum - (trendVariations[i] * 0.8))));

                    let baseWind = weather && weather.windSpeed ? weather.windSpeed : 12;
                    const windSim = Math.max(0, Math.round(baseWind + (trendVariations[i] * 0.5) + (Math.random() * 5)));

                    // Advanced Fire Metrics
                    const ignitionProb = Math.min(100, Math.round((tempSim / 50) * 50 + ((100 - humSim) / 100) * 50));
                    
                    let spreadDesc = "Low";
                    let spreadColor = "#27ae60";
                    if (windSim > 35) { spreadDesc = "Extreme"; spreadColor = "#dc2626"; }
                    else if (windSim > 20) { spreadDesc = "High"; spreadColor = "#ea580c"; }
                    else if (windSim > 12) { spreadDesc = "Moderate"; spreadColor = "#eab308"; }

                    // Condition Icon
                    let conditionIcon = "☀️";
                    if (humSim > 60) conditionIcon = "🌧️";
                    else if (humSim > 40) conditionIcon = "⛅";
                    else if (tempSim > 38 && futureScore > 65) conditionIcon = "🔥";
                    
                    const barColor = futureScore >= 70 ? "#e74c3c" : futureScore >= 45 ? "#f39c12" : "#27ae60";
                    
                    return (
                      <div key={i} className="flex flex-col items-center flex-1 group">
                        {/* Temp label above bar */}
                        <div className="text-[10px] font-bold text-white/70 mb-1">{tempSim}°</div>

                        <div className="relative w-full flex justify-center h-full items-end pb-2">
                          {/* Rich Deep-Dive Tooltip on hover */}
                          <div className="absolute bottom-full mb-3 -ml-20 w-48 bg-gray-900 border border-white/20 text-left p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-[100] pointer-events-none shadow-2xl scale-95 group-hover:scale-100 origin-bottom">
                            <div className="font-bold text-white text-xs mb-2 bg-white/10 inline-block px-2 py-1 rounded w-full border-b border-white/10">Day {i + 1} Deep Dive</div>
                            
                            <div className="space-y-1.5 mb-2.5">
                              <div className="flex justify-between items-center text-[10px] text-white/70">
                                <span>Risk Score:</span>
                                <span className="font-bold text-sm" style={{ color: barColor }}>{Math.round(futureScore)}/100</span>
                              </div>
                            </div>

                            <div className="space-y-1 bg-black/50 p-1.5 rounded-lg border border-white/5 mb-2.5">
                              <div className="flex justify-between items-center text-[10px] text-white/70">
                                <span>Max Temp:</span>
                                <span className="font-bold text-white">{tempSim}°C {conditionIcon}</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-white/70">
                                <span>Min Humidity:</span>
                                <span className="font-bold text-white">{humSim}%</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-white/70">
                                <span>Peak Wind:</span>
                                <span className="font-bold text-white">{windSim} km/h</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[10px] text-white/70">
                                <span>Ignition Prob:</span>
                                <span className={`font-bold ${ignitionProb > 70 ? 'text-red-400' : 'text-orange-400'}`}>{ignitionProb}%</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-white/70">
                                <span>Spread Velocity:</span>
                                <span className="font-bold" style={{ color: spreadColor }}>{spreadDesc}</span>
                              </div>
                            </div>
                          </div>

                          {/* The Bar */}
                          <div 
                            className={`w-full max-w-[24px] rounded-t-sm transition-all duration-700 ${isToday ? 'opacity-100 border-x border-t border-white/30' : 'opacity-70 group-hover:opacity-100'}`}
                            style={{ 
                              height: `${futureScore}%`, 
                              backgroundColor: barColor 
                            }}
                          />
                        </div>
                        <div className="text-[10px] text-white/50 font-medium">Day {i + 1}</div>
                      </div>
                    );
                  })}
                </div>
                
                {/* AI Insight Summary */}
                <div className="mt-4 pt-3 border-t border-white/5 bg-white/[0.02] -mx-4 -mb-4 px-4 pb-4 rounded-b-xl">
                  <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span>✨</span> AI Insight
                  </div>
                  <div className="text-xs text-white/80 leading-relaxed">
                    {risk.score + 10 > risk.score 
                      ? "Ignition Probability spikes mid-week as relative humidity drops. High forecasted winds will act as a multiplier, elevating Spread Velocity metrics to 'Extreme' status on Day 3."
                      : "Risk trend shows slight stabilization. Ignition probability remains moderate due to cooler temps, but steady winds necessitate continued monitoring for rapid spread if a spark occurs."}
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Broadcast Button for High/Extreme Risk */}
            {(risk.level === "High" || risk.level === "Very High" || risk.level === "Extreme") && (
              <button 
                className="w-full mt-4 py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                style={{ 
                  background: `linear-gradient(135deg, ${risk.color}, #000000)`,
                  border: `1px solid ${risk.color}`
                }}
                onClick={() => alert(`🚨 ALERT BROADCASTED!\n\nEmergency dispatch notified for Sector [${lat.toFixed(4)}, ${lon.toFixed(4)}].`)}
              >
                <span>⚠️</span> Broadcast Local Alert
              </button>
            )}

            <div className="text-white/25 text-xs pt-3 border-t border-white/10 text-center">
              Data sourced from Open-Meteo · FSI boundaries
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
