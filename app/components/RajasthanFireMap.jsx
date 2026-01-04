"use client";

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Next.js

const RajasthanFireMap = ({ selectedForest, predictionResult }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layerGroup = useRef(null);

  // Initialize the map and icons
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Fix for default marker icons in Next.js
      // Check if L.Icon.Default.prototype._getIconUrl is a function before calling/deleting
       // @ts-ignore
      const iconOptions = {
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      };
      
      L.Icon.Default.mergeOptions(iconOptions);
    } catch (e) {
      console.warn("Retrying Leaflet icon config", e);
    }

    if (mapRef.current && !mapInstance.current) {
      try {
        mapInstance.current = L.map(mapRef.current, {
          center: [26.58, 73.84], // Rajasthan center
          zoom: 7,
          minZoom: 6,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: " OpenStreetMap contributors",
        }).addTo(mapInstance.current);

        layerGroup.current = L.layerGroup().addTo(mapInstance.current);
      } catch (e) {
        console.error("Map initialization error:", e);
      }
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update map when selectedForest or predictionResult changes
  useEffect(() => {
    if (!mapInstance.current || !layerGroup.current) return;

    try {
      layerGroup.current.clearLayers();

      if (selectedForest) {
        // Determine view behavior
        if (selectedForest.boundary) {
          // Will handle view in boundary section
        } else {
          // Fly to the selected forest center if no boundary
          mapInstance.current.flyTo(
            [selectedForest.coordinates.lat, selectedForest.coordinates.lng],
            11,
            { duration: 1.5 }
          );
        }

        // Draw Main Forest Marker
        try {
           L.marker([selectedForest.coordinates.lat, selectedForest.coordinates.lng])
            .bindPopup(`<b>${selectedForest.name}</b><br>${selectedForest.type}`)
            .addTo(layerGroup.current);
        } catch (markerError) {
           console.error("Error creating marker:", markerError);
        }

        // Draw Zones
        if (selectedForest.zones) {
          selectedForest.zones.forEach((zone) => {
            let color = "#3B82F6"; // Default Blue
            let fillOpacity = 0.2;
            let riskText = "Risk assessment needed";

            // If we have prediction results, color code the zones
            if (predictionResult && predictionResult.zoneRisks) {
              const zoneRisk = predictionResult.zoneRisks.find(z => z.zoneId === zone.id);
              if (zoneRisk) {
                const probability = zoneRisk.probability;
                if (probability < 30) color = "#10B981"; // Green
                else if (probability < 50) color = "#F59E0B"; // Yellow
                else if (probability < 75) color = "#F97316"; // Orange
                else color = "#EF4444"; // Red
                
                fillOpacity = 0.5;
                riskText = `<b>${zoneRisk.riskLevel} Risk</b> (${probability}%)`;
              }
            }

            try {
              L.circle(zone.coordinates, {
                color: color,
                fillColor: color,
                fillOpacity: fillOpacity,
                radius: zone.radius,
                weight: 2
              })
              .bindTooltip(`<b>${zone.name}</b><br>${riskText}`, {
                permanent: false,
                direction: "top"
              })
              .addTo(layerGroup.current);
            } catch (circleError) {
              console.error("Error creating circle zone:", circleError);
            }
          });
        }

        // Draw Boundary Polygon if exists
        if (selectedForest.boundary) {
          try {
            const polygon = L.polygon(selectedForest.boundary, {
              color: "#16a34a", // Green-600
              weight: 3,
              fillColor: "#22c55e", // Green-500
              fillOpacity: 0.1,
              dashArray: "5, 10"
            }).addTo(layerGroup.current);

            // Adjust view to fit the boundary
             mapInstance.current.fitBounds(polygon.getBounds(), { padding: [50, 50] });
          } catch (polyError) {
             console.error("Error creating boundary polygon:", polyError);
             // Fallback to flyTo if polygon fails
             mapInstance.current.flyTo(
              [selectedForest.coordinates.lat, selectedForest.coordinates.lng],
              11
            );
          }
        }
      } else {
        // Reset view if no forest selected
        mapInstance.current.flyTo([26.58, 73.84], 7);
      }
    } catch (e) {
      console.error("Map update error:", e);
    }
  }, [selectedForest, predictionResult]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200 shadow-inner">
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default RajasthanFireMap;
