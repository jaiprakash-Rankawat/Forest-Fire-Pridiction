'use client';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

const DISTRICTS = [
  { slug: 'ajmer', name: 'Ajmer', center: [26.45, 74.64], zoom: 10, forestCover: 'medium' },
  { slug: 'alwar', name: 'Alwar', center: [27.55, 76.61], zoom: 10, forestCover: 'high' },
  { slug: 'banswara', name: 'Banswara', center: [23.55, 74.44], zoom: 10, forestCover: 'high' },
  { slug: 'baran', name: 'Baran', center: [25.10, 76.51], zoom: 10, forestCover: 'high' },
  { slug: 'barmer', name: 'Barmer', center: [25.75, 71.39], zoom: 9, forestCover: 'low' },
  { slug: 'bharatpur', name: 'Bharatpur', center: [27.22, 77.49], zoom: 10, forestCover: 'medium' },
  { slug: 'bhilwara', name: 'Bhilwara', center: [25.35, 74.64], zoom: 10, forestCover: 'medium' },
  { slug: 'bikaner', name: 'Bikaner', center: [28.02, 73.31], zoom: 9, forestCover: 'low' },
  { slug: 'bundi', name: 'Bundi', center: [25.44, 75.64], zoom: 10, forestCover: 'medium' },
  { slug: 'chittorgarh', name: 'Chittorgarh', center: [24.88, 74.63], zoom: 10, forestCover: 'medium' },
  { slug: 'churu', name: 'Churu', center: [28.30, 74.97], zoom: 10, forestCover: 'low' },
  { slug: 'dausa', name: 'Dausa', center: [26.88, 76.34], zoom: 10, forestCover: 'low' },
  { slug: 'dholpur', name: 'Dholpur', center: [26.70, 77.89], zoom: 10, forestCover: 'medium' },
  { slug: 'dungarpur', name: 'Dungarpur', center: [23.84, 73.71], zoom: 10, forestCover: 'high' },
  { slug: 'hanumangarh', name: 'Hanumangarh', center: [29.58, 74.33], zoom: 10, forestCover: 'low' },
  { slug: 'jaipur', name: 'Jaipur', center: [26.92, 75.79], zoom: 10, forestCover: 'medium' },
  { slug: 'jaisalmer', name: 'Jaisalmer', center: [26.92, 70.91], zoom: 8, forestCover: 'low' },
  { slug: 'jalore', name: 'Jalore', center: [25.35, 72.62], zoom: 10, forestCover: 'low' },
  { slug: 'jhalawar', name: 'Jhalawar', center: [24.60, 76.16], zoom: 10, forestCover: 'high' },
  { slug: 'jhunjhunu', name: 'Jhunjhunu', center: [28.13, 75.40], zoom: 10, forestCover: 'low' },
  { slug: 'jodhpur', name: 'Jodhpur', center: [26.29, 73.02], zoom: 9, forestCover: 'low' },
  { slug: 'karauli', name: 'Karauli', center: [26.49, 77.02], zoom: 10, forestCover: 'high' },
  { slug: 'kota', name: 'Kota', center: [25.18, 75.83], zoom: 10, forestCover: 'medium' },
  { slug: 'nagaur', name: 'Nagaur', center: [27.20, 73.74], zoom: 9, forestCover: 'low' },
  { slug: 'pali', name: 'Pali', center: [25.77, 73.33], zoom: 10, forestCover: 'medium' },
  { slug: 'pratapgarh', name: 'Pratapgarh', center: [24.03, 74.78], zoom: 10, forestCover: 'high' },
  { slug: 'rajsamand', name: 'Rajsamand', center: [25.07, 73.88], zoom: 10, forestCover: 'high' },
  { slug: 'sawai-madhopur', name: 'Sawai Madhopur', center: [26.02, 76.35], zoom: 10, forestCover: 'high' },
  { slug: 'sikar', name: 'Sikar', center: [27.61, 75.14], zoom: 10, forestCover: 'low' },
  { slug: 'sirohi', name: 'Sirohi', center: [24.88, 72.86], zoom: 10, forestCover: 'high' },
  { slug: 'sri-ganganagar', name: 'Sri Ganganagar', center: [29.91, 73.88], zoom: 9, forestCover: 'low' },
  { slug: 'tonk', name: 'Tonk', center: [26.17, 75.79], zoom: 10, forestCover: 'low' },
  { slug: 'udaipur', name: 'Udaipur', center: [24.58, 73.68], zoom: 9, forestCover: 'high' },
];

