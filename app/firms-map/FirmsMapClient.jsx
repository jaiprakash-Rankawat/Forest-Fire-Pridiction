"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Papa from "papaparse";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import "./firms.css";

export default function FirmsMapClient() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layerGroupRef = useRef(null);
  
  const [boundary, setBoundary] = useState(null);
  const [firmsData, setFirmsData] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Boundary and CSV Data
  useEffect(() => {
    async function loadResources() {
      try {
        // Load GeoJSON
        const geoRes = await fetch("/kumbhalgarh_boundary.geojson");
        const geoData = await geoRes.json();
        setBoundary(geoData);

        // Load CSV
        const csvRes = await fetch("/nasa_firms_data.csv");
        const csvText = await csvRes.text();
        
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = results.data;
            const polyFeature = geoData.features[0]; // Assuming first feature is the boundary polygon
            
            // Filter using turf
            const filteredFires = parsedData.filter(d => {
              if (!d.latitude || !d.longitude) return false;
              const pt = point([d.longitude, d.latitude]);
              // point-in-polygon check
              return booleanPointInPolygon(pt, polyFeature);
            });

            // Extract unique years
            const years = Array.from(new Set(
              filteredFires.map(d => new Date(d.acq_date).getFullYear())
            )).sort();
            
            setFirmsData(filteredFires);
            setYearList(years);
            
            if (years.length > 0) {
                // Default to latest year
                setSelectedYear(years[years.length - 1]);
            }
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Failed to load map resources:", error);
        setLoading(false);
      }
    }
    loadResources();
  }, []);

  // 2. Initialize Leaflet Map
  useEffect(() => {
    if (mapInstance.current || typeof window === "undefined") return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      const map = L.map(mapRef.current, {
        center: [25.10, 73.58], // general kumbhalgarh center
        zoom: 11,
        zoomControl: false // custom position maybe or just hide for sleek look
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Dark theme map (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      mapInstance.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
      setMapReady(true);
    };

    initMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // 3. Draw Boundary Map with Animation
  useEffect(() => {
    if (!mapReady || !boundary || !mapInstance.current) return;
    const map = mapInstance.current;
    
    // Check if Leaflet is attached to window
    const L = window.L;
    if (!L) return;

    const boundaryLayer = L.geoJSON(boundary, {
      style: {
        color: "#22c55e", 
        weight: 3,
        fillColor: "#16a34a",
        fillOpacity: 0.1,
        className: "km-boundary-path",
      },
    }).addTo(map);

    // Fit map precisely to the boundary edges
    map.fitBounds(boundaryLayer.getBounds(), { padding: [40, 40] });

    // CSS Animation via path dash-array manipulation
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
            
            // Reflow
            svgPath.getBoundingClientRect();
            
            svgPath.style.transition = "stroke-dashoffset 3s ease-in-out";
            svgPath.style.strokeDashoffset = "0";
          }
        });
      }
    }, 400);

  }, [mapReady, boundary]);


  // 4. Draw filtered points by year
  useEffect(() => {
    if (!mapReady || !selectedYear || !mapInstance.current || !layerGroupRef.current) return;
    const L = window.L;
    if (!L) return;

    const layerGrp = layerGroupRef.current;
    layerGrp.clearLayers();

    const activeFires = firmsData.filter(d => new Date(d.acq_date).getFullYear() === selectedYear);

    activeFires.forEach(fire => {
      const marker = L.circleMarker([fire.latitude, fire.longitude], {
        radius: 8,
        fillColor: "#ef4444",
        color: "#991b1b",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
        className: "fire-marker-pulse"
      });

      const dateStr = new Date(fire.acq_date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
      
      marker.bindPopup(`
        <div class="firms-popup">
          <h4>🛰️ NASA FIRMS Heat Signature</h4>
          <p><strong>Date:</strong> ${dateStr}</p>
          <p><strong>Brightness:</strong> ${fire.brightness} K</p>
          <p><strong>Lat/Lng:</strong> ${fire.latitude.toFixed(4)}, ${fire.longitude.toFixed(4)}</p>
        </div>
      `);

      marker.addTo(layerGrp);
    });

  }, [mapReady, selectedYear, firmsData]);

  // Derived stats
  const activeCount = useMemo(() => {
    if (!selectedYear) return 0;
    return firmsData.filter(d => new Date(d.acq_date).getFullYear() === selectedYear).length;
  }, [selectedYear, firmsData]);

  return (
    <div className="firms-map-wrapper">
      <div ref={mapRef} className="firms-map-container" />
      
      {/* Dynamic Overlay Panel */}
      <div className="firms-overlay-panel">
        <h3>🔥 FIRMS Boundary Analysis</h3>
        
        {loading ? (
           <p className="text-slate-400 text-sm">Loading map data...</p>
        ) : (
          <>
            <div className="stat-row">
              <span className="stat-label">Sanctuary</span>
              <span className="stat-value text-green-400">Kumbhalgarh Wildlife</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Total Fire Captures</span>
              <span className="stat-value">{firmsData.length}</span>
            </div>
            
            <div className="timeline-container">
              <div className="timeline-label">
                <span>Year Selection</span>
                <span className="text-blue-400 font-bold">{selectedYear}</span>
              </div>
              
              {yearList.length > 0 && (
                <input 
                  type="range" 
                  min={yearList[0]} 
                  max={yearList[yearList.length - 1]} 
                  value={selectedYear || yearList[0]}
                  step="1"
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="timeline-slider"
                />
              )}
              
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>{yearList[0]}</span>
                <span>{yearList[yearList.length - 1]}</span>
              </div>
              
              <div className="stat-row mt-4 pt-4 border-t border-slate-700/50">
                <span className="stat-label">Fires in {selectedYear}</span>
                <span className="stat-value text-red-500">{activeCount} Events</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
