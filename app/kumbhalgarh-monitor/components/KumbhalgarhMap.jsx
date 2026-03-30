"use client";

import { useEffect, useRef, useState } from "react";

export default function KumbhalgarhMap({
  boundary,
  fires,
  riskZones,
  activeFireId,
  onFireSelect,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const boundaryLayerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (mapInstanceRef.current || typeof window === "undefined") return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      const map = L.map(mapRef.current, {
        center: [25.1, 73.58],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Satellite imagery base layer (Google Earth-like)
      const satellite = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "© Esri, Maxar, Earthstar Geographics",
          maxZoom: 18,
        }
      );

      // Labels overlay on top of satellite
      const labels = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 18,
          pane: "overlayPane",
        }
      );

      satellite.addTo(map);
      labels.addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Draw boundary with animation
  useEffect(() => {
    if (!mapReady || !boundary || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const L = require("leaflet");

    // Remove previous boundary
    if (boundaryLayerRef.current) {
      map.removeLayer(boundaryLayerRef.current);
    }

    const boundaryLayer = L.geoJSON(boundary, {
      style: {
        color: "#16a34a",
        weight: 3,
        fillColor: "#22c55e",
        fillOpacity: 0.08,
        dashArray: "0",
        className: "km-boundary-path",
      },
    }).addTo(map);

    boundaryLayerRef.current = boundaryLayer;

    // Fit bounds with padding
    const bounds = boundaryLayer.getBounds();
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });

    // Animate the boundary drawing via stroke-dashoffset
    setTimeout(() => {
      const paths = mapRef.current?.querySelectorAll(".km-boundary-path");
      if (paths) {
        paths.forEach((pathEl) => {
          const svgPath = pathEl.querySelector("path") || pathEl;
          if (svgPath.getTotalLength) {
            const length = svgPath.getTotalLength();
            svgPath.style.strokeDasharray = `${length}`;
            svgPath.style.strokeDashoffset = `${length}`;
            svgPath.style.transition = "none";

            // Force reflow
            svgPath.getBoundingClientRect();

            svgPath.style.transition = "stroke-dashoffset 2.5s ease-in-out";
            svgPath.style.strokeDashoffset = "0";
          }
        });
      }
    }, 300);
  }, [mapReady, boundary]);

  // Draw risk zones
  useEffect(() => {
    if (!mapReady || !riskZones || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const L = require("leaflet");

    L.geoJSON(riskZones, {
      style: (feature) => ({
        color: feature.properties.color,
        weight: 2,
        fillColor: feature.properties.fillColor,
        fillOpacity: 0.3,
        dashArray: "5,5",
      }),
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        layer.bindPopup(
          `<div class="km-popup">
            <strong>${p.label}</strong>
            <p>${p.description}</p>
          </div>`
        );
      },
    }).addTo(map);
  }, [mapReady, riskZones]);

  // Draw fire markers
  useEffect(() => {
    if (!mapReady || !fires || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const L = require("leaflet");

    fires.forEach((fire) => {
      const isActive = activeFireId === fire.id;

      const marker = L.circleMarker([fire.lat, fire.lng], {
        radius: isActive ? 14 : 10,
        fillColor: "#ef4444",
        color: isActive ? "#fbbf24" : "#991b1b",
        weight: isActive ? 3 : 2,
        opacity: 1,
        fillOpacity: 0.8,
        className: `km-fire-marker ${isActive ? "km-fire-marker--active" : ""}`,
      }).addTo(map);

      const date = new Date(fire.date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      marker.bindPopup(
        `<div class="km-popup">
          <strong>🔥 ${fire.title}</strong>
          <p><b>Date:</b> ${date}</p>
          <p><b>Location:</b> ${fire.lat.toFixed(4)}°N, ${fire.lng.toFixed(4)}°E</p>
          <p><b>Area burned:</b> ${fire.area_burned_ha} ha</p>
          <p>${fire.description}</p>
        </div>`
      );

      marker.on("click", () => {
        onFireSelect && onFireSelect(fire);
      });

      if (isActive) {
        marker.openPopup();
      }
    });
  }, [mapReady, fires, activeFireId, onFireSelect]);

  // Pan to active fire
  useEffect(() => {
    if (!mapReady || !activeFireId || !fires || !mapInstanceRef.current) return;
    const fire = fires.find((f) => f.id === activeFireId);
    if (fire) {
      mapInstanceRef.current.flyTo([fire.lat, fire.lng], 13, {
        duration: 1.2,
      });
    }
  }, [mapReady, activeFireId, fires]);

  return (
    <div className="km-map-section">
      <div className="km-map-wrapper">
        <div ref={mapRef} id="km-leaflet-map" className="km-map-container" />

        {/* Legend */}
        <div className="km-legend">
          <h4 className="km-legend-title">Risk Zones</h4>
          <div className="km-legend-item">
            <span className="km-legend-color km-legend-high" />
            <span>High Risk</span>
          </div>
          <div className="km-legend-item">
            <span className="km-legend-color km-legend-medium" />
            <span>Medium Risk</span>
          </div>
          <div className="km-legend-item">
            <span className="km-legend-color km-legend-low" />
            <span>Low Risk</span>
          </div>
          <div className="km-legend-item">
            <span className="km-legend-color km-legend-boundary" />
            <span>Sanctuary Boundary</span>
          </div>
          <div className="km-legend-item">
            <span className="km-legend-dot" />
            <span>Fire Location</span>
          </div>
        </div>
      </div>
    </div>
  );
}
