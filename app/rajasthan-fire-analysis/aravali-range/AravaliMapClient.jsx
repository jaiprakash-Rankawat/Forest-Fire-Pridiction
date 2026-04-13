'use client';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Districts that the Aravalli Range passes through
const ARAVALLI_DISTRICTS = [
  'Sirohi', 'Pali', 'Rajsamand', 'Udaipur', 'Bhilwara', 'Ajmer', 
  'Jaipur', 'Sikar', 'Alwar', 'Dausa'
];

// Aravalli Range approximate path through Rajasthan (SW to NE)
const ARAVALLI_COORDS = [
  [24.59, 72.78],  // Guru Shikhar, Mount Abu (Sirohi)
  [24.79, 73.05],  // Pindwara (Sirohi)
  [25.00, 73.30],  // Falna area (Pali)
  [25.12, 73.47],  // Ranakpur (Pali)
  [25.15, 73.59],  // Kumbhalgarh (Rajsamand/Pali border)
  [25.07, 73.82],  // Rajsamand hills
  [25.20, 73.95],  // Nathdwara area
  [25.40, 74.15],  // Bhilwara western hills
  [25.65, 74.30],  // Bhilwara-Ajmer transition
  [25.90, 74.45],  // Near Beawar (Ajmer)
  [26.15, 74.50],  // Todgarh area
  [26.35, 74.55],  // Pushkar hills
  [26.49, 74.63],  // Ajmer (Taragarh)
  [26.59, 74.87],  // Kishangarh gap
  [26.75, 75.10],  // Near Dudu
  [26.88, 75.40],  // Sambhar Lake area
  [26.92, 75.65],  // Jaipur western hills
  [26.95, 75.78],  // Nahargarh, Jaipur
  [26.98, 75.85],  // Amber/Jaigarh
  [27.10, 75.95],  // North Jaipur hills
  [27.25, 76.10],  // Toward Alwar corridor
  [27.35, 76.30],  // Sariska foothills
  [27.42, 76.42],  // Sariska core
  [27.55, 76.55],  // Alwar hills
  [27.72, 76.65],  // Northern Alwar
  [27.85, 76.72],  // Rajasthan-Haryana border
];

const RISK_COLORS = {
  'Very High': '#FF0000',
  'High': '#FF8C00',
  'Moderate': '#FFD700',
  'Low': '#228B22',
  'Minimal': '#4A90D9',
  'Unknown': '#666666'
};

const ZONE_COLORS = {
  'Very High Fire Zone': { color: '#FF0000', label: 'Very High', emoji: ' ' },
  'High Fire Zone':      { color: '#FF8C00', label: 'High',      emoji: ' ' },
  'Moderate Fire Zone':  { color: '#FFD700', label: 'Moderate',   emoji: ' ' },
  'Low Fire Zone':       { color: '#228B22', label: 'Low',        emoji: ' ' },
};

