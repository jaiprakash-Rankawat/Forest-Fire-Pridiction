"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

const DISTRICTS = [
  {
    slug: "ajmer",
    name: "Ajmer",
    center: [26.45, 74.64],
    zoom: 10,
    forestCover: "medium",
  },
  {
    slug: "alwar",
    name: "Alwar",
    center: [27.55, 76.61],
    zoom: 10,
    forestCover: "high",
  },
  {
    slug: "banswara",
    name: "Banswara",
    center: [23.55, 74.44],
    zoom: 10,
    forestCover: "high",
  },
  {
    slug: "baran",
    name: "Baran",
    center: [25.1, 76.51],
    zoom: 10,
    forestCover: "high",
  },
  {
    slug: "barmer",
    name: "Barmer",
    center: [25.75, 71.39],
    zoom: 9,
    forestCover: "low",
  },
  {
    slug: "bharatpur",
    name: "Bharatpur",
    center: [27.22, 77.49],
    zoom: 10,
    forestCover: "medium",
  },
  {
    slug: "bhilwara",
    name: "Bhilwara",
    center: [25.35, 74.64],
    zoom: 10,
    forestCover: "medium",
  },
  {
    slug: "bikaner",
    name: "Bikaner",
    center: [28.02, 73.31],
    zoom: 9,
    forestCover: "low",
  },
  {
    slug: "bundi",
    name: "Bundi",
    center: [25.44, 75.64],
    zoom: 10,
    forestCover: "medium",
  },
  {
    slug: "chittorgarh",
    name: "Chittorgarh",
    center: [24.88, 74.63],
    zoom: 10,
    forestCover: "medium",
  },
  {
    slug: "churu",
    name: "Churu",
    center: [28.3, 74.97],
    zoom: 10,
    forestCover: "low",
  },
  {
    slug: "dausa",
    name: "Dausa",
    center: [26.88, 76.34],
    zoom: 10,
    forestCover: "low",
  },
  {
    slug: "dholpur",
    name: "Dholpur",
    center: [26.7, 77.89],
    zoom: 10,
    forestCover: "medium",
  },
  {
    slug: "dungarpur",
    name: "Dungarpur",
    center: [23.84, 73.71],
    zoom: 10,
    forestCover: "high",
  },
  {
    slug: "hanumangarh",
    name: "Hanumangarh",
    center: [29.58, 74.33],
    zoom: 10,
    forestCover: "low",
  },
  {
    slug: "jaipur",
    name: "Jaipur",
    center: [26.92, 75.79],
    zoom: 10,
    forestCover: "medium",
  },
  {
    slug: "jaisalmer",
    name: "Jaisalmer",
    center: [26.92, 70.91],
    zoom: 8,
    forestCover: "low",
  },
  {
    slug: "jalore",
    name: "Jalore",
    center: [25.35, 72.62],
    zoom: 10,
    forestCover: "low",
  },
  {
    slug: "jhalawar",
    name: "Jhalawar",
    center: [24.6, 76.16],
    zoom: 10,
    forestCover: "high",
  },
  {
    slug: "jhunjhunu",
    name: "Jhunjhunu",
    center: [28.13, 75.4],
    zoom: 10,
    forestCover: "low",
  },
  {
    slug: "jodhpur",
    name: "Jodhpur",
    center: [26.29, 73.02],
    zoom: 9,
    forestCover: "low",
  },
  {
    slug: "karauli",
    name: "Karauli",
    center: [26.49, 77.02],
    zoom: 10,
    forestCover: "high",
  },
  {
    slug: "kota",
    name: "Kota",
    center: [25.18, 75.83],
    zoom: 10,
    forestCover: "medium",
  },
  {
    slug: "nagaur",
    name: "Nagaur",
    center: [27.2, 73.74],
    zoom: 9,
    forestCover: "low",
  },
  {
    slug: "pali",
    name: "Pali",
    center: [25.77, 73.33],
    zoom: 10,
    forestCover: "medium",
  },
  {
    slug: "pratapgarh",
    name: "Pratapgarh",
    center: [24.03, 74.78],
    zoom: 10,
    forestCover: "high",
  },
  {
    slug: "rajsamand",
    name: "Rajsamand",
    center: [25.07, 73.88],
    zoom: 10,
    forestCover: "high",
  },
  {
    slug: "sawai-madhopur",
    name: "Sawai Madhopur",
    center: [26.02, 76.35],
    zoom: 10,
    forestCover: "high",
  },
  {
    slug: "sikar",
    name: "Sikar",
    center: [27.61, 75.14],
    zoom: 10,
    forestCover: "low",
  },
  {
    slug: "sirohi",
    name: "Sirohi",
    center: [24.88, 72.86],
    zoom: 10,
    forestCover: "high",
  },
  {
    slug: "sri-ganganagar",
    name: "Sri Ganganagar",
    center: [29.91, 73.88],
    zoom: 9,
    forestCover: "low",
  },
  {
    slug: "tonk",
    name: "Tonk",
    center: [26.17, 75.79],
    zoom: 10,
    forestCover: "low",
  },
  {
    slug: "udaipur",
    name: "Udaipur",
    center: [24.58, 73.68],
    zoom: 9,
    forestCover: "high",
  },
];