const RISK_COLORS = {
  'Very High': '#FF0000',
  'High': '#FF8C00',
  'Moderate': '#FFD700',
  'Low': '#228B22',
  'Minimal': '#4A90D9',
  'Unknown': '#666666'
};

const RISK_BG = {
  'Very High': 'bg-red-500/20 border-red-500/40 text-red-400',
  'High': 'bg-orange-500/20 border-orange-500/40 text-orange-400',
  'Moderate': 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
  'Low': 'bg-green-500/20 border-green-500/40 text-green-400',
  'Minimal': 'bg-blue-500/20 border-blue-500/40 text-blue-400',
  'Unknown': 'bg-slate-500/20 border-slate-500/40 text-slate-400'
};

export default function RajasthanDashboard() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('risk');
  const [view, setView] = useState('map'); // 'map' or 'grid'

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [26.5, 73.8],
      zoom: 6,
      zoomControl: false,
      attributionControl: false
    });
    mapInstanceRef.current = map;

    // Dark satellite hybrid
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 18 }
    ).addTo(map);

    // Labels overlay
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
      { maxZoom: 18 }
    ).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Load summary and boundaries
    loadDashboardData(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  async function loadDashboardData(map) {
    try {
      // Load district summary
      const summaryRes = await fetch('/fire_zones/district_summary.json');
      const summaryData = await summaryRes.json();
      setSummary(summaryData);

      // Load each district boundary and color-code it
      for (const district of DISTRICTS) {
        try {
          const res = await fetch(`/boundaries/${district.slug}_boundary.geojson`);
          if (!res.ok) continue;
          const boundary = await res.json();
          
          const districtSummary = summaryData[district.slug];
          const riskLevel = districtSummary?.riskLevel || 'Unknown';
          const riskColor = RISK_COLORS[riskLevel] || '#666';
          const firePoints = districtSummary?.firePoints || 0;

          L.geoJSON(boundary, {
            style: {
              fillColor: riskColor,
              fillOpacity: 0.35,
              color: riskColor,
              weight: 2,
              opacity: 0.7
            },
            onEachFeature: (feature, layer) => {
              layer.bindPopup(`
                <div style="font-family: system-ui; min-width: 200px;">
                  <h3 style="margin:0 0 8px; font-size:16px; font-weight:700; color:${riskColor}">${district.name} District</h3>
                  <div style="display:flex; gap:8px; margin-bottom:8px;">
                    <span style="background:${riskColor}22; color:${riskColor}; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:600; border:1px solid ${riskColor}44;">
                      ${riskLevel} Risk
                    </span>
                  </div>
                  <p style="margin:0 0 4px; color:#888; font-size:12px;">🔥 ${firePoints} fire incidents detected</p>
                  <p style="margin:0 0 4px; color:#888; font-size:12px;">📅 Data: ${districtSummary?.yearRange || 'N/A'}</p>
                  <a href="/rajasthan-fire-analysis/${district.slug}" 
                     style="display:inline-block; margin-top:8px; padding:4px 12px; background:${riskColor}; color:white; border-radius:6px; font-size:12px; font-weight:600; text-decoration:none;">
                    View Detailed Analysis →
                  </a>
                </div>
              `);

              layer.on('mouseover', function() {
                this.setStyle({ fillOpacity: 0.55, weight: 3 });
              });
              layer.on('mouseout', function() {
                this.setStyle({ fillOpacity: 0.35, weight: 2 });
              });
            }
          }).addTo(map);
        } catch(e) {
          // Skip districts without boundary data
        }
      }

      setLoading(false);
    } catch(err) {
      console.error('Error loading dashboard:', err);
      setLoading(false);
    }
  }

  // Filter and sort districts
  const filteredDistricts = DISTRICTS
    .map(d => ({
      ...d,
      ...(summary?.[d.slug] || {}),
      riskLevel: summary?.[d.slug]?.riskLevel || 'Unknown'
    }))
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'risk') {
        const order = { 'Very High': 0, 'High': 1, 'Moderate': 2, 'Low': 3, 'Minimal': 4, 'Unknown': 5 };
        return (order[a.riskLevel] ?? 5) - (order[b.riskLevel] ?? 5);
      }
      if (sortBy === 'fires') return (b.firePoints || 0) - (a.firePoints || 0);
      return a.name.localeCompare(b.name);
    });

  const riskCounts = {};
  if (summary) {
    Object.values(summary).forEach(d => {
      const r = d.riskLevel || 'Unknown';
      riskCounts[r] = (riskCounts[r] || 0) + 1;
    });
  }

  const totalFires = summary ? Object.values(summary).reduce((s, d) => s + (d.firePoints || 0), 0) : 0;

  return (
    <div className="space-y-6 mt-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/70 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
          <div className="text-sm text-slate-500 mb-1">Total Fire Incidents</div>
          <div className="text-2xl font-bold text-orange-400">{totalFires.toLocaleString()}</div>
        </div>
        {['Very High', 'High', 'Moderate', 'Low', 'Minimal'].map(level => (
          <div key={level} className="bg-slate-900/70 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-sm text-slate-500 mb-1">{level} Risk</div>
            <div className="text-2xl font-bold" style={{ color: RISK_COLORS[level] }}>
              {riskCounts[level] || 0}
              <span className="text-xs text-slate-500 ml-1">districts</span>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search districts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 pl-10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all"
          />
          <svg className="absolute left-3 top-3 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex gap-2">
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-orange-500/50"
          >
            <option value="risk">Sort by Risk Level</option>
            <option value="fires">Sort by Fire Count</option>
            <option value="name">Sort by Name</option>
          </select>
          <div className="flex bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
            <button 
              onClick={() => setView('map')}
              className={`px-3 py-2 text-sm transition-all ${view === 'map' ? 'bg-orange-500/20 text-orange-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
              🗺 Map
            </button>
            <button 
              onClick={() => setView('grid')}
              className={`px-3 py-2 text-sm transition-all ${view === 'grid' ? 'bg-orange-500/20 text-orange-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
              📊 Grid
            </button>
          </div>
        </div>
      </div>

      {/* Map View */}
      {view === 'map' && (
        <div className="relative rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-black/50">
          <div 
            ref={mapRef} 
            id="rajasthan-map"
            className="w-full"
            style={{ height: '600px' }}
          />
          
          {/* Legend */}
          <div className="absolute bottom-5 left-5 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl px-4 py-3 z-[1000] shadow-xl">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Fire Risk Level</h4>
            {Object.entries(RISK_COLORS).filter(([k]) => k !== 'Unknown').map(([name, color]) => (
              <div key={name} className="flex items-center gap-2 py-0.5">
                <span className="w-4 h-3 rounded-sm inline-block" style={{ backgroundColor: color, opacity: 0.7 }}></span>
                <span className="text-xs text-slate-400">{name}</span>
              </div>
            ))}
          </div>

          {loading && (
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-[1000]">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-red-500 animate-spin mx-auto mb-3"></div>
                <p className="text-slate-400 text-sm">Loading district data...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid View - District Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${view === 'map' ? 'mt-6' : ''}`}>
        {filteredDistricts.map(district => (
          <Link
            key={district.slug}
            href={`/rajasthan-fire-analysis/${district.slug}`}
            className="group bg-slate-900/70 border border-slate-700/50 rounded-xl p-5 hover:border-orange-500/40 hover:bg-slate-800/50 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-slate-200 group-hover:text-orange-400 transition-colors">
                {district.name}
              </h3>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${RISK_BG[district.riskLevel] || RISK_BG['Unknown']}`}>
                {district.riskLevel}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>🔥 Fire Incidents</span>
                <span className="font-semibold text-slate-300">{district.firePoints || 0}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>🌳 Forest Cover</span>
                <span className="font-semibold text-slate-300 capitalize">{district.forestCover}</span>
              </div>
              {district.yearRange && (
                <div className="flex justify-between text-slate-400">
                  <span>📅 Data Range</span>
                  <span className="font-semibold text-slate-300">{district.yearRange}</span>
                </div>
              )}
            </div>

            {/* Zone summary mini bars */}
            {district.zones && Object.keys(district.zones).length > 0 && (
              <div className="mt-3 flex gap-1 h-2 rounded-full overflow-hidden bg-slate-800">
                {Object.entries(district.zones).map(([zoneName, info]) => (
                  <div 
                    key={zoneName}
                    style={{ 
                      backgroundColor: info.color, 
                      flex: info.area || 1,
                      opacity: 0.7
                    }}
                    title={`${zoneName}: ${info.area} km²`}
                  ></div>
                ))}
              </div>
            )}

            <div className="mt-3 text-xs text-slate-500 group-hover:text-orange-400/70 transition-colors flex items-center gap-1">
              View Detailed Analysis 
              <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {filteredDistricts.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p className="text-lg">No districts found matching &quot;{search}&quot;</p>
        </div>
      )}
    </div>
  );
}
