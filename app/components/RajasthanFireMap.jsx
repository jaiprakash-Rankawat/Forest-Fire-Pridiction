"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Next.js

const RajasthanFireMap = ({
  selectedForest,
  predictionResult,
  highlightedZoneKey,
}) => {
  // Determine if we have prediction data
  const hasPredictionData =
    predictionResult &&
    predictionResult.highRiskZones &&
    predictionResult.highRiskZones.length > 0;
  const hasCurrentRiskZones =
    predictionResult &&
    predictionResult.currentRiskZones &&
    predictionResult.currentRiskZones.length > 0;
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layerGroup = useRef(null);
  const highlightLayer = useRef(null);

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
        highlightLayer.current = L.layerGroup().addTo(mapInstance.current);
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
      console.log("Updating map with forest:", selectedForest?.name);
      console.log("Prediction result:", predictionResult);

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
          L.marker([
            selectedForest.coordinates.lat,
            selectedForest.coordinates.lng,
          ])
            .bindPopup(
              `<b>${selectedForest.name}</b><br>${selectedForest.type}`
            )
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
            let className = "";

            // If we have prediction results, color code the zones
            if (predictionResult && predictionResult.zoneRisks) {
              const zoneRisk = predictionResult.zoneRisks.find(
                (z) => z.zoneId === zone.id
              );
              if (zoneRisk) {
                const probability = zoneRisk.probability;
                if (probability < 35) {
                  color = "#10B981"; // Green (Low)
                } else if (probability < 60) {
                  color = "#F59E0B"; // Yellow/Orange (Moderate)
                } else {
                  color = "#FF3300"; // Bright Red/Orange (Fire Color)
                  className = "high-risk-pulse"; // Add pulsating effect
                }

                // Increase opacity for high risk to make it look "dangerous"
                if (className) fillOpacity = 0.7;
                else fillOpacity = 0.5;

                riskText = `<b>${zoneRisk.riskLevel} Risk</b> (${probability}%)`;
              }
            }

            try {
              L.circle(zone.coordinates, {
                color: color,
                fillColor: color,
                fillOpacity: fillOpacity,
                radius: zone.radius,
                weight: 2,
                className: className,
              })
                .bindTooltip(`<b>${zone.name}</b><br>${riskText}`, {
                  permanent: false,
                  direction: "top",
                })
                .addTo(layerGroup.current);
            } catch (circleError) {
              console.error("Error creating circle zone:", circleError);
            }
          });

          // Draw Current Risk Zones
          if (hasCurrentRiskZones) {
            predictionResult.currentRiskZones.forEach((zone) => {
              try {
                // Create a semi-transparent red circle for current high-risk zones
                L.circle(zone.coordinates, {
                  color: "#DC2626", // Red-600
                  fillColor: "#F87171", // Red-400
                  fillOpacity: 0.4,
                  radius: zone.radius || 1000, // Default 1km radius if not specified
                  weight: 2,
                  className: "current-risk-zone",
                  pane: "overlayPane", // Place below markers but above other layers
                })
                  .bindTooltip(
                    `<div class="text-center">
                      <div class="font-bold text-red-800">🚨 CURRENT HIGH RISK</div>
                      <div class="font-semibold mt-1">${zone.zoneName}</div>
                      <div class="text-xs text-red-700 mt-1">${
                        zone.riskLevel
                      } Risk (${zone.probability}%)</div>
                      <div class="text-xs text-gray-600 mt-1">Detected: ${new Date().toLocaleString()}</div>
                    </div>`,
                    {
                      permanent: false,
                      direction: "top",
                      className: "current-risk-tooltip",
                    }
                  )
                  .addTo(layerGroup.current);

                // Add a smaller inner circle for better visibility
                L.circle(zone.coordinates, {
                  radius: 200, // Smaller radius for inner circle
                  color: "#DC2626",
                  fillColor: "#DC2626",
                  fillOpacity: 0.8,
                  weight: 1,
                  className: "current-risk-zone-inner",
                }).addTo(layerGroup.current);
              } catch (error) {
                console.error("Error drawing current risk zone:", error);
              }
            });
          }

          // Draw Predicted High-Risk Zones
          if (hasPredictionData) {
            console.log(
              "Processing high risk zones:",
              predictionResult.highRiskZones
            );

            predictionResult.highRiskZones.forEach((zone) => {
              try {
                // Find the zone in the forest's zones to get coordinates
                const forestZone = selectedForest.zones.find(
                  (z) => z.id === zone.zoneId || z.name === zone.zoneName
                );

                if (!forestZone || !forestZone.coordinates) {
                  console.warn(
                    `Could not find coordinates for zone: ${
                      zone.zoneName || zone.zoneId
                    }`
                  );
                  return;
                }

                // Create a pulsing red marker for predicted high-risk zones
                const icon = L.divIcon({
                  html: `
                    <div class="predicted-risk-marker">
                      <div class="pulse-ring"></div>
                      <div class="pulse-dot">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.324-.424-.63-1.037-.94-1.829-.25-.8-.478-1.776-.606-2.757-.062-.463-.116-.98-.136-1.494a.993.993 0 00-.117-.517 1 1 0 00-.415-.403z" clip-rule="evenodd" />
                          <path d="M5 11a5 5 0 1110 0 1 1 0 102 0 7 7 0 10-11.95 4.95 1 1 0 001.415 0A6.965 6.965 0 0110 11a1 1 0 100 2 5 5 0 01-5 5 1 1 0 100 2 7 7 0 100-14z" />
                        </svg>
                      </div>
                    </div>
                  `,
                  className: "",
                  iconSize: [40, 40],
                  iconAnchor: [20, 40],
                  popupAnchor: [0, -40],
                });

                const marker = L.marker(forestZone.coordinates, {
                  icon,
                  zIndexOffset: 1000,
                  title: zone.zoneName || "High Risk Zone",
                })
                  .bindTooltip(
                    `<div class="text-center min-w-[180px] p-2">
                    <div class="font-bold text-red-800">⚠️ PREDICTED HIGH RISK</div>
                    <div class="font-semibold mt-1">${
                      zone.zoneName || "High Risk Zone"
                    }</div>
                    <div class="text-xs text-red-700 mt-1">${
                      zone.riskLevel
                    } Risk (${zone.probability}%)</div>
                    <div class="text-xs text-gray-600 mt-1">Predicted for: Next 48 hours</div>
                    ${
                      zone.specificRisk
                        ? `<div class="text-xs text-gray-600">${zone.specificRisk}</div>`
                        : ""
                    }
                  </div>`,
                    {
                      permanent: false,
                      direction: "top",
                      className: "predicted-risk-tooltip",
                      offset: [0, -10],
                    }
                  )
                  .addTo(layerGroup.current);

                console.log(
                  `Added high risk marker for ${zone.zoneName} at`,
                  forestZone.coordinates
                );
              } catch (error) {
                console.error(
                  `Error drawing predicted risk zone ${
                    zone.zoneName || zone.zoneId
                  }:`,
                  error
                );
              }
            });
          } else {
            console.log("ℹ️ No high-risk zones to display");
          }
        }

        // Draw Boundary Polygon if exists
        if (selectedForest.boundary) {
          try {
            // Draw forest boundary with more prominent styling
            const polygon = L.polygon(selectedForest.boundary, {
              color: "#166534", // Darker green for better contrast
              weight: 2.5,
              fillColor: "#16a34a", // Green-600
              fillOpacity: 0.2,
              dashArray: "8, 5",
              className: "forest-boundary",
            })
              .bindTooltip(
                `<div class="text-center">
                  <div class="font-bold text-sm">${selectedForest.name}</div>
                  <div class="text-xs text-gray-600">${selectedForest.type}</div>
                  <div class="text-xs text-blue-600 mt-1">${selectedForest.area}</div>
                </div>`,
                {
                  permanent: false,
                  direction: "center",
                  className: "forest-boundary-tooltip",
                }
              )
              .addTo(layerGroup.current);

            // Adjust view to fit the boundary
            mapInstance.current.fitBounds(polygon.getBounds(), {
              padding: [50, 50],
            });
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

  useEffect(() => {
    if (!mapInstance.current || !highlightLayer.current) return;

    highlightLayer.current.clearLayers();

    if (!selectedForest || !selectedForest.zones || !highlightedZoneKey) return;

    const zoneToHighlight = selectedForest.zones.find(
      (z) => z.id === highlightedZoneKey || z.name === highlightedZoneKey
    );

    if (!zoneToHighlight || !zoneToHighlight.coordinates) return;

    try {
      const outer = L.circle(zoneToHighlight.coordinates, {
        color: "#DC2626",
        fillColor: "#DC2626",
        fillOpacity: 0.15,
        radius: 900,
        weight: 4,
        className: "highlight-zone",
      }).addTo(highlightLayer.current);

      const inner = L.circle(zoneToHighlight.coordinates, {
        color: "#DC2626",
        fillColor: "#DC2626",
        fillOpacity: 0.6,
        radius: 180,
        weight: 2,
        className: "highlight-zone-inner",
      }).addTo(highlightLayer.current);

      outer.bringToFront();
      inner.bringToFront();

      mapInstance.current.flyTo(zoneToHighlight.coordinates, 13, {
        duration: 1.2,
      });
    } catch (e) {
      console.error("Error highlighting zone:", e);
    }
  }, [selectedForest, highlightedZoneKey]);

  // Add custom styles for map elements
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      /* Current Risk Zone Styles */
      .current-risk-zone {
        animation: fadeIn 1s ease-in;
      }

      .current-risk-zone-inner {
        animation: pulse 2s infinite;
      }

      .current-risk-tooltip {
        background: rgba(255, 255, 255, 0.98);
        border: 2px solid #DC2626;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 8px 12px;
        font-size: 13px;
      }

      .current-risk-tooltip:before {
        border-top-color: #DC2626 !important;
      }

      /* Predicted Risk Marker Styles */
      .predicted-risk-marker {
        position: relative;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .pulse-ring {
        content: "";
        width: 40px;
        height: 40px;
        background: rgba(220, 38, 38, 0.5);
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: 0;
        animation: pulsate 2s ease-out infinite;
        opacity: 0.5;
      }

      .pulse-dot {
        width: 24px;
        height: 24px;
        background: #DC2626;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        position: relative;
        z-index: 10;
        border: 2px solid white;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
      }

      .predicted-risk-tooltip {
        background: rgba(255, 255, 255, 0.98);
        border: 2px solid #F59E0B;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 10px 14px;
        font-size: 13px;
      }

      .predicted-risk-tooltip:before {
        border-top-color: #F59E0B !important;
      }

      /* Animations */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes pulsate {
        0% { transform: scale(0.8); opacity: 0.5; }
        70% { transform: scale(1.3); opacity: 0; }
        100% { opacity: 0; }
      }

      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 0.8; }
      }

      .highlight-zone {
        animation: highlightPulse 1.6s ease-in-out infinite;
      }

      .highlight-zone-inner {
        animation: highlightPulse 1.2s ease-in-out infinite;
      }

      @keyframes highlightPulse {
        0% { opacity: 0.55; }
        50% { opacity: 1; }
        100% { opacity: 0.55; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200 shadow-inner relative">
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
      <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-gray-700 z-[1000] pointer-events-none border border-gray-200 shadow-lg">
        <div className="font-semibold mb-1.5 text-gray-800 border-b pb-1">
          Map Legend
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-600 mr-2 border border-white flex-shrink-0"></span>
            <span className="whitespace-nowrap">Forest Boundary</span>
          </div>
          <div className="flex items-center">
            <div className="relative w-3 h-3 mr-2 flex-shrink-0">
              <div className="absolute inset-0 bg-red-600 rounded-full opacity-70 animate-ping"></div>
              <div className="absolute inset-0.5 bg-red-600 rounded-full border border-white"></div>
            </div>
            <div className="flex flex-col">
              <span>Current High Risk</span>
              <span className="text-[10px] text-gray-500 -mt-0.5">
                Active fire detection
              </span>
            </div>
          </div>
          <div className="flex items-start">
            <div className="relative w-3 h-3 mr-2 mt-0.5 flex-shrink-0">
              <div className="absolute inset-0 bg-orange-500 rounded-full opacity-70 animate-ping"></div>
              <div className="absolute inset-0.5 bg-orange-500 rounded-full border border-white flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-2 w-2 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.324-.424-.63-1.037-.94-1.829-.25-.8-.478-1.776-.606-2.757-.062-.463-.116-.98-.136-1.494a.993.993 0 00-.117-.517 1 1 0 00-.415-.403z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span>Predicted Risk</span>
              <span className="text-[10px] text-gray-500 -mt-0.5">
                High fire probability
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RajasthanFireMap;