export default function AravaliMapClient() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [fireData, setFireData] = useState(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [26.0, 74.0],
      zoom: 7,
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

    // Load map data
    loadAravaliMapData(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  async function loadAravaliMapData(map) {
    try {
      // Load district summary data
      const summaryRes = await fetch('/fire_zones/district_summary.json');
      const summaryData = await summaryRes.json();

      // Create layer groups
      const boundaryGroup = L.layerGroup().addTo(map);
      const fireZoneGroup = L.layerGroup().addTo(map);
      const firePointGroup = L.layerGroup().addTo(map);
      const aravalliGroup = L.layerGroup().addTo(map);

      // Draw Aravalli Range
      drawAravalliRange(map, aravalliGroup);

      // Load Aravalli district boundaries and fire data
      let totalFirePoints = 0;
      const districtFireData = [];

      for (const districtName of ARAVALLI_DISTRICTS) {
        const slug = districtName.toLowerCase().replace(/\s+/g, '-');
        
        try {
          // Load boundary
          const boundaryRes = await fetch(`/boundaries/${slug}_boundary.geojson`);
          if (!boundaryRes.ok) continue;
          const boundary = await boundaryRes.json();
          
          const districtSummary = summaryData[slug];
          const riskLevel = districtSummary?.riskLevel || 'Unknown';
          const riskColor = RISK_COLORS[riskLevel] || '#666';
          const firePoints = districtSummary?.firePoints || 0;
          
          totalFirePoints += firePoints;
          districtFireData.push({ name: districtName, slug, firePoints, riskLevel });

          // Draw boundary
          L.geoJSON(boundary, {
            style: {
              fillColor: riskColor + '33',
              fillOpacity: 0.3,
              color: '#FFD700',
              weight: 2,
              opacity: 0.8,
              dashArray: '5,3'
            },
            onEachFeature: (feature, layer) => {
              layer.bindPopup(`
                <div style="font-family: system-ui; min-width: 220px;">
                  <h3 style="margin:0 0 8px; font-size:16px; font-weight:700; color:#FFD700;"> ${districtName}</h3>
                  <div style="display:flex; gap:8px; margin-bottom:8px;">
                    <span style="background:${riskColor}22; color:${riskColor}; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:600; border:1px solid ${riskColor}44;">
                      ${riskLevel} Risk
                    </span>
                    <span style="background:#FFD70022; color:#FFD700; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:600; border:1px solid #FFD70044;">
                       Aravalli
                    </span>
                  </div>
                  <p style="margin:0 0 4px; color:#888; font-size:12px;"> ${firePoints} fire incidents detected</p>
                  <p style="margin:0 0 4px; color:#888; font-size:12px;"> Data: ${districtSummary?.yearRange || 'N/A'}</p>
                  <a href="/rajasthan-fire-analysis/${slug}" 
                     style="display:inline-block; margin-top:8px; padding:4px 12px; background:#FFD700; color:#000; border-radius:6px; font-size:12px; font-weight:600; text-decoration:none;">
                    View Detailed Analysis 
                  </a>
                </div>
              `);

              layer.on('mouseover', function() {
                this.setStyle({ opacity: 1, weight: 3 });
              });
              layer.on('mouseout', function() {
                this.setStyle({ opacity: 0.8, weight: 2 });
              });
            }
          }).addTo(boundaryGroup);

          // Load fire zones
          try {
            const fireZoneRes = await fetch(`/fire_zones/${slug}_fire_zones.geojson`);
            if (fireZoneRes.ok) {
              const fireZoneData = await fireZoneRes.json();
              
              // Zone polygons
              const zoneFeatures = fireZoneData.features.filter(f => f.properties?.zone);
              zoneFeatures.forEach(feature => {
                const zoneName = feature.properties.zone;
                const zoneInfo = ZONE_COLORS[zoneName] || { color: '#888', label: zoneName };

                L.geoJSON(feature, {
                  style: {
                    fillColor: zoneInfo.color,
                    fillOpacity: 0.4,
                    color: zoneInfo.color,
                    weight: 1,
                    opacity: 0.6
                  }
                }).addTo(fireZoneGroup);
              });

              // Fire points
              const pointFeatures = fireZoneData.features.filter(f => f.geometry?.type === 'Point');
              pointFeatures.forEach(pt => {
                const [lng, lat] = pt.geometry.coordinates;
                L.circleMarker([lat, lng], {
                  radius: 3,
                  fillColor: '#FF4444',
                  fillOpacity: 0.9,
                  color: '#FFF',
                  weight: 0.5
                }).addTo(firePointGroup);
              });
            }
          } catch (e) {
            // Skip if fire zone data not available
          }

        } catch (e) {
          // Skip districts without boundary data
        }
      }

      setFireData({
        totalFirePoints,
        districts: districtFireData.sort((a, b) => b.firePoints - a.firePoints)
      });

      // Add layer control
      L.control.layers(
        {},
        {
          '  District Boundaries': boundaryGroup,
          '  Fire Risk Zones': fireZoneGroup,
          '  Fire Points': firePointGroup,
          '  Aravalli Range': aravalliGroup,
        },
        { position: 'topright', collapsed: true }
      ).addTo(map);

      // Fit map to Aravalli bounds
      const bounds = L.latLngBounds(ARAVALLI_COORDS);
      map.fitBounds(bounds, { padding: [20, 20] });

    } catch (err) {
      console.error('Error loading Aravali map:', err);
    } finally {
      setLoading(false);
    }
  }

  function drawAravalliRange(map, group) {
    // Main Aravalli line 
    const aravalliLine = L.polyline(ARAVALLI_COORDS, {
      color: '#FFD700',
      weight: 4,
      opacity: 0.9,
      dashArray: '12,8',
      lineCap: 'round',
      lineJoin: 'round',
    });
    aravalliLine.addTo(group);

    // Glow effect behind the line
    const aravalliGlow = L.polyline(ARAVALLI_COORDS, {
      color: '#FFD700',
      weight: 12,
      opacity: 0.2,
      lineCap: 'round',
      lineJoin: 'round',
    });
    aravalliGlow.addTo(group);

    // Add labels at key points
    const labelPoints = [
      { coord: [24.59, 72.78], label: 'Guru Shikhar\n(1,722m)', anchor: 'start' },
      { coord: [25.15, 73.59], label: 'Kumbhalgarh', anchor: 'start' },
      { coord: [26.49, 74.63], label: 'Ajmer (Taragarh)', anchor: 'start' },
      { coord: [26.95, 75.78], label: 'Nahargarh, Jaipur', anchor: 'start' },
      { coord: [27.42, 76.42], label: 'Sariska', anchor: 'start' },
      { coord: [27.85, 76.72], label: 'Rajasthan-Haryana\nBorder', anchor: 'start' },
    ];

    labelPoints.forEach(pt => {
      L.marker(pt.coord, {
        icon: L.divIcon({
          className: 'aravalli-label',
          html: `<div style="
            color: #FFD700;
            font-size: 11px;
            font-weight: 700;
            text-shadow: 0 0 6px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.7);
            white-space: nowrap;
            pointer-events: none;
            letter-spacing: 0.5px;
          "> ${pt.label.replace('\n', '<br/>')}</div>`,
          iconSize: [0, 0],
          iconAnchor: [-8, 8],
        })
      }).addTo(group);
    });

    // Popup on the line itself
    aravalliLine.bindPopup(`
      <div style="font-family: system-ui; min-width: 250px;">
        <h3 style="margin:0 0 8px; font-size:16px; font-weight:800; color:#FFD700;">  Aravalli Range</h3>
        <p style="margin:0 0 6px; color:#666; font-size:12px;">
          One of the <strong>oldest fold mountains</strong> in the world (~350 million years old).
          Stretches ~692 km through Rajasthan from Mount Abu (Sirohi) to Khetri (near Delhi border).
        </p>
        <p style="margin:0 0 6px; color:#888; font-size:11px;">
          <strong>Highest Point:</strong> Guru Shikhar, 1,722m (Sirohi)<br/>
          <strong>Districts:</strong> ${ARAVALLI_DISTRICTS.length} districts touched<br/>
          <strong>Role:</strong> Biodiversity corridor, climate barrier, fire-risk spine
        </p>
        <p style="margin:0; color:#FFD70088; font-size:11px; font-style:italic;">
          Districts along the Aravalli have significantly higher fire incidents due to dense forest cover on the slopes.
        </p>
      </div>
    `);
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-black/50">
      <div 
        ref={mapRef} 
        className="w-full"
        style={{ height: '750px' }}
      />
      
      {/* Legend */}
      <div className="absolute bottom-5 left-5 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl px-4 py-3 z-[1000] shadow-xl max-w-[200px]">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Aravalli Range Map</h4>
        <div className="flex items-center gap-2 py-0.5">
          <span className="w-4 h-0 inline-block" style={{ borderTop: '2px dashed #FFD700' }}></span>
          <span className="text-xs text-yellow-400/80">Aravalli Range</span>
        </div>
        <div className="flex items-center gap-2 py-0.5">
          <span className="w-4 h-0 inline-block" style={{ borderTop: '2px dashed #FFD700AA' }}></span>
          <span className="text-xs text-slate-400">Aravalli District Border</span>
        </div>
        <div className="flex items-center gap-2 py-0.5">
          <span className="w-3 h-3 rounded-full inline-block bg-red-500 border border-white"></span>
          <span className="text-xs text-slate-400">Fire Point</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-700/50">
          <div className="text-xs text-slate-500">Fire Risk Zones:</div>
          {Object.entries(ZONE_COLORS).map(([name, z]) => (
            <div key={name} className="flex items-center gap-2 py-0.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: z.color, opacity: 0.7 }}></span>
              <span className="text-xs text-slate-400">{z.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fire points counter */}
      {fireData && !loading && (
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-yellow-500/30 rounded-lg px-3 py-2 z-[1000] shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-slate-300">
              <strong className="text-yellow-400">{fireData.totalFirePoints}</strong> fire points across <strong className="text-yellow-400">{ARAVALLI_DISTRICTS.length}</strong> Aravalli districts
            </span>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-[1000]">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-yellow-500 animate-spin mx-auto mb-3"></div>
            <p className="text-slate-400 text-sm">Loading Aravalli Range fire data...</p>
          </div>
        </div>
      )}
    </div>
  );
}