const RISK_COLORS = {
  "Very High": "#FF0000",
  High: "#FF8C00",
  Moderate: "#FFD700",
  Low: "#228B22",
  Minimal: "#4A90D9",
  Unknown: "#666666",
};

const RISK_BG = {
  "Very High": "bg-red-500/20 border-red-500/40 text-red-400",
  High: "bg-orange-500/20 border-orange-500/40 text-orange-400",
  Moderate: "bg-yellow-500/20 border-yellow-500/40 text-yellow-400",
  Low: "bg-green-500/20 border-green-500/40 text-green-400",
  Minimal: "bg-blue-500/20 border-blue-500/40 text-blue-400",
  Unknown: "bg-slate-500/20 border-slate-500/40 text-slate-400",
};

const ZONE_COLORS = {
  "Very High Fire Zone": { color: "#FF0000", label: "Very High", emoji: "🔴" },
  "High Fire Zone": { color: "#FF8C00", label: "High", emoji: "🟠" },
  "Moderate Fire Zone": { color: "#FFD700", label: "Moderate", emoji: "🟡" },
  "Low Fire Zone": { color: "#228B22", label: "Low", emoji: "🟢" },
};

// Aravalli Range approximate path through Rajasthan (SW to NE)
const ARAVALLI_COORDS = [
  [24.59, 72.78], // Guru Shikhar, Mount Abu (Sirohi)
  [24.79, 73.05], // Pindwara (Sirohi)
  [25.0, 73.3], // Falna area (Pali)
  [25.12, 73.47], // Ranakpur (Pali)
  [25.15, 73.59], // Kumbhalgarh (Rajsamand/Pali border)
  [25.07, 73.82], // Rajsamand hills
  [25.2, 73.95], // Nathdwara area
  [25.4, 74.15], // Bhilwara western hills
  [25.65, 74.3], // Bhilwara-Ajmer transition
  [25.9, 74.45], // Near Beawar (Ajmer)
  [26.15, 74.5], // Todgarh area
  [26.35, 74.55], // Pushkar hills
  [26.49, 74.63], // Ajmer (Taragarh)
  [26.59, 74.87], // Kishangarh gap
  [26.75, 75.1], // Near Dudu
  [26.88, 75.4], // Sambhar Lake area
  [26.92, 75.65], // Jaipur western hills
  [26.95, 75.78], // Nahargarh, Jaipur
  [26.98, 75.85], // Amber/Jaigarh
  [27.1, 75.95], // North Jaipur hills
  [27.25, 76.1], // Toward Alwar corridor
  [27.35, 76.3], // Sariska foothills
  [27.42, 76.42], // Sariska core
  [27.55, 76.55], // Alwar hills
  [27.72, 76.65], // Northern Alwar
  [27.85, 76.72], // Rajasthan-Haryana border
];

// Districts the Aravalli passes through
const ARAVALLI_DISTRICTS = [
  "Sirohi",
  "Pali",
  "Rajsamand",
  "Udaipur",
  "Bhilwara",
  "Ajmer",
  "Jaipur",
  "Sikar",
  "Alwar",
  "Dausa",
];

