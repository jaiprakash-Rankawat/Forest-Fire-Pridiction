'use client';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ZONE_COLORS = {
  'Very High Fire Zone': { color: '#FF0000', label: 'Very High', emoji: '🔴' },
  'High Fire Zone':      { color: '#FF8C00', label: 'High',      emoji: '🟠' },
  'Moderate Fire Zone':  { color: '#FFD700', label: 'Moderate',   emoji: '🟡' },
  'Low Fire Zone':       { color: '#228B22', label: 'Low',        emoji: '🟢' },
};

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function DistrictMapClient({ districtSlug, districtName, center, zoom }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;
    if (!mapRef.current) return;

    // Use rAF to ensure the DOM container is fully painted before Leaflet init
    const rafId = requestAnimationFrame(() => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false,
        attributionControl: false
      });
      mapInstanceRef.current = map;

      const satellite = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18, attribution: 'ESRI Satellite' }
      );

      const dark = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { maxZoom: 18, attribution: 'CartoDB Dark' }
      );

      const topo = L.tileLayer(
        'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        { maxZoom: 17, attribution: 'OpenTopoMap' }
      );

      satellite.addTo(map);

      L.control.layers(
        { 'Satellite': satellite, 'Dark': dark, 'Topographic': topo },
        {},
        { position: 'topright' }
      ).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.control.attribution({ position: 'bottomleft' }).addTo(map);

      loadFireZones(map);
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [districtSlug]);

  async function loadFireZones(map) {
    try {
      const res = await fetch(`/fire_zones/${districtSlug}_fire_zones.geojson`);
      if (!res.ok) {
        setError(`Fire zone data not yet generated for ${districtName}. Run the analysis script first.`);
        setLoading(false);
        return;
      }
      const data = await res.json();

      const zoneStats = {};
      const zoneFeatures = data.features.filter(f => f.properties?.zone);
      const boundaryFeature = data.features.find(f => f.properties?.name?.includes('Boundary'));
      const pointFeatures = data.features.filter(f => f.geometry?.type === 'Point');

      // Zone polygons
      zoneFeatures.forEach(feature => {
        const zoneName = feature.properties.zone;
        const zoneInfo = ZONE_COLORS[zoneName] || { color: '#888', label: zoneName };

        const layer = L.geoJSON(feature, {
          style: {
            fillColor: zoneInfo.color,
            fillOpacity: 0.45,
            color: zoneInfo.color,
            weight: 1.5,
            opacity: 0.7
          }
        });

        layer.bindPopup(`
          <div style="font-family: system-ui; min-width: 180px;">
            <h3 style="margin:0 0 6px; font-size:15px; color:${zoneInfo.color}">${zoneInfo.emoji} ${zoneName}</h3>
            <p style="margin:0; color:#666; font-size:12px;">Based on KDE of NASA FIRMS data (2018-2025)</p>
            <p style="margin:4px 0 0; color:#888; font-size:11px;">District: ${districtName}</p>
          </div>
        `);

        layer.addTo(map);

        try {
          const area = computeArea(feature);
          zoneStats[zoneName] = { area: area.toFixed(1), color: zoneInfo.color, label: zoneInfo.label, emoji: zoneInfo.emoji };
        } catch(e) {
          zoneStats[zoneName] = { area: '?', color: zoneInfo.color, label: zoneInfo.label, emoji: zoneInfo.emoji };
        }
      });

      // Boundary
      if (boundaryFeature) {
        L.geoJSON(boundaryFeature, {
          style: {
            fill: false,
            color: '#FFFFFF',
            weight: 2.5,
            opacity: 0.85,
            dashArray: '8,4'
          }
        }).addTo(map);

        const bounds = L.geoJSON(boundaryFeature).getBounds();
        map.fitBounds(bounds, { padding: [30, 30] });
      }

      // Fire points
      if (pointFeatures.length > 0) {
        const fireGroup = L.layerGroup();
        pointFeatures.forEach(pt => {
          const [lng, lat] = pt.geometry.coordinates;
          const marker = L.circleMarker([lat, lng], {
            radius: 5,
            fillColor: '#FF4444',
            fillOpacity: 0.9,
            color: '#FFF',
            weight: 1.5
          });
          marker.bindPopup(`
            <div style="font-family: system-ui;">
              <strong style="color:#FF4444;">🔥 Fire Incident</strong><br/>
              <span style="color:#666;">Date: ${pt.properties.date || 'Unknown'}</span><br/>
              <span style="color:#666;">Brightness: ${pt.properties.brightness || 'N/A'}</span><br/>
              <span style="color:#888; font-size:11px;">Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}</span>
            </div>
          `);
          marker.addTo(fireGroup);
        });
        fireGroup.addTo(map);
      }

      // ---- Compute Monthly Distribution ----
      const monthlyData = new Array(12).fill(0);
      pointFeatures.forEach(pt => {
        const dateStr = pt.properties?.date;
        if (dateStr) {
          const month = parseInt(dateStr.substring(5, 7), 10);
          if (month >= 1 && month <= 12) {
            monthlyData[month - 1]++;
          }
        }
      });

      // ---- Compute Yearly Trend ----
      const yearlyMap = {};
      pointFeatures.forEach(pt => {
        const dateStr = pt.properties?.date;
        if (dateStr) {
          const year = parseInt(dateStr.substring(0, 4), 10);
          if (year > 2000) {
            yearlyMap[year] = (yearlyMap[year] || 0) + 1;
          }
        }
      });
      const years = Object.keys(yearlyMap).map(Number).sort();
      const yearlyTrend = years.map(y => ({ year: y, count: yearlyMap[y] }));

      // Compute trend percentage
      let trendPercent = 0;
      let trendDirection = 'stable';
      if (yearlyTrend.length >= 2) {
        const firstHalf = yearlyTrend.slice(0, Math.ceil(yearlyTrend.length / 2));
        const secondHalf = yearlyTrend.slice(Math.ceil(yearlyTrend.length / 2));
        const firstAvg = firstHalf.reduce((s, v) => s + v.count, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((s, v) => s + v.count, 0) / secondHalf.length;
        if (firstAvg > 0) {
          trendPercent = Math.round(((secondAvg - firstAvg) / firstAvg) * 100);
          trendDirection = trendPercent > 10 ? 'increasing' : trendPercent < -10 ? 'decreasing' : 'stable';
        }
      }

      // Peak fire month
      const peakMonthIdx = monthlyData.indexOf(Math.max(...monthlyData));

      setStats({
        zones: zoneStats,
        totalPoints: pointFeatures.length,
        years: getYearRange(pointFeatures),
        monthlyData,
        yearlyTrend,
        trendPercent,
        trendDirection,
        peakMonth: MONTH_NAMES[peakMonthIdx],
        peakMonthCount: monthlyData[peakMonthIdx],
      });
      setLoading(false);

    } catch(err) {
      console.error('Error loading fire zones:', err);
      setError(`Failed to load data: ${err.message}`);
      setLoading(false);
    }
  }

  function computeArea(feature) {
    const coords = feature.geometry.type === 'Polygon' 
      ? [feature.geometry.coordinates] 
      : feature.geometry.coordinates;
    
    let totalArea = 0;
    coords.forEach(polygon => {
      const outerRing = polygon[0];
      totalArea += Math.abs(ringArea(outerRing)) * 111.32 * 111.32;
    });
    return totalArea;
  }

  function ringArea(ring) {
    let area = 0;
    for (let i = 0; i < ring.length - 1; i++) {
      area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
    }
    return area / 2;
  }

  function getYearRange(points) {
    const years = points
      .map(p => p.properties?.date?.substring(0, 4))
      .filter(Boolean).map(Number).filter(y => y > 2000);
    if (years.length === 0) return 'N/A';
    return `${Math.min(...years)} – ${Math.max(...years)}`;
  }

  return (
    <div className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 text-red-300">
          <p className="font-semibold">⚠ {error}</p>
          <p className="text-sm text-red-400 mt-1">
            Run: <code className="bg-slate-800 px-2 py-0.5 rounded">node scripts/analyze_all_districts.js {districtSlug}</code>
          </p>
        </div>
      )}

      {/* Stats bar */}
      {stats && Object.keys(stats.zones).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(stats.zones).map(([name, z]) => (
            <div key={name} className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{z.emoji}</span>
                <span className="text-sm font-semibold text-slate-300">{z.label}</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: z.color }}>{z.area} <span className="text-xs text-slate-500">km²</span></div>
            </div>
          ))}
        </div>
      )}

      {/* Info bar */}
      {stats && (
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <span>🔥 <strong className="text-slate-200">{stats.totalPoints}</strong> fire incidents detected</span>
          <span>📅 Data range: <strong className="text-slate-200">{stats.years}</strong></span>
          <span>📊 Method: <strong className="text-slate-200">Kernel Density Estimation (KDE)</strong></span>
        </div>
      )}

      {/* ===== NEW: Monthly Fire Heatmap ===== */}
      {stats && stats.monthlyData && (
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-red-500 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Monthly Fire Distribution
            </h3>
            <div className="text-sm text-slate-400">
              Peak: <strong className="text-red-400">{stats.peakMonth}</strong> ({stats.peakMonthCount} fires)
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-28">
            {stats.monthlyData.map((count, i) => {
              const max = Math.max(...stats.monthlyData, 1);
              const heightPct = (count / max) * 100;
              const intensity = count / max;
              const bg = intensity > 0.75 ? '#EF4444' : intensity > 0.5 ? '#F97316' : intensity > 0.25 ? '#EAB308' : intensity > 0 ? '#22C55E' : '#334155';
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-500 font-medium">{count > 0 ? count : ''}</span>
                  <div
                    className="w-full rounded-t-md transition-all duration-500"
                    style={{ height: `${Math.max(heightPct, 3)}%`, backgroundColor: bg, opacity: count > 0 ? 1 : 0.3 }}
                    title={`${MONTH_NAMES[i]}: ${count} fires`}
                  />
                  <span className="text-[10px] text-slate-500 font-medium">{MONTH_NAMES[i]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== NEW: Yearly Trend ===== */}
      {stats && stats.yearlyTrend && stats.yearlyTrend.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Year-over-Year Fire Trend
            </h3>
            <div className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${
              stats.trendDirection === 'increasing' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
              stats.trendDirection === 'decreasing' ? 'bg-green-500/15 text-green-400 border border-green-500/30' :
              'bg-slate-700/50 text-slate-400 border border-slate-600'
            }`}>
              {stats.trendDirection === 'increasing' ? '↑' : stats.trendDirection === 'decreasing' ? '↓' : '→'}
              {Math.abs(stats.trendPercent)}%
              <span className="text-xs font-normal opacity-75">
                {stats.trendDirection === 'increasing' ? 'increase' : stats.trendDirection === 'decreasing' ? 'decrease' : 'stable'}
              </span>
            </div>
          </div>
          <div className="flex items-end gap-2 h-24">
            {stats.yearlyTrend.map((item, i) => {
              const max = Math.max(...stats.yearlyTrend.map(t => t.count), 1);
              const heightPct = (item.count / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-400 font-medium">{item.count}</span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-purple-500 transition-all duration-500"
                    style={{ height: `${Math.max(heightPct, 5)}%` }}
                    title={`${item.year}: ${item.count} fires`}
                  />
                  <span className="text-[10px] text-slate-500 font-medium">{item.year}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="relative rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-black/50">
        <div 
          ref={mapRef} 
          id={`${districtSlug}-fire-map`}
          className="w-full"
          style={{ height: 'calc(100vh - 300px)', minHeight: '500px' }}
        />

        {/* Legend */}
        <div className="absolute bottom-5 left-5 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl px-4 py-3 z-[1000] shadow-xl">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Fire Risk Zones</h4>
          {Object.entries(ZONE_COLORS).map(([name, z]) => (
            <div key={name} className="flex items-center gap-2 py-0.5">
              <span className="w-4 h-3 rounded-sm inline-block" style={{ backgroundColor: z.color, opacity: 0.8 }}></span>
              <span className="text-xs text-slate-400">{z.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 py-0.5 mt-1 border-t border-slate-700/50 pt-1">
            <span className="w-3 h-3 rounded-full inline-block bg-red-500 border border-white"></span>
            <span className="text-xs text-slate-400">Fire Point</span>
          </div>
        </div>

        {loading && !error && (
          <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-[1000]">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-red-500 animate-spin mx-auto mb-3"></div>
              <p className="text-slate-400 text-sm">Rendering fire zones for {districtName}...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
