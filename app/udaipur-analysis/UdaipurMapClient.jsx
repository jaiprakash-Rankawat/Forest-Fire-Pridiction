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

export default function UdaipurMapClient() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    // Initialize map centered on Udaipur district
    const map = L.map(mapRef.current, {
      center: [24.58, 73.68],
      zoom: 9,
      zoomControl: false,
      attributionControl: false
    });
    mapInstanceRef.current = map;

    // Satellite tile layer (ESRI World Imagery)
    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 18, attribution: 'ESRI Satellite' }
    );

    // Dark base layer
    const dark = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      { maxZoom: 18, attribution: 'CartoDB Dark' }
    );

    // Topo layer
    const topo = L.tileLayer(
      'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      { maxZoom: 17, attribution: 'OpenTopoMap' }
    );

    satellite.addTo(map);

    // Layer control
    L.control.layers(
      { 'Satellite': satellite, 'Dark': dark, 'Topographic': topo },
      {},
      { position: 'topright' }
    ).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Attribution
    L.control.attribution({ position: 'bottomleft' }).addTo(map);

    // Load fire zones GeoJSON
    loadFireZones(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  async function loadFireZones(map) {
    try {
      const res = await fetch('/fire_zones_udaipur.geojson');
      const data = await res.json();

      const zoneStats = {};
      const zoneLayers = {};

      // Separate features by type
      const zoneFeatures = data.features.filter(f => f.properties?.zone);
      const boundaryFeature = data.features.find(f => f.properties?.name === 'Udaipur District Boundary');
      const pointFeatures = data.features.filter(f => f.geometry?.type === 'Point');

      // Add zone polygons
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
            <p style="margin:0; color:#666; font-size:12px;">Based on Kernel Density Estimation of NASA FIRMS fire data (2018-2025)</p>
          </div>
        `);

        layer.addTo(map);
        zoneLayers[zoneName] = layer;

        // Compute area
        try {
          const area = computeArea(feature);
          zoneStats[zoneName] = { area: area.toFixed(1), color: zoneInfo.color, label: zoneInfo.label, emoji: zoneInfo.emoji };
        } catch(e) {
          zoneStats[zoneName] = { area: '?', color: zoneInfo.color, label: zoneInfo.label, emoji: zoneInfo.emoji };
        }
      });

      // Add boundary outline
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

        // Fit map to boundary
        const bounds = L.geoJSON(boundaryFeature).getBounds();
        map.fitBounds(bounds, { padding: [30, 30] });
      }

      // Add fire point markers
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

      setStats({
        zones: zoneStats,
        totalPoints: pointFeatures.length,
        years: getYearRange(pointFeatures)
      });
      setLoading(false);

    } catch(err) {
      console.error('Error loading fire zones:', err);
      setLoading(false);
    }
  }

  function computeArea(feature) {
    // Approximate area in km²
    const coords = feature.geometry.type === 'Polygon' 
      ? [feature.geometry.coordinates] 
      : feature.geometry.coordinates;
    
    let totalArea = 0;
    coords.forEach(polygon => {
      const outerRing = polygon[0];
      totalArea += Math.abs(ringArea(outerRing)) * 111.32 * 111.32; // rough deg² to km²
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
      .filter(Boolean)
      .map(Number)
      .filter(y => y > 2000);
    if (years.length === 0) return 'N/A';
    return `${Math.min(...years)} – ${Math.max(...years)}`;
  }

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      {stats && (
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

      {/* Map container */}
      <div className="relative rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-black/50">
        <div 
          ref={mapRef} 
          id="udaipur-fire-map"
          className="w-full"
          style={{ height: 'calc(100vh - 300px)', minHeight: '500px' }}
        />

        {/* Legend overlay */}
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

        {loading && (
          <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-[1000]">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-red-500 animate-spin mx-auto mb-3"></div>
              <p className="text-slate-400 text-sm">Rendering fire zones...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
