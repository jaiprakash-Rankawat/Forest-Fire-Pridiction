"use client";

import { useState } from "react";
import Image from "next/image";
import "./kumbhalgarh-story.css";

export default function KumbhalgarhStory() {
  const [lightboxImg, setLightboxImg] = useState(null);

  const openLightbox = (src) => setLightboxImg(src);
  const closeLightbox = () => setLightboxImg(null);

  return (
    <div className="ks-container">
      {/* 1. Introduction / Context */}
      <section className="ks-section ks-section--intro">
        <h2 className="ks-title">The Context: Why Kumbhalgarh?</h2>
        <p className="ks-text">
          When analyzing district-wise forest fire incidences over the last five
          years (2015-2019) in Rajasthan, a shocking statistic emerged: Udaipur
          recorded an unprecedented <strong>2,905 forest fire incidences</strong>
          —significantly higher than other districts.
        </p>

        <div className="ks-grid-2">
          <div className="ks-image-card">
            <img
              src="/images/Forest fire (2015 - 2019).png"
              alt="Forest fire incidences 2015-2019"
              className="ks-image ks-clickable-img"
              onClick={() => openLightbox("/images/Forest fire (2015 - 2019).png")}
            />
            <p className="ks-caption">
              District-wise forest fire incidences (2015 - 2019)
            </p>
          </div>
          <div className="ks-image-card">
            <img
              src="/images/pichart 2015-19.png"
              alt="Pie chart of fire incidences"
              className="ks-image ks-image-contain ks-clickable-img"
              onClick={() => openLightbox("/images/pichart 2015-19.png")}
            />
            <p className="ks-caption">
              Distribution of fire incidences across districts
            </p>
          </div>
        </div>

        <p className="ks-text-highlight">
          Due to this alarming concentration of fire events, our primary focus
          shifted to the most vulnerable region in this belt: the{" "}
          <strong>Kumbhalgarh Wildlife Sanctuary</strong>.
        </p>
      </section>

      {/* 2. Sanctuary Details */}
      <section className="ks-section ks-section--details">
        <div className="ks-split">
          <div className="ks-split-content">
            <h2 className="ks-title">Kumbhalgarh Wildlife Sanctuary</h2>
            <p className="ks-text">
              Located in the Rajsamand District of Rajasthan State in western
              India, it surrounds the historic Kumbhalgarh Fortress. The
              sanctuary covers an expansive area of{" "}
              <strong>610.528 km² (236 sq mi)</strong>.
            </p>
            <p className="ks-text">
              Extending across the Aravalli Range, it covers parts of Rajsamand,
              Udaipur, and Pali districts. The elevation ranges dramatically from
              500 to 1,300 metres (1,600 to 4,300 ft). Ecologically, it is a
              vital part of the <em>Khathiar-Gir dry deciduous forests</em>{" "}
              ecoregion, housing diverse flora and fauna that are highly
              susceptible to dry-season fires.
            </p>
          </div>
          <div className="ks-split-image">
            <img
              src="/images/Kumbhalgarh Wildlife Sanctuary.png"
              alt="Kumbhalgarh Wildlife Sanctuary Map"
              className="ks-image ks-image-glow ks-clickable-img"
              onClick={() => openLightbox("/images/Kumbhalgarh Wildlife Sanctuary.png")}
            />
          </div>
        </div>
      </section>

      {/* 2.5 Ecological Impact & Fire Drivers */}
      <section className="ks-section ks-section--impact">
        <h2 className="ks-title center">Ecological Impact & Fire Drivers</h2>
        <p className="ks-text center max-w">
          The Kumbhalgarh ecosystem is particularly vulnerable to devastating infernos due to a combination of climatic factors and anthropogenic (human-caused) drivers.
        </p>
        
        <div className="ks-grid-2" style={{ marginTop: "3rem" }}>
          <div className="ks-image-card" style={{ textAlign: "left", padding: "2rem" }}>
            <h3 className="ks-subtitle" style={{ color: "#fbbf24", display: "flex", gap: "0.5rem", alignItems: "center" }}><span>⚠️</span> Primary Catalysts</h3>
            <ul className="ks-text" style={{ listStyleType: "none", paddingLeft: "0", marginTop: "1rem" }}>
              <li style={{ marginBottom: "1rem", paddingLeft: "1.5rem", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#f97316" }}>•</span>
                <strong>Human Activities:</strong> Unextinguished campfires, discarded beedis/cigarettes, and agricultural clearing operations by forest-fringe communities represent the leading cause of unchecked fire spread.
              </li>
              <li style={{ marginBottom: "1rem", paddingLeft: "1.5rem", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#f97316" }}>•</span>
                <strong>Climatic Conditions:</strong> Extended dry spells, scorching temperatures, and incredibly low humidity from March to June create explosive flammable conditions.
              </li>
              <li style={{ paddingLeft: "1.5rem", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#f97316" }}>•</span>
                <strong>Dry Deciduous Fuel:</strong> The shedding of the native <em>Anogeissus pendula</em> (Dhok) tree leaves blankets the forest floor in highly combustible organic matter.
              </li>
            </ul>
          </div>
          
          <div className="ks-image-card" style={{ textAlign: "left", padding: "2rem" }}>
            <h3 className="ks-subtitle" style={{ color: "#f87171", display: "flex", gap: "0.5rem", alignItems: "center" }}><span>🦊</span> High-Risk Biodiversity</h3>
            <ul className="ks-text" style={{ listStyleType: "none", paddingLeft: "0", marginTop: "1rem" }}>
              <li style={{ marginBottom: "1rem", paddingLeft: "1.5rem", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#ef4444" }}>•</span>
                <strong>Fauna at Risk:</strong> Immediate habitat destruction displaces major predators like Indian Leopards, Sloth Bears, and Indian Wolves, sparking human-wildlife conflicts as they flee the core zones.
              </li>
              <li style={{ marginBottom: "1rem", paddingLeft: "1.5rem", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#ef4444" }}>•</span>
                <strong>Flora Devastation:</strong> Extreme heat permanently destroys seedlings and young saplings, preventing forest regeneration.
              </li>
              <li style={{ paddingLeft: "1.5rem", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#ef4444" }}>•</span>
                <strong>Ecosystem Shifts:</strong> The destruction of native trees enables the aggressive invasion of fire-resistant alien weeds such as <em>Lantana camara</em>, disrupting the entire local food chain.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Historical Data & Map Points */}
      <section className="ks-section ks-section--history">
        <h2 className="ks-title center">Historical Fire Mapping</h2>
        <p className="ks-text center max-w">
          By charting historical data onto the sanctuary&apos;s map, we can
          precisely isolate fire origin points. This allows us to recognize
          geospatial patterns and historically prone corridors.
        </p>

        <div className="ks-spotlight-image">
          <img
            src="/images/Fire points on map.png"
            alt="Fire points on map"
            className="ks-image ks-image-border ks-clickable-img"
            onClick={() => openLightbox("/images/Fire points on map.png")}
          />
          <p className="ks-caption center">
            Detected fire points mapped to exact geographical coordinates
          </p>
        </div>

        <h3 className="ks-subtitle center mt-big">
          Year-over-Year Progression (2015 - 2018)
        </h3>
        <p className="ks-text center max-w mb-big">
          Tracking the evolution of fire events across consecutive years highlights
          the escalating severity and recurring hotspots within the sanctuary.
        </p>

        <div className="ks-grid-2">
          <div className="ks-image-card">
            <img 
              src="/images/2015 Fire case.png" 
              alt="2015 Fire Case" 
              className="ks-image ks-clickable-img" 
              onClick={() => openLightbox("/images/2015 Fire case.png")} 
            />
            <p className="ks-caption">2015 Fire Incidents</p>
          </div>
          <div className="ks-image-card">
            <img 
              src="/images/2016 fire cash.png" 
              alt="2016 Fire Case" 
              className="ks-image ks-clickable-img" 
              onClick={() => openLightbox("/images/2016 fire cash.png")} 
            />
            <p className="ks-caption">2016 Fire Incidents</p>
          </div>
          <div className="ks-image-card">
            <img 
              src="/images/2017 fire cash.png" 
              alt="2017 Fire Case" 
              className="ks-image ks-clickable-img" 
              onClick={() => openLightbox("/images/2017 fire cash.png")} 
            />
            <p className="ks-caption">2017 Fire Incidents</p>
          </div>
          <div className="ks-image-card">
            <img 
              src="/images/2018 fire cash.png" 
              alt="2018 Fire Case" 
              className="ks-image ks-clickable-img" 
              onClick={() => openLightbox("/images/2018 fire cash.png")} 
            />
            <p className="ks-caption">2018 Fire Incidents</p>
          </div>
        </div>
      </section>

      {/* 4. Risk Zone Analysis */}
      <section className="ks-section ks-section--analysis">
        <div className="ks-section-header-wrap">
          <h2 className="ks-title">Risk Zone Analysis</h2>
          <p className="ks-text">
            According to recent environmental analyses, Rajasthan is divided into
            four distinct fire risk zones based on vegetative cover, climate, and
            historical incidence.
          </p>
        </div>

        <div className="ks-analysis-layout">
          {/* Step 1 & 2 */}
          <div className="ks-analysis-row">
            <div className="ks-analysis-text">
              <div className="ks-phase-header">
                <div className="ks-phase-number">01</div>
                <div className="ks-phase-info">
                  <span className="ks-phase-label">Strategic Mapping</span>
                  <h3 className="ks-phase-title">Statewide Risk Zoning</h3>
                </div>
              </div>
              <p>
                The state is divided into 4 risk zones based on fuel density and history. 
                Our focus narrows specifically to <strong>Zone 1</strong>, identified 
                as the most critical high-risk corridor in Rajasthan.
              </p>
            </div>
            <div className="ks-grid-2">
              <img 
                src="/images/Risk zones.png" 
                alt="4 Risk Zones" 
                className="ks-image ks-zoom ks-clickable-img" 
                onClick={() => openLightbox("/images/Risk zones.png")} 
              />
              <img 
                src="/images/Zone 1.png" 
                alt="Zone 1 Isolation" 
                className="ks-image ks-zoom ks-clickable-img" 
                onClick={() => openLightbox("/images/Zone 1.png")} 
              />
            </div>
          </div>

          <div className="ks-divider"></div>

          {/* Step 3 & 4 */}
          <div className="ks-analysis-row reverse">
            <div className="ks-grid-2">
              <img 
                src="/images/Zone1 forest area.png" 
                alt="Forests in Zone 1" 
                className="ks-image ks-zoom ks-clickable-img" 
                onClick={() => openLightbox("/images/Zone1 forest area.png")} 
              />
              <img 
                src="/images/forest fire in zone 1.png" 
                alt="Fires in Zone 1" 
                className="ks-image ks-zoom ks-clickable-img" 
                onClick={() => openLightbox("/images/forest fire in zone 1.png")} 
              />
            </div>
            <div className="ks-analysis-text">
              <div className="ks-phase-header">
                <div className="ks-phase-number">02</div>
                <div className="ks-phase-info">
                  <span className="ks-phase-label">Spatial Intelligence</span>
                  <h3 className="ks-phase-title">Forest Isolation & Fire Overlay</h3>
                </div>
              </div>
              <p>
                By isolating the exact forest boundaries within High-Risk Zone 1, 
                we overlay historical fire clusters. This reveals the alarming 
                density of incidents occurring within the protected green cover.
              </p>
            </div>
          </div>

          <div className="ks-divider"></div>

          {/* Step 5 */}
          <div className="ks-analysis-row center-col">
            <div className="ks-analysis-text center">
              <div className="ks-phase-header centered-header">
                <div className="ks-phase-number">03</div>
                <div className="ks-phase-info">
                  <span className="ks-phase-label">Bio-Classification</span>
                  <h3 className="ks-phase-title">Forest Topology Classification</h3>
                </div>
              </div>
              <p className="max-w">
                Finally, we categorize the forest types within the affected areas. 
                Understanding the local vegetation structure is critical for 
                predicting fuel loads and fire propagation speeds.
              </p>
            </div>
            <div className="ks-spotlight-image medium">
              <img 
                src="/images/type of forest.png" 
                alt="Types of Forest" 
                className="ks-image ks-image-border ks-zoom ks-clickable-img" 
                onClick={() => openLightbox("/images/type of forest.png")} 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* 5. Conclusion/Call to action */}
      <section className="ks-section ks-section--footer">
        <div className="ks-footer-content">
          <h2 className="ks-title center">Interactive Monitoring System</h2>
          <p className="ks-text center">
            With the context established, you can now use the search tool below
            to enter the interactive monitoring dashboard. Track live anomalies, 
            explore risk zones, and view the latest fire boundaries in real-time.
          </p>
        </div>
      </section>

      {/* Lightbox Overlay */}
      {lightboxImg && (
        <div className="ks-lightbox-overlay" onClick={closeLightbox}>
          <div className="ks-lightbox-hint">Click anywhere to minimize</div>
          <div className="ks-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="ks-lightbox-close" onClick={closeLightbox}>
              &times;
            </button>
            <img src={lightboxImg} alt="Enlarged view" className="ks-lightbox-image" />
          </div>
        </div>
      )}
    </div>
  );
}