export default function RajasthanDashboard() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState({ loaded: 0, total: 33 });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("risk");
  const [view, setView] = useState("map"); // 'map' or 'grid'
  const [totalFirePoints, setTotalFirePoints] = useState(0);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [26.5, 73.8],
      zoom: 6,
      zoomControl: false,
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    // Dark satellite hybrid
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 18 },
    ).addTo(map);

    // Labels overlay
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png",
      { maxZoom: 18 },
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

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
      const summaryRes = await fetch("/fire_zones/district_summary.json");
      const summaryData = await summaryRes.json();
      setSummary(summaryData);

      // Create layer groups for toggling
      const boundaryGroup = L.layerGroup().addTo(map);
      const fireZoneGroup = L.layerGroup().addTo(map);
      const firePointGroup = L.layerGroup().addTo(map);
      const aravalliGroup = L.layerGroup().addTo(map);

      // ===== Draw Aravalli Range =====
      drawAravalliRange(map, aravalliGroup);

      // ===== Load district boundaries =====
      for (const district of DISTRICTS) {
        try {
          const res = await fetch(
            `/boundaries/${district.slug}_boundary.geojson`,
          );
          if (!res.ok) continue;
          const boundary = await res.json();

          const districtSummary = summaryData[district.slug];
          const riskLevel = districtSummary?.riskLevel || "Unknown";
          const riskColor = RISK_COLORS[riskLevel] || "#666";
          const firePoints = districtSummary?.firePoints || 0;

          L.geoJSON(boundary, {
            style: {
              fillColor: "transparent",
              fillOpacity: 0,
              color: "#FFFFFFAA",
              weight: 1.5,
              opacity: 0.5,
              dashArray: "4,4",
            },
            onEachFeature: (feature, layer) => {
              layer.bindPopup(`
                <div style="font-family: system-ui; min-width: 220px;">
                  <h3 style="margin:0 0 8px; font-size:16px; font-weight:700; color:${riskColor}">${district.name} District</h3>
                  <div style="display:flex; gap:8px; margin-bottom:8px;">
                    <span style="background:${riskColor}22; color:${riskColor}; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:600; border:1px solid ${riskColor}44;">
                      ${riskLevel} Risk
                    </span>
                  </div>
                  <p style="margin:0 0 4px; color:#888; font-size:12px;">🔥 ${firePoints} fire incidents detected</p>
                  <p style="margin:0 0 4px; color:#888; font-size:12px;">📅 Data: ${districtSummary?.yearRange || "N/A"}</p>
                  <a href="/rajasthan-fire-analysis/${district.slug}" 
                     style="display:inline-block; margin-top:8px; padding:4px 12px; background:${riskColor}; color:white; border-radius:6px; font-size:12px; font-weight:600; text-decoration:none;">
                    View Detailed Analysis →
                  </a>
                </div>
              `);

              layer.on("mouseover", function () {
                this.setStyle({ opacity: 0.9, weight: 2.5 });
              });
              layer.on("mouseout", function () {
                this.setStyle({ opacity: 0.5, weight: 1.5 });
              });
            },
          }).addTo(boundaryGroup);
        } catch (e) {
          // Skip districts without boundary data
        }
      }

      // ===== Load fire zone GeoJSON for all districts (progressive) =====
      let allFirePointsCount = 0;
      let loadedCount = 0;

      const loadPromises = DISTRICTS.map(async (district) => {
        try {
          const res = await fetch(
            `/fire_zones/${district.slug}_fire_zones.geojson`,
          );
          if (!res.ok) return;
          const data = await res.json();

          // Zone polygons
          const zoneFeatures = data.features.filter((f) => f.properties?.zone);
          zoneFeatures.forEach((feature) => {
            const zoneName = feature.properties.zone;
            const zoneInfo = ZONE_COLORS[zoneName] || {
              color: "#888",
              label: zoneName,
            };

            L.geoJSON(feature, {
              style: {
                fillColor: zoneInfo.color,
                fillOpacity: 0.3,
                color: zoneInfo.color,
                weight: 0.5,
                opacity: 0.5,
              },
            })
              .bindPopup(
                `
              <div style="font-family: system-ui; min-width: 180px;">
                <h3 style="margin:0 0 6px; font-size:14px; color:${zoneInfo.color}">${zoneInfo.emoji} ${zoneName}</h3>
                <p style="margin:0; color:#666; font-size:12px;">District: <strong>${district.name}</strong></p>
                <p style="margin:4px 0 0; color:#888; font-size:11px;">Based on KDE of NASA FIRMS data</p>
                <a href="/rajasthan-fire-analysis/${district.slug}" 
                   style="display:inline-block; margin-top:6px; padding:3px 10px; background:${zoneInfo.color}33; color:${zoneInfo.color}; border:1px solid ${zoneInfo.color}66; border-radius:4px; font-size:11px; font-weight:600; text-decoration:none;">
                  View ${district.name} →
                </a>
              </div>
            `,
              )
              .addTo(fireZoneGroup);
          });

          // Fire points
          const pointFeatures = data.features.filter(
            (f) => f.geometry?.type === "Point",
          );
          allFirePointsCount += pointFeatures.length;

          pointFeatures.forEach((pt) => {
            const [lng, lat] = pt.geometry.coordinates;
            L.circleMarker([lat, lng], {
              radius: 4,
              fillColor: "#FF4444",
              fillOpacity: 0.85,
              color: "#FFF",
              weight: 1,
            })
              .bindPopup(
                `
              <div style="font-family: system-ui;">
                <strong style="color:#FF4444;">🔥 Fire Incident</strong><br/>
                <span style="color:#555;">District: ${district.name}</span><br/>
                <span style="color:#666;">Date: ${pt.properties.date || "Unknown"}</span><br/>
                <span style="color:#666;">Brightness: ${pt.properties.brightness || "N/A"}</span><br/>
                <span style="color:#888; font-size:11px;">Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}</span>
              </div>
            `,
              )
              .addTo(firePointGroup);
          });

          loadedCount++;
          setLoadProgress({ loaded: loadedCount, total: DISTRICTS.length });
        } catch (e) {
          loadedCount++;
          setLoadProgress({ loaded: loadedCount, total: DISTRICTS.length });
        }
      });

      await Promise.all(loadPromises);
      setTotalFirePoints(allFirePointsCount);

      // Add layer control for toggling
      L.control
        .layers(
          {},
          {
            "🏛️ District Boundaries": boundaryGroup,
            "🗺️ Fire Risk Zones": fireZoneGroup,
            "🔥 Fire Points": firePointGroup,
            "⛰️ Aravalli Range": aravalliGroup,
          },
          { position: "topright", collapsed: true },
        )
        .addTo(map);

      setLoading(false);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setLoading(false);
    }
  }

  function drawAravalliRange(map, group) {
    // Main Aravalli line — golden dashed
    const aravalliLine = L.polyline(ARAVALLI_COORDS, {
      color: "#FFD700",
      weight: 3.5,
      opacity: 0.85,
      dashArray: "10,6",
      lineCap: "round",
      lineJoin: "round",
    });
    aravalliLine.addTo(group);

    // Glow effect behind the line
    const aravalliGlow = L.polyline(ARAVALLI_COORDS, {
      color: "#FFD700",
      weight: 10,
      opacity: 0.15,
      lineCap: "round",
      lineJoin: "round",
    });
    aravalliGlow.addTo(group);

    // Add labels at key points
    const labelPoints = [
      {
        coord: [24.59, 72.78],
        label: "Guru Shikhar\n(1,722m)",
        anchor: "start",
      },
      { coord: [25.15, 73.59], label: "Kumbhalgarh", anchor: "start" },
      { coord: [26.49, 74.63], label: "Ajmer (Taragarh)", anchor: "start" },
      { coord: [26.95, 75.78], label: "Nahargarh, Jaipur", anchor: "start" },
      { coord: [27.42, 76.42], label: "Sariska", anchor: "start" },
      {
        coord: [27.85, 76.72],
        label: "Rajasthan-Haryana\nBorder",
        anchor: "start",
      },
    ];

    labelPoints.forEach((pt) => {
      L.marker(pt.coord, {
        icon: L.divIcon({
          className: "aravalli-label",
          html: `<div style="
            color: #FFD700;
            font-size: 10px;
            font-weight: 700;
            text-shadow: 0 0 6px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.7);
            white-space: nowrap;
            pointer-events: none;
            letter-spacing: 0.5px;
          ">⛰️ ${pt.label.replace("\n", "<br/>")}</div>`,
          iconSize: [0, 0],
          iconAnchor: [-8, 8],
        }),
      }).addTo(group);
    });

    // Popup on the line itself
    aravalliLine.bindPopup(`
      <div style="font-family: system-ui; min-width: 250px;">
        <h3 style="margin:0 0 8px; font-size:16px; font-weight:800; color:#FFD700;">⛰️ Aravalli Range</h3>
        <p style="margin:0 0 6px; color:#666; font-size:12px;">
          One of the <strong>oldest fold mountains</strong> in the world (~350 million years old).
          Stretches ~692 km through Rajasthan from Mount Abu (Sirohi) to Khetri (near Delhi border).
        </p>
        <p style="margin:0 0 6px; color:#888; font-size:11px;">
          <strong>Highest Point:</strong> Guru Shikhar, 1,722m (Sirohi)<br/>
          <strong>Role:</strong> Acts as a biodiversity corridor, climate barrier, and fire-risk spine for the state
        </p>
        <p style="margin:0; color:#FFD70088; font-size:11px; font-style:italic;">
          Districts along the Aravalli have significantly higher fire incidents due to dense forest cover on the slopes.
        </p>
      </div>
    `);
  }

  // Filter and sort districts
  const filteredDistricts = DISTRICTS.map((d) => ({
    ...d,
    ...(summary?.[d.slug] || {}),
    riskLevel: summary?.[d.slug]?.riskLevel || "Unknown",
  }))
    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "risk") {
        const order = {
          "Very High": 0,
          High: 1,
          Moderate: 2,
          Low: 3,
          Minimal: 4,
          Unknown: 5,
        };
        return (order[a.riskLevel] ?? 5) - (order[b.riskLevel] ?? 5);
      }
      if (sortBy === "fires") return (b.firePoints || 0) - (a.firePoints || 0);
      return a.name.localeCompare(b.name);
    });

  const riskCounts = {};
  if (summary) {
    Object.values(summary).forEach((d) => {
      const r = d.riskLevel || "Unknown";
      riskCounts[r] = (riskCounts[r] || 0) + 1;
    });
  }

  const totalFires = summary
    ? Object.values(summary).reduce((s, d) => s + (d.firePoints || 0), 0)
    : 0;

  return (
    <div className="space-y-6 mt-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <Link
          href="/rajasthan-fire-analysis/fire-points-chart"
          className="bg-slate-900/70 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm hover:border-blue-500/40 hover:bg-slate-800/50 transition-all group block"
        >
          <div className="text-sm text-slate-500 mb-1">
            Total Fire Incidents
          </div>
          <div className="text-2xl font-bold text-orange-400 group-hover:text-orange-300">
            {totalFires.toLocaleString()}
          </div>
          <div className="text-xs text-blue-400/70 mt-1 group-hover:text-blue-400">
            View Chart Analysis{" "}
          </div>
        </Link>
        {["Very High", "High", "Moderate", "Low", "Minimal"].map((level) => (
          <div
            key={level}
            className="bg-slate-900/70 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm"
          >
            <div className="text-sm text-slate-500 mb-1">{level} Risk</div>
            <div
              className="text-2xl font-bold"
              style={{ color: RISK_COLORS[level] }}
            >
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
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 pl-10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all"
          />
          <svg
            className="absolute left-3 top-3 w-4 h-4 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-orange-500/50"
          >
            <option value="risk">Sort by Risk Level</option>
            <option value="fires">Sort by Fire Count</option>
            <option value="name">Sort by Name</option>
          </select>
          <Link
            href="/rajasthan-fire-analysis/fire-points-chart"
            className="px-3 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/40 rounded-lg text-sm font-medium hover:bg-blue-500/30 hover:border-blue-500/60 transition-all flex items-center gap-2"
          >
            Chart Analysis
          </Link>
          <div className="flex bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setView("map")}
              className={`px-3 py-2 text-sm transition-all ${view === "map" ? "bg-orange-500/20 text-orange-400" : "text-slate-400 hover:text-slate-200"}`}
            >
              Map
            </button>
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-2 text-sm transition-all ${view === "grid" ? "bg-orange-500/20 text-orange-400" : "text-slate-400 hover:text-slate-200"}`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Map View */}
      {view === "map" && (
        <div className="relative rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-black/50">
          <div
            ref={mapRef}
            id="rajasthan-map"
            className="w-full"
            style={{ height: "750px" }}
          />

          {/* Legend */}
          <div className="absolute bottom-5 left-5 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl px-4 py-3 z-[1000] shadow-xl max-w-[200px]">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Fire Risk Zones
            </h4>
            {Object.entries(ZONE_COLORS).map(([name, z]) => (
              <div key={name} className="flex items-center gap-2 py-0.5">
                <span
                  className="w-4 h-3 rounded-sm inline-block"
                  style={{ backgroundColor: z.color, opacity: 0.7 }}
                ></span>
                <span className="text-xs text-slate-400">{z.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 py-0.5 mt-1.5 border-t border-slate-700/50 pt-1.5">
              <span className="w-3 h-3 rounded-full inline-block bg-red-500 border border-white"></span>
              <span className="text-xs text-slate-400">Fire Point</span>
            </div>
            <div className="flex items-center gap-2 py-0.5">
              <span
                className="w-4 h-0.5 inline-block"
                style={{
                  backgroundColor: "#FFD700",
                  borderTop: "2px dashed #FFD700",
                }}
              ></span>
              <span className="text-xs text-yellow-400/80">Aravalli Range</span>
            </div>
            <div className="flex items-center gap-2 py-0.5">
              <span
                className="w-4 h-0 inline-block"
                style={{ borderTop: "1.5px dashed #FFFFFFAA" }}
              ></span>
              <span className="text-xs text-slate-400">District Border</span>
            </div>
          </div>

          {/* Fire points counter badge */}
          {totalFirePoints > 0 && !loading && (
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-red-500/30 rounded-lg px-3 py-2 z-[1000] shadow-xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-slate-300">
                  <strong className="text-red-400">{totalFirePoints}</strong>{" "}
                  fire points loaded across{" "}
                  <strong className="text-orange-400">33</strong> districts
                </span>
              </div>
            </div>
          )}

          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-[1000]">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-red-500 animate-spin mx-auto mb-3"></div>
                <p className="text-slate-400 text-sm">
                  Loading fire zones for all districts...
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {loadProgress.loaded}/{loadProgress.total} districts loaded
                </p>
                <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-2 mx-auto overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${(loadProgress.loaded / loadProgress.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== Aravalli Range Info Section ===== */}
      <div className="bg-gradient-to-br from-slate-900/90 via-yellow-950/20 to-slate-900/90 border border-yellow-600/30 rounded-xl p-6 backdrop-blur-sm hover:border-yellow-500/40 transition-colors">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 mb-3 flex items-center gap-2">
              <span className="text-2xl">⛰️</span>
              The Aravalli Range — Rajasthan&apos;s Fire Spine
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              The Aravalli Range is one of the{" "}
              <strong className="text-yellow-400">
                oldest fold mountain systems
              </strong>{" "}
              in the world, dating back approximately{" "}
              <strong className="text-yellow-400">350 million years</strong> to
              the Precambrian era. Stretching{" "}
              <strong className="text-yellow-400">~692 km</strong> through
              Rajasthan from
              <strong className="text-amber-300">
                {" "}
                Guru Shikhar (1,722m)
              </strong>{" "}
              in Sirohi to the Delhi border near Alwar, it serves as the
              state&apos;s primary{" "}
              <strong className="text-yellow-400">
                biodiversity corridor
              </strong>{" "}
              and
              <strong className="text-yellow-400">climate divide</strong>.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              The range separates the{" "}
              <strong className="text-emerald-400">
                semi-arid eastern Rajasthan
              </strong>{" "}
              from the
              <strong className="text-amber-400">
                {" "}
                hyper-arid Thar Desert
              </strong>{" "}
              to the west. Its forested slopes harbor the densest vegetation in
              the state, making Aravalli districts the{" "}
              <strong className="text-red-400">most fire-prone</strong> zones in
              Rajasthan. Districts along the Aravalli collectively account for{" "}
              <strong className="text-red-400">over 60%</strong> of all forest
              fire incidents in the state.
            </p>
          </div>

          <div className="md:w-80 shrink-0 space-y-3">
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/60 rounded-lg p-3 text-center border border-slate-700/40">
                <div className="text-lg font-bold text-yellow-400">~692 km</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Length (Rajasthan)
                </div>
              </div>
              <Link
                href="/rajasthan-fire-analysis/aravali-range"
                className="px-4 py-2 bg-slate-800/60 border border-yellow-600/40 rounded-lg text-center backdrop-blur-sm hover:border-yellow-500/60 hover:bg-yellow-500/10 transition-all group"
              >
                <div className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300">
                  -
                </div>
                <div className="text-xs text-yellow-500/80 uppercase tracking-wider">
                  Aravalli Range
                </div>
              </Link>
              <div className="bg-slate-800/60 rounded-lg p-3 text-center border border-slate-700/40">
                <div className="text-lg font-bold text-amber-400">~350 Myr</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Age
                </div>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-3 text-center border border-slate-700/40">
                <div className="text-lg font-bold text-red-400">10</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Districts Touched
                </div>
              </div>
            </div>

            {/* Districts along Aravalli */}
            <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/40">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">
                Districts Along the Range
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ARAVALLI_DISTRICTS.map((name) => {
                  const slug = name.toLowerCase().replace(/\s/g, "-");
                  return (
                    <Link
                      key={name}
                      href={`/rajasthan-fire-analysis/${slug}`}
                      className="text-[10px] px-2 py-1 bg-yellow-500/10 text-yellow-400/90 rounded-md border border-yellow-500/20 hover:bg-yellow-500/20 hover:border-yellow-500/40 transition-all font-medium"
                    >
                      {name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Ecological significance strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-yellow-700/20">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🌳</span>
            <div>
              <div className="text-sm font-bold text-slate-300">
                Biodiversity Corridor
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Connects fragmented forests from Gujarat to Haryana, enabling
                wildlife migration. Home to leopards, sloth bears, and wolf
                populations.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🌡️</span>
            <div>
              <div className="text-sm font-bold text-slate-300">
                Climate Barrier
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Intercepts monsoon moisture from the southeast, creating a
                dramatic rainfall gradient — 800mm on the east vs 200mm on the
                west side.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="text-sm font-bold text-slate-300">
                Fire Risk Spine
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dense deciduous forests on Aravalli slopes become extreme
                fire-fuel loads during dry summer months (March–June), driving
                the state&apos;s highest fire incidents.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid View - District Cards */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${view === "map" ? "mt-6" : ""}`}
      >
        {filteredDistricts.map((district) => (
          <Link
            key={district.slug}
            href={`/rajasthan-fire-analysis/${district.slug}`}
            className="group bg-slate-900/70 border border-slate-700/50 rounded-xl p-5 hover:border-orange-500/40 hover:bg-slate-800/50 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-slate-200 group-hover:text-orange-400 transition-colors">
                {district.name}
              </h3>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-md border ${RISK_BG[district.riskLevel] || RISK_BG["Unknown"]}`}
              >
                {district.riskLevel}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>🔥 Fire Incidents</span>
                <span className="font-semibold text-slate-300">
                  {district.firePoints || 0}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>🌳 Forest Cover</span>
                <span className="font-semibold text-slate-300 capitalize">
                  {district.forestCover}
                </span>
              </div>
              {district.yearRange && (
                <div className="flex justify-between text-slate-400">
                  <span>📅 Data Range</span>
                  <span className="font-semibold text-slate-300">
                    {district.yearRange}
                  </span>
                </div>
              )}
              {/* Aravalli badge */}
              {ARAVALLI_DISTRICTS.includes(district.name) && (
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-400/80 rounded-full border border-yellow-500/20 font-medium">
                    ⛰️ Aravalli Range
                  </span>
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
                      opacity: 0.7,
                    }}
                    title={`${zoneName}: ${info.area} km²`}
                  ></div>
                ))}
              </div>
            )}

            <div className="mt-3 text-xs text-slate-500 group-hover:text-orange-400/70 transition-colors flex items-center gap-1">
              View Detailed Analysis
              <svg
                className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {filteredDistricts.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p className="text-lg">
            No districts found matching &quot;{search}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
