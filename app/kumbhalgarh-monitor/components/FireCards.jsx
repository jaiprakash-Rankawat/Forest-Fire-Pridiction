"use client";

export default function FireCards({ fires, onCardClick, activeFireId }) {
  if (!fires || fires.length === 0) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="km-fire-cards-section">
      <div className="km-section-header">
        <h2 className="km-section-title">
          <span className="km-fire-emoji">🔥</span>
          Last 3 Forest Fire Events
        </h2>
        <p className="km-section-subtitle">
          Recent fire incidents recorded in and around Kumbhalgarh Wildlife
          Sanctuary
        </p>
      </div>

      <div className="km-cards-grid">
        {fires.map((fire, index) => (
          <div
            key={fire.id}
            className={`km-fire-card ${
              activeFireId === fire.id ? "km-fire-card--active" : ""
            }`}
            style={{ animationDelay: `${index * 150}ms` }}
            onClick={() => onCardClick && onCardClick(fire)}
          >
            <div className="km-card-image-wrap">
              <img
                src={fire.image}
                alt={fire.title}
                className="km-card-image"
                loading="lazy"
              />
              <div className="km-card-date-badge">
                {formatDate(fire.date)}
              </div>
            </div>

            <div className="km-card-body">
              <h3 className="km-card-title">{fire.title}</h3>
              <p className="km-card-desc">{fire.description}</p>

              <div className="km-card-meta">
                <div className="km-card-meta-item">
                  <svg
                    className="km-meta-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>
                    {fire.lat.toFixed(4)}°N, {fire.lng.toFixed(4)}°E
                  </span>
                </div>
                <div className="km-card-meta-item">
                  <svg
                    className="km-meta-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  <span>{fire.area_burned_ha} ha burned</span>
                </div>
              </div>
            </div>

            <div className="km-card-footer">
              <button className="km-card-locate-btn">
                📍 Locate on Map
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
