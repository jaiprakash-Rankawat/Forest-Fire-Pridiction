"use client";

import { useEffect, useRef, useState } from "react";
import { INDIAN_FORESTS, findNearestForest } from "../../data/forests";

// Forest type colors for map markers
const TYPE_COLORS = {
  "National Park": "#16a34a",
  "Tiger Reserve": "#dc2626",
  "Wildlife Sanctuary": "#2563eb",
  "Biosphere Reserve": "#7c3aed",
};

export default function ForestExplorerMap({ onLocationSelect, selectedForest, onForestSelect, toastMessage }) {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);
  const clickMarkerRef = useRef(null);

  // Initialize Leaflet map on client
  useEffect(() => {
    if (typeof window === "undefined" || leafletMapRef.current) return;

    import("leaflet").then((L) => {
      // Fix default icon
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, {
        center: [22.0, 80.0],
        zoom: 5,
        minZoom: 4,
        maxZoom: 16,
        zoomControl: true,
      });

      // Satellite imagery layer (ESRI World Imagery)
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
          maxZoom: 19,
        }
      ).addTo(map);

      // Hybrid overlay: roads/labels
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        { opacity: 0.6, maxZoom: 19 }
      ).addTo(map);

      // Plot forest markers and area boundaries
      INDIAN_FORESTS.forEach((forest) => {
        const color = TYPE_COLORS[forest.type] || "#16a34a";

        // Calculate approximate radius in meters based on area in km² (Area = π * r²)
        const radiusMeters = Math.sqrt((forest.area * 1000000) / Math.PI);

        // 1. Draw the proportional boundary circle
        const boundary = L.circle([forest.lat, forest.lon], {
          radius: radiusMeters,
          color: color,
          weight: 2,
          opacity: 0.6,
          fillColor: color,
          fillOpacity: 0.15,
          dashArray: "4, 6",
        }).addTo(map);

        // 2. Draw the fixed center marker
        const centerMarker = L.circleMarker([forest.lat, forest.lon], {
          radius: 6,
          fillColor: color,
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 1,
        }).addTo(map);

        const tooltipHtml = `
          <div style="font-weight:600;font-size:13px;">${forest.name}</div>
          <div style="font-size:11px;color:#aaa;">${forest.state} · ${forest.type}</div>
          <div style="font-size:11px;margin-top:2px;color:#ddd;">Area: ${forest.area.toLocaleString()} km²</div>
          <div style="font-size:11px;color:#888;margin-top:2px;font-family:monospace;">Lat: ${forest.lat.toFixed(4)}, Lon: ${forest.lon.toFixed(4)}</div>
        `;

        boundary.bindTooltip(tooltipHtml, { permanent: false, direction: "top", className: "forest-tooltip" });
        centerMarker.bindTooltip(tooltipHtml, { permanent: false, direction: "top", className: "forest-tooltip" });

        const handleForestClick = () => {
          onForestSelect(forest);
        };

        boundary.on("click", handleForestClick);
        centerMarker.on("click", handleForestClick);

        markersRef.current.push(boundary);
        markersRef.current.push(centerMarker);
      });

      // Click on map to get weather for that location (delegated to parent for delay)
      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        
        // Find nearest forest immediately
        const { forest } = findNearestForest(lat, lng);
        
        // Trigger the parent's unified delayed selection handler
        onForestSelect(forest);
      });

      leafletMapRef.current = map;
      setMapReady(true);
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Pan to selected forest from search bar
  useEffect(() => {
    if (!leafletMapRef.current || !selectedForest) return;
    import("leaflet").then((L) => {
      leafletMapRef.current.flyTo([selectedForest.lat, selectedForest.lon], 10, {
        animate: true,
        duration: 1.2,
      });

      if (clickMarkerRef.current) {
        clickMarkerRef.current.remove();
      }

      const clickIcon = L.divIcon({
        className: "",
        html: `<div style="
          width: 24px; height: 24px;
          background: rgba(239,68,68,0.85);
          border: 3px solid #fff;
          border-radius: 50%;
          box-shadow: 0 0 0 5px rgba(239,68,68,0.3);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      clickMarkerRef.current = L.marker([selectedForest.lat, selectedForest.lon], {
        icon: clickIcon,
      }).addTo(leafletMapRef.current);

      onLocationSelect({ lat: selectedForest.lat, lon: selectedForest.lon });
    });
  }, [selectedForest]);

  return (
    <div className="relative w-full h-full">
      {/* Toast Message Overlay */}
      {toastMessage && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2000] pointer-events-none">
          <div className="bg-black/80 backdrop-blur-md border border-green-500/50 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            <span className="font-medium text-lg">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-3 right-3 z-[1000] bg-black/70 backdrop-blur-sm text-white rounded-xl p-3 text-xs space-y-1.5 shadow-lg">
        <div className="font-bold text-sm mb-2 text-green-400">🗺️ Legend</div>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-white/40 flex-shrink-0" style={{ background: color }} />
            <span>{type}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/20">
          <div className="w-3 h-3 rounded-full bg-orange-500 border border-white/40 flex-shrink-0" />
          <span>Selected Location</span>
        </div>
      </div>

      {/* Map instruction */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1000] bg-black/60 backdrop-blur-sm text-white/80 text-xs px-4 py-2 rounded-full pointer-events-none">
        🌍 Click anywhere on the map to analyze fire risk at that location
      </div>

      <div
        ref={mapRef}
        style={{ width: "100%", height: "100%", minHeight: "500px" }}
        className="rounded-2xl overflow-hidden"
      />

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255,165,0,0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255,165,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,165,0,0); }
        }
        .forest-tooltip {
          background: rgba(0,0,0,0.85) !important;
          border: 1px solid rgba(255,255,255,0.2) !important;
          border-radius: 8px !important;
          color: white !important;
          padding: 8px 12px !important;
          font-family: inherit !important;
        }
        .forest-tooltip::before {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
