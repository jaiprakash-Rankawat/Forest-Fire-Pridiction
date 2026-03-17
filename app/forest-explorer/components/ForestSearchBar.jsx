"use client";

import { useState, useRef, useEffect } from "react";
import { INDIAN_FORESTS, FORESTS_BY_STATE } from "../../data/forests";

export default function ForestSearchBar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [filterType, setFilterType] = useState("All");

  const filteredByType = filterType === "All" 
    ? INDIAN_FORESTS 
    : INDIAN_FORESTS.filter(f => f.type === filterType);

  const filtered = query.trim().length === 0
    ? filteredByType
    : filteredByType.filter(
        (f) =>
          f.name.toLowerCase().includes(query.toLowerCase()) ||
          f.state.toLowerCase().includes(query.toLowerCase()) ||
          f.type.toLowerCase().includes(query.toLowerCase())
      );

  // Group filtered results by state
  const grouped = filtered.reduce((acc, f) => {
    if (!acc[f.state]) acc[f.state] = [];
    acc[f.state].push(f);
    return acc;
  }, {});

  const flatFiltered = Object.values(grouped).flat();

  const handleSelect = (forest) => {
    setQuery(forest.name);
    setIsOpen(false);
    setActiveIndex(-1);
    onSelect(forest);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") setIsOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      setActiveIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      handleSelect(flatFiltered[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        !inputRef.current?.contains(e.target) &&
        !dropdownRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const typeColors = {
    "National Park": "#16a34a",
    "Tiger Reserve": "#dc2626",
    "Wildlife Sanctuary": "#2563eb",
    "Biosphere Reserve": "#7c3aed",
  };

  const typeEmojis = {
    "National Park": "🌲",
    "Tiger Reserve": "🐯",
    "Wildlife Sanctuary": "🦁",
    "Biosphere Reserve": "🌿",
  };

  return (
    <div className="relative w-full max-w-2xl">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {["All", "National Park", "Tiger Reserve", "Wildlife Sanctuary", "Biosphere Reserve"].map(type => (
          <button
            key={type}
            onClick={() => {
              setFilterType(type);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filterType === type 
              ? "bg-green-500/20 border-green-500/50 text-green-400" 
              : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {type === "All" ? "🌍 All" : typeEmojis[type] + " " + type}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 text-lg">
          🔍
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search forests, national parks, tiger reserves..."
          className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/50 text-base outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setIsOpen(true); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors text-lg"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-[2000] max-h-80 overflow-y-auto"
        >
          {Object.keys(grouped).length === 0 ? (
            <div className="px-4 py-6 text-center text-white/50">
              No forests found for "{query}"
            </div>
          ) : (
            Object.entries(grouped).map(([state, forests]) => (
              <div key={state}>
                {/* State header */}
                <div className="px-4 py-2 bg-white/5 border-b border-white/10 sticky top-0">
                  <span className="text-xs font-bold uppercase tracking-widest text-green-400">
                    📍 {state}
                  </span>
                </div>

                {forests.map((forest) => {
                  const idx = flatFiltered.indexOf(forest);
                  const isActive = idx === activeIndex;
                  const color = typeColors[forest.type] || "#16a34a";
                  const emoji = typeEmojis[forest.type] || "🌲";

                  return (
                    <button
                      key={forest.id}
                      onClick={() => handleSelect(forest)}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                        isActive ? "bg-green-500/20" : "hover:bg-white/5"
                      }`}
                    >
                      <span className="text-lg mt-0.5">{emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm truncate">
                          {forest.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                            style={{ background: color + "30", color: color }}
                          >
                            {forest.type}
                          </span>
                          <span className="text-xs text-white/40 whitespace-nowrap">
                            {forest.area.toLocaleString()} km²
                          </span>
                          <span className="text-xs text-white/30 hidden sm:inline whitespace-nowrap">
                            • [{forest.lat.toFixed(4)}, {forest.lon.toFixed(4)}]
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}

          {/* Footer count */}
          <div className="px-4 py-2 border-t border-white/10 text-xs text-white/30 text-center">
            {flatFiltered.length} forest{flatFiltered.length !== 1 ? "s" : ""} found
            {!query && " — type to filter"}
          </div>
        </div>
      )}
    </div>
  );
}
