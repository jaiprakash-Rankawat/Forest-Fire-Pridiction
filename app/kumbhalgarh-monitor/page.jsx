"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import SearchBar from "./components/SearchBar";
import FireCards from "./components/FireCards";
import KumbhalgarhStory from "./components/KumbhalgarhStory";
import "./kumbhalgarh.css";

// Dynamic import for Leaflet map (no SSR)
const KumbhalgarhMap = dynamic(
  () => import("./components/KumbhalgarhMap"),
  {
    ssr: false,
    loading: () => (
      <div className="km-loading">
        <div className="km-loading-spinner" />
        <p>Loading map...</p>
      </div>
    ),
  }
);

export default function KumbhalgarhMonitorPage() {
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [boundary, setBoundary] = useState(null);
  const [fires, setFires] = useState([]);
  const [riskZones, setRiskZones] = useState(null);
  const [activeFireId, setActiveFireId] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      const [boundaryRes, firesRes, zonesRes] = await Promise.all([
        fetch("/api/forest-boundary"),
        fetch("/api/last-fires"),
        fetch("/api/risk-zones"),
      ]);

      if (!boundaryRes.ok || !firesRes.ok || !zonesRes.ok) {
        throw new Error("Failed to fetch data from API");
      }

      const [boundaryData, firesData, zonesData] = await Promise.all([
        boundaryRes.json(),
        firesRes.json(),
        zonesRes.json(),
      ]);

      setBoundary(boundaryData);
      setFires(firesData);
      setRiskZones(zonesData);
      setSearched(true);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load sanctuary data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCardClick = useCallback((fire) => {
    setActiveFireId((prev) => (prev === fire.id ? null : fire.id));
  }, []);

  const handleFireSelect = useCallback((fire) => {
    setActiveFireId(fire.id);
  }, []);

  return (
    <div className="km-page">
      {/* Hero */}
      <header className="km-hero">
        <h1 className="km-hero-title">
          🌲 Forest Fire Monitoring System
        </h1>
        <p className="km-hero-subtitle">
          Real-time fire tracking, risk analysis, and event history for
          wildlife sanctuaries across India
        </p>
      </header>

      <div className="km-content">
        {/* Search */}
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "0.75rem",
              padding: "1rem",
              color: "#fca5a5",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Map + Cards */}
        {searched && !error && (
          <>
            <KumbhalgarhMap
              boundary={boundary}
              fires={fires}
              riskZones={riskZones}
              activeFireId={activeFireId}
              onFireSelect={handleFireSelect}
            />

            <FireCards
              fires={fires}
              onCardClick={handleCardClick}
              activeFireId={activeFireId}
            />
          </>
        )}

        {/* Pre-search story */}
        {!searched && !isLoading && (
          <KumbhalgarhStory />
        )}
      </div>
    </div>
  );
}
