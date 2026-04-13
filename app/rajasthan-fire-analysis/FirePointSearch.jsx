'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ──────── Zone styling ────────
const ZONE_INFO = {
  'Very High Fire Zone': { color: '#FF0000', label: 'Very High', emoji: '🔴', bg: 'from-red-900/40 to-red-950/60', border: 'border-red-500/50', text: 'text-red-400', description: 'Extremely high fire probability — recurring, intense thermal anomalies detected historically.' },
  'High Fire Zone':      { color: '#FF8C00', label: 'High',      emoji: '🟠', bg: 'from-orange-900/40 to-orange-950/60', border: 'border-orange-500/50', text: 'text-orange-400', description: 'High fire probability — significant heat signatures observed in this region.' },
  'Moderate Fire Zone':  { color: '#FFD700', label: 'Moderate',   emoji: '🟡', bg: 'from-yellow-900/30 to-yellow-950/50', border: 'border-yellow-500/40', text: 'text-yellow-400', description: 'Moderate fire probability — occasional thermal anomalies in proximity to hotspots.' },
  'Low Fire Zone':       { color: '#228B22', label: 'Low',        emoji: '🟢', bg: 'from-green-900/30 to-green-950/50', border: 'border-green-500/40', text: 'text-green-400', description: 'Low fire probability — minimal or absent historical heat signatures.' },
};

const ZONE_COLORS = {
  'Very High Fire Zone': '#FF0000',
  'High Fire Zone':      '#FF8C00',
  'Moderate Fire Zone':  '#FFD700',
  'Low Fire Zone':       '#228B22',
};

