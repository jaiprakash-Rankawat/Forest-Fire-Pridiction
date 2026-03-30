"use client";

import { useState } from "react";

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleQuickFill = () => {
    setQuery("Kumbhalgarh Wildlife Sanctuary");
  };

  return (
    <div className="km-search-container">
      <div className="km-search-inner">
        <div className="km-search-icon-wrap">
          <svg
            className="km-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>

        <form onSubmit={handleSubmit} className="km-search-form">
          <input
            id="km-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Try "Kumbhalgarh Wildlife Sanctuary"'
            className="km-search-input"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="km-search-btn"
          >
            {isLoading ? (
              <span className="km-spinner" />
            ) : (
              <>
                <svg
                  className="km-btn-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                Search
              </>
            )}
          </button>
        </form>

        <button
          type="button"
          onClick={handleQuickFill}
          className="km-quick-fill"
        >
          🏔️ Kumbhalgarh Wildlife Sanctuary
        </button>
      </div>
    </div>
  );
}