// ──────── Ray-casting point-in-polygon ────────
function pointInPolygon(point, polygon) {
  const [px, py] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function pointInGeometry(lngLat, geometry) {
  if (geometry.type === 'Polygon') return pointInPolygon(lngLat, geometry.coordinates[0]);
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.some(p => pointInPolygon(lngLat, p[0]));
  return false;
}

// ──────── Haversine distance (km) ────────
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ──────── Accuracy estimation ────────
function computeAccuracy(distKm, pointsInZone, totalPoints) {
  let distScore;
  if (distKm < 2) distScore = 97;
  else if (distKm < 5) distScore = 92;
  else if (distKm < 10) distScore = 85;
  else if (distKm < 20) distScore = 72;
  else if (distKm < 35) distScore = 58;
  else distScore = 45;
  const densityRatio = totalPoints > 0 ? pointsInZone / totalPoints : 0;
  const densityScore = Math.min(100, 50 + densityRatio * 200);
  const coverageScore = Math.min(100, 40 + totalPoints * 1.2);
  const accuracy = Math.round(distScore * 0.4 + densityScore * 0.3 + coverageScore * 0.3);
  return Math.min(98, Math.max(35, accuracy));
}

// ──────── Custom pin icon ────────
function createPinIcon() {
  return L.divIcon({
    className: 'search-pin-icon',
    html: `<div style="
      width: 28px; height: 28px;
      background: linear-gradient(135deg, #a855f7, #ec4899);
      border: 3px solid #fff;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 0 12px rgba(168,85,247,0.6), 0 2px 8px rgba(0,0,0,0.4);
      position: relative;
    "><div style="
      width: 10px; height: 10px;
      background: #fff;
      border-radius: 50%;
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
    "></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });
}

/**
 * FirePointSearch — Interactive map with fire zones, boundaries, fire points + click-to-search
 */
export default function FirePointSearch({ mode = 'district', districtSlug, districtName, center, aravaliDistricts }) {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const miniMapRef = useRef(null);
  const miniMapInstance = useRef(null);
  const markerRef = useRef(null);

  // ──── Initialize mini-map with full fire zone data ────
  useEffect(() => {
    if (miniMapInstance.current || !miniMapRef.current) return;

    const mapCenter = center || [26.0, 74.0];
    const mapZoom = mode === 'aravali' ? 7 : 9;

    const rafId = requestAnimationFrame(() => {
      if (!miniMapRef.current || miniMapInstance.current) return;

      const map = L.map(miniMapRef.current, {
        center: mapCenter,
        zoom: mapZoom,
        zoomControl: false,
        attributionControl: false,
      });
      miniMapInstance.current = map;

      // Satellite base
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      ).addTo(map);

      // Dark labels
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
        { maxZoom: 18 }
      ).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      map.getContainer().style.cursor = 'crosshair';

      // Load fire zone data onto the map
      loadFireDataOnMap(map);

      // Click handler
      map.on('click', (e) => {
        const { lat: cLat, lng: cLng } = e.latlng;
        setLat(cLat.toFixed(4));
        setLng(cLng.toFixed(4));

        if (markerRef.current) {
          markerRef.current.setLatLng([cLat, cLng]);
        } else {
          markerRef.current = L.marker([cLat, cLng], {
            icon: createPinIcon(),
            zIndexOffset: 1000,
          }).addTo(map);
        }
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (miniMapInstance.current) {
        miniMapInstance.current.remove();
        miniMapInstance.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // ──── Load fire zones, boundaries, fire points onto mini-map ────
  async function loadFireDataOnMap(map) {
    const slugs = mode === 'aravali' ? (aravaliDistricts || []) : [districtSlug];

    for (const slug of slugs) {
      try {
        // Load fire zones GeoJSON
        const res = await fetch(`/fire_zones/${slug}_fire_zones.geojson`);
        if (!res.ok) continue;
        const data = await res.json();

        // Draw zone polygons
        const zoneFeatures = data.features.filter(f => f.properties?.zone);
        zoneFeatures.forEach(feature => {
          const zoneName = feature.properties.zone;
          const color = ZONE_COLORS[zoneName] || '#888';
          L.geoJSON(feature, {
            style: {
              fillColor: color,
              fillOpacity: 0.4,
              color: color,
              weight: 1.5,
              opacity: 0.7,
            }
          }).addTo(map);
        });

        // Draw boundary
        const boundaryFeature = data.features.find(f => f.properties?.name?.includes('Boundary'));
        if (boundaryFeature) {
          const boundaryLayer = L.geoJSON(boundaryFeature, {
            style: {
              fill: false,
              color: '#FFFFFF',
              weight: 2,
              opacity: 0.8,
              dashArray: '6,4',
            }
          }).addTo(map);

          // Fit to boundary (only for single district)
          if (mode !== 'aravali') {
            const bounds = boundaryLayer.getBounds();
            map.fitBounds(bounds, { padding: [20, 20] });
          }
        }

        // Draw fire points
        const pointFeatures = data.features.filter(f => f.geometry?.type === 'Point');
        pointFeatures.forEach(pt => {
          const [pLng, pLat] = pt.geometry.coordinates;
          L.circleMarker([pLat, pLng], {
            radius: 4,
            fillColor: '#FF4444',
            fillOpacity: 0.9,
            color: '#FFF',
            weight: 1,
          }).bindPopup(`
            <div style="font-family:system-ui;min-width:140px;">
              <strong style="color:#FF4444;">🔥 Fire Point</strong><br/>
              <span style="color:#666;font-size:12px;">Date: ${pt.properties?.date || 'N/A'}</span><br/>
              <span style="color:#666;font-size:12px;">Brightness: ${pt.properties?.brightness || 'N/A'}</span><br/>
              <span style="color:#888;font-size:11px;">${pLat.toFixed(4)}, ${pLng.toFixed(4)}</span>
            </div>
          `).addTo(map);
        });

      } catch (e) {
        // Skip failed loads silently
      }
    }

    // For aravali mode, also load boundaries
    if (mode === 'aravali') {
      for (const slug of slugs) {
        try {
          const bRes = await fetch(`/boundaries/${slug}_boundary.geojson`);
          if (!bRes.ok) continue;
          const bData = await bRes.json();
          L.geoJSON(bData, {
            style: {
              fill: false,
              color: '#FFD700',
              weight: 1.5,
              opacity: 0.6,
              dashArray: '5,3',
            }
          }).addTo(map);
        } catch (e) {}
      }
    }

    setMapReady(true);
  }

  // Update marker when typing coordinates manually
  useEffect(() => {
    const pLat = parseFloat(lat);
    const pLng = parseFloat(lng);
    if (!isNaN(pLat) && !isNaN(pLng) && miniMapInstance.current) {
      if (markerRef.current) {
        markerRef.current.setLatLng([pLat, pLng]);
      } else {
        markerRef.current = L.marker([pLat, pLng], {
          icon: createPinIcon(),
          zIndexOffset: 1000,
        }).addTo(miniMapInstance.current);
      }
    }
  }, [lat, lng]);

  // ──── Analyze point ────
  const analyzePoint = useCallback(async () => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      setError('Please click on the map above to select a point, or enter coordinates manually.');
      return;
    }
    if (parsedLat < 23 || parsedLat > 31 || parsedLng < 69 || parsedLng > 79) {
      setError('Coordinates are outside Rajasthan boundaries (Lat: 23–31, Lng: 69–79).');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const lngLat = [parsedLng, parsedLat];
      let foundZone = null;
      let nearestDistance = Infinity;
      let totalPoints = 0;
      let pointsInFoundZone = 0;
      let foundDistrictName = districtName;
      let nearestBrightness = null;

      const slugsToSearch = mode === 'aravali' ? (aravaliDistricts || []) : [districtSlug];

      for (const slug of slugsToSearch) {
        const res = await fetch(`/fire_zones/${slug}_fire_zones.geojson`);
        if (!res.ok) continue;
        const data = await res.json();
        const zoneFeatures = data.features.filter(f => f.properties?.zone);
        const pointFeatures = data.features.filter(f => f.geometry?.type === 'Point');

        if (!foundZone) {
          for (const feature of zoneFeatures) {
            if (pointInGeometry(lngLat, feature.geometry)) {
              foundZone = feature.properties.zone;
              if (mode === 'aravali') {
                foundDistrictName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
              }
              break;
            }
          }
        }

        pointFeatures.forEach(pt => {
          totalPoints++;
          const [pLng, pLat] = pt.geometry.coordinates;
          const dist = haversineKm(parsedLat, parsedLng, pLat, pLng);
          if (dist < nearestDistance) {
            nearestDistance = dist;
            nearestBrightness = pt.properties?.brightness || null;
          }
        });

        if (foundZone) {
          pointFeatures.forEach(pt => {
            const [pLng, pLat] = pt.geometry.coordinates;
            for (const zf of zoneFeatures) {
              if (zf.properties.zone === foundZone && pointInGeometry([pLng, pLat], zf.geometry)) {
                pointsInFoundZone++;
                break;
              }
            }
          });
        }
      }

      if (!foundZone) {
        setError(
          mode === 'aravali'
            ? 'This point does not fall within any Aravali Range fire zone. Click inside a colored zone on the map.'
            : `This point is outside ${districtName || 'this district'}'s fire zones. Click inside a colored zone on the map.`
        );
        setLoading(false);
        return;
      }

      const zoneInfo = ZONE_INFO[foundZone] || ZONE_INFO['Low Fire Zone'];
      const accuracy = computeAccuracy(nearestDistance, pointsInFoundZone, totalPoints);

      setResult({
        zone: foundZone, zoneInfo, brightness: nearestBrightness,
        distance: nearestDistance, accuracy, totalPoints,
        pointsInZone: pointsInFoundZone, lat: parsedLat, lng: parsedLng,
        foundDistrict: mode === 'aravali' ? foundDistrictName : null,
      });
    } catch (err) {
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [lat, lng, mode, districtSlug, districtName, aravaliDistricts]);

  function handleKeyDown(e) { if (e.key === 'Enter') analyzePoint(); }

  const placeholderLat = center ? center[0]?.toFixed(2) : '25.00';
  const placeholderLng = center ? center[1]?.toFixed(2) : '74.00';

  return (
    <section className="bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-950 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-purple-500/30 transition-colors" id="point-search">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Fire Zone Point Search
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Click on the map to select a point and check its fire risk group</p>
        </div>
      </div>

      {/* ===== Interactive Map with fire zones, points & boundary ===== */}
      <div className="mb-4 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg relative">
        <div ref={miniMapRef} style={{ height: '400px', width: '100%' }} className="z-0" />

        {/* Map hint overlay */}
        <div className="absolute top-3 left-3 z-[1000] bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-purple-500/30 pointer-events-none">
          <p className="text-xs text-purple-300 font-medium flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Click anywhere on the map to select a point
          </p>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-lg px-3 py-2 shadow-xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fire Risk Zones</div>
          {Object.entries(ZONE_COLORS).map(([name, color]) => (
            <div key={name} className="flex items-center gap-1.5 py-0.5">
              <span className="w-3 h-2.5 rounded-sm inline-block" style={{ backgroundColor: color, opacity: 0.8 }}></span>
              <span className="text-[10px] text-slate-400">{name.replace(' Fire Zone', '')}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 py-0.5 mt-0.5 border-t border-slate-700/50 pt-1">
            <span className="w-2.5 h-2.5 rounded-full inline-block bg-red-500 border border-white"></span>
            <span className="text-[10px] text-slate-400">Fire Point</span>
          </div>
        </div>

        {/* Selected point display */}
        {lat && lng && (
          <div className="absolute top-3 right-3 z-[1000] bg-purple-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-purple-500/40">
            <p className="text-xs text-purple-200 font-mono">{parseFloat(lat).toFixed(4)}°N, {parseFloat(lng).toFixed(4)}°E</p>
          </div>
        )}
      </div>

      {/* Input Area with coords */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/40 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Latitude</label>
            <div className="relative">
              <input type="number" step="any" placeholder={`e.g. ${placeholderLat}`} value={lat}
                onChange={e => setLat(e.target.value)} onKeyDown={handleKeyDown}
                className="w-full bg-slate-900/80 border border-slate-600/50 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition-all text-sm font-mono"
                id="search-lat-input" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600">°N</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Longitude</label>
            <div className="relative">
              <input type="number" step="any" placeholder={`e.g. ${placeholderLng}`} value={lng}
                onChange={e => setLng(e.target.value)} onKeyDown={handleKeyDown}
                className="w-full bg-slate-900/80 border border-slate-600/50 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition-all text-sm font-mono"
                id="search-lng-input" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600">°E</span>
            </div>
          </div>
        </div>

        <button onClick={analyzePoint} disabled={loading}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          id="analyze-point-btn">
          {loading ? (
            <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>Analyzing...</>
          ) : (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>Analyze Point</>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* ===== Result Card ===== */}
      {result && (
        <div className={`bg-gradient-to-br ${result.zoneInfo.bg} border ${result.zoneInfo.border} rounded-xl p-5 shadow-lg`} id="search-result">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{result.zoneInfo.emoji}</span>
              <div>
                <div className={`text-2xl font-black ${result.zoneInfo.text}`}>{result.zoneInfo.label} Fire Zone</div>
                {result.foundDistrict && (
                  <div className="text-xs text-slate-400 mt-0.5">District: <span className="text-yellow-400 font-semibold">{result.foundDistrict}</span></div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-white">{result.accuracy}%</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Accuracy</div>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-4 leading-relaxed">{result.zoneInfo.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="bg-black/20 rounded-lg p-3 text-center border border-white/5">
              <div className="text-2xl mb-1">🌡️</div>
              <div className="text-lg font-bold text-white">{result.brightness ? result.brightness.toFixed(1) : 'N/A'}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Brightness (K)</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 text-center border border-white/5">
              <div className="text-2xl mb-1">📍</div>
              <div className="text-lg font-bold text-white">{result.distance.toFixed(1)} km</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Nearest Fire</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 text-center border border-white/5">
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-lg font-bold text-white">{result.totalPoints}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Total Points</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 text-center border border-white/5">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-lg font-bold text-white">{result.pointsInZone}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">in This Zone</div>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-3 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-mono text-xs">{result.lat.toFixed(4)}°N, {result.lng.toFixed(4)}°E</span>
            </div>
            <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${result.zoneInfo.text} bg-black/30 border ${result.zoneInfo.border}`}>
              {result.zoneInfo.label} Risk
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <strong className="text-slate-400">How accuracy is calculated:</strong> Based on proximity to the nearest historical fire point ({result.distance.toFixed(1)} km),
              density of {result.totalPoints} satellite detections in the dataset, and the point&#39;s position within the {result.zoneInfo.label.toLowerCase()} risk polygon.
              Data source: NASA FIRMS (MODIS/VIIRS).
            </p>
          </div>
        </div>
      )}

      {/* Instruction */}
      {!result && !error && (
        <div className="flex items-start gap-3 text-slate-500 text-xs mt-2">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>
            <strong className="text-slate-400">Click on the map</strong> to select a point — you can see fire zones (colored regions), fire points (red dots), and the district boundary.
            Then click <strong className="text-purple-400">Analyze Point</strong> to find which risk group it belongs to.
          </p>
        </div>
      )}
    </section>
  );
}
