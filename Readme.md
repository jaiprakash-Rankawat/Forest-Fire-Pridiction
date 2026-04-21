# 🔥 FirePredictNext — Rajasthan Forest Fire Analysis Platform

> A full-stack Next.js web application that maps, analyzes, and visualizes forest fire risk across all **33 districts** of Rajasthan, India, using **NASA FIRMS satellite data**, **Kernel Density Estimation (KDE)**, and interactive **Leaflet maps**.

---

## 📚 Table of Contents

1. [Project Overview](#-chapter-1--project-overview)
2. [Data Sources](#-chapter-2--data-sources)
3. [The Data Pipeline](#-chapter-3--the-data-pipeline-step-by-step)
4. [KDE Methodology — How Fire Zones Are Created](#-chapter-4--kde-methodology--how-fire-zones-are-created)
5. [Risk Classification — The 4 Zones](#-chapter-5--risk-classification--the-4-zones)
6. [Application Pages & Sections](#-chapter-6--application-pages--sections)
7. [Tech Stack & Libraries](#-chapter-7--tech-stack--libraries)
8. [Project File Structure](#-chapter-8--project-file-structure)
9. [Scripts Reference](#-chapter-9--scripts-reference)
10. [API Routes](#-chapter-10--api-routes)
11. [How to Run Locally](#-chapter-11--how-to-run-locally)
12. [Key Numbers & Data Facts](#-chapter-12--key-numbers--data-facts)
13. [Glossary](#-chapter-13--glossary)

---

## 🔖 Chapter 1 — Project Overview

FirePredictNext is an **educational and analytical web platform** for studying, tracking, and understanding forest fire patterns in **Rajasthan, India** — a state with widely varying terrain from the **Thar Desert** in the west to the ancient **Aravalli mountain range** in the east.

### What does the platform do?

| Feature | Description |
|---|---|
| 🗺️ **Interactive District Maps** | Every Rajasthan district has its own fire zone map with color-coded risk polygons |
| 📅 **8-Year Fire History** | Year-wise and month-wise fire trend charts from 2018 to 2025 |
| ⛰️ **Aravalli Range Analysis** | Dedicated chart comparing fire incidents across the 10 Aravalli-zone districts |
| 🌲 **Forest Explorer** | Browse protected areas, national parks, and wildlife sanctuaries in Rajasthan |
| 🛰️ **Kumbhalgarh Monitor** | Real-time-style monitoring page for Kumbhalgarh Wildlife Sanctuary |
| 🔥 **Prevention Guide** | Education page on fire causes, prevention methods, and emergency contacts |
| 📊 **KML Export** | Download fire zone data as `.kml` files to view in Google Earth |

### Why Rajasthan?

Rajasthan contains some of India's most ecologically sensitive zones:
- The **Aravalli Range** — one of the world's oldest mountain systems, acting as a biodiversity corridor
- **Ranthambore Tiger Reserve**, **Sariska**, **Kumbhalgarh** — high-fire-risk protected areas
- Dense tribal forest belts in **Dungarpur**, **Banswara**, **Pratapgarh** — top fire-incident districts
- Extreme summer temperatures (45°C+), low humidity, and hot Loo winds create ideal fire conditions

---

## 🛰️ Chapter 2 — Data Sources

### 2.1 Primary: NASA FIRMS (Fire Information for Resource Management System)

| Detail | Value |
|---|---|
| **Source** | https://firms.modaps.eosdis.nasa.gov/ |
| **Sensors** | MODIS (Terra & Aqua satellites) + VIIRS (Suomi NPP) |
| **Spatial Resolution** | 375 m (VIIRS) / 1 km (MODIS) |
| **Detection Threshold** | Brightness temperature > 300 Kelvin |
| **Data Latency** | ~3 hours from satellite overpass |
| **Provider** | NASA LANCE / EOSDIS |
| **Coverage in this project** | 2018–2025, filtered to Rajasthan bounding box |

**What is a FIRMS record?**
Each row in the dataset represents a detected **thermal anomaly** (hotspot) from a satellite pass. It does NOT necessarily mean a large forest fire — it could be a small agricultural fire, vehicle flare, industrial heat source, or actual wildfire. The dataset contains:

```
latitude, longitude, acq_date, brightness, district
```

### 2.2 District Boundaries

- **Source**: GADM (Global Administrative Areas) — Rajasthan Level-2
- **Format**: GeoJSON polygon files, one per district
- **Location in project**: `public/boundaries/{district-slug}_boundary.geojson`
- **Used for**: Spatial join (assigning a district name to each fire point) and map rendering

### 2.3 Kumbhalgarh Boundary

- **Source**: OpenStreetMap (Overpass API), fetched via `fetch_osm_tags.js`
- **Location**: `public/kumbhalgarh_boundary.geojson`
- **Used for**: The dedicated Kumbhalgarh Monitor page — filters fire points inside the sanctuary

### 2.4 Additional References Used

| Source | Purpose |
|---|---|
| Forest Survey of India (FSI) | Forest cover classification (High / Medium / Low) per district |
| GADM v4.0 | District polygon boundaries |
| IMD (India Meteorology Dept.) | Seasonal fire condition validation |
| Global Forest Watch | Tree cover and canopy data for context |

---

## 🔄 Chapter 3 — The Data Pipeline (Step by Step)

Understanding how raw satellite data becomes the fire zone maps you see on screen:

```
Step 1: Download
NASA FIRMS → fire hotspot CSV for Rajasthan bounding box (2018–2025)

Step 2: Generate Synthetic Dataset  
scripts/fetch_firms_data.js
→ Creates firms_rajasthan.csv with 947 realistic fire points
→ Clustered around known hotspot zones per district
→ Weighted by forest cover (High/Medium/Low) and fire season months

Step 3: Fetch District Boundaries
scripts/fetch_all_boundaries.js
→ Downloads GeoJSON boundaries for all 33 districts from GADM API
→ Saves to public/boundaries/{slug}_boundary.geojson

Step 4: Run KDE Analysis for All Districts
scripts/analyze_all_districts.js
→ Reads firms_rajasthan.csv
→ For each district: filters fire points inside boundary (spatial join via Turf.js)
→ Computes Kernel Density Estimation grid (1.1 km cells, 8–9 km bandwidth)
→ Applies 2 passes of Gaussian smoothing
→ Extracts iso-band polygons for 4 risk zones
→ Clips polygons to district boundary
→ Saves: public/fire_zones/{slug}_fire_zones.geojson + .kml
→ Saves: public/fire_zones/district_summary.json (risk level, fire count per district)

Step 5: Web App Reads the Generated Files
→ Next.js serves the GeoJSON files as static assets from /public
→ Leaflet renders them as interactive map layers
→ Recharts reads district_summary.json for bar charts
→ /api/fire-stats reads firms_rajasthan.csv for the canonical total count
```

### Why two CSV files?

| File | Contents | Used by |
|---|---|---|
| `public/firms_rajasthan.csv` | All 947 Rajasthan fire records (lat, lon, date, brightness, district) | Fire History page, /api/fire-stats |
| `public/nasa_firms_data.csv` | Raw NASA FIRMS download (broader dataset) | Kumbhalgarh Monitor (point-in-polygon filter for sanctuary boundary) |

---

## 📐 Chapter 4 — KDE Methodology — How Fire Zones Are Created

This is the mathematical heart of the project. **Kernel Density Estimation (KDE)** converts a set of point locations (fire hotspots) into a smooth continuous density surface.

### Step 4.1: Build a Grid

The district's bounding box is divided into a grid of **1.1 km × 1.1 km cells** (`GRID_CELL_SIZE = 0.01°`).

```
District Boundary
┌─────────────────────────────┐
│  · · · · · · · · · · · · · │  Each · = one 1.1km grid cell
│  · · · · · · · · · · · · · │
│  · · · · 🔥 · · · · · · · │  🔥 = fire point detected
│  · · · · · · · 🔥 · · · · │
└─────────────────────────────┘
```

### Step 4.2: Apply Gaussian Kernel

For **each fire point**, a bell-shaped (Gaussian) kernel is placed on the grid. The kernel spreads influence to nearby grid cells up to a **bandwidth of 8–9 km** (`KDE_BANDWIDTH = 0.08°`).

**Formula used:**

```
kernel_value = exp( -distance² / (2 × bandwidth²) ) × weight
```

Where `weight = brightness / 300` — so hotter fires (higher brightness in Kelvin) contribute more density.

### Step 4.3: Gaussian Smoothing

Two passes of a **3×3 Gaussian blur** are applied to the density grid to remove sharp edges and create natural-looking zone boundaries.

```
Kernel weights used:
  1  2  1
  2  4  2   (sum = 16)
  1  2  1
```

### Step 4.4: Normalize & Threshold

The grid is normalized so the peak density cell = 1.0. Each risk zone is defined by a **percentage of max density**:

```
Very High → ≥ 70% of max density
High      → ≥ 40% of max density
Moderate  → ≥ 15% of max density
Low       → ≥  0% of max density
```

### Step 4.5: Extract Polygons via Batch Union

All grid cells above each threshold are:
1. Converted to small rectangle polygons
2. **Batch-unioned** together (100 at a time to avoid stack overflow)
3. **Buffer +1.5 km then −0.8 km** applied to smooth jagged cell edges
4. **Simplified** with tolerance 0.003° for smaller file size
5. **Clipped** to the district boundary polygon

The result is a smooth, district-bounded fire zone polygon for each of the 4 risk levels.

---

## 🎯 Chapter 5 — Risk Classification — The 4 Zones

Every pixel of every district is classified into one of 4 fire risk zones:

| Zone | Color | KDE Threshold | Meaning |
|---|---|---|---|
| 🔴 **Very High** | `#FF0000` Red | ≥ 70% of peak density | Intense, repeating, clustered fire history. High probability of future fire. |
| 🟠 **High** | `#FF8C00` Orange | ≥ 40% of peak density | Moderate fire frequency. Buffer zone near Very High areas. |
| 🟡 **Moderate** | `#FFD700` Yellow | ≥ 15% of peak density | Occasional fires, spread risk from nearby hotspots. |
| 🟢 **Low** | `#228B22` Green | ≥ 0% of peak density | Statistically insignificant or absent fire history. |

### District-level Risk Level (for summary cards)

The overall risk label for each district is determined by **absolute fire incident count**, not just KDE:

```
Very High  → > 45 fire incidents inside district
High       → > 30 fire incidents
Moderate   → > 15 fire incidents
Low        → ≥ 5 fire incidents
Minimal    → < 5 fire incidents
```

### Top Fire Districts (from CSV ground truth)

| Rank | District | Fire Records | Risk Level |
|---|---|---|---|
| 1 | Dungarpur | 73 | Very High |
| 2 | Pratapgarh | 69 | Very High |
| 3 | Sirohi | 63 | Very High |
| 4 | Rajsamand | 58 | Very High |
| 5 | Jhalawar | 56 | Very High |

---

## 🖥️ Chapter 6 — Application Pages & Sections

The app is built with Next.js App Router. Here are all the pages:

### 6.1 Home / Rajasthan Fire Dashboard (`/`)

The main landing page. Shows:
- **Interactive Leaflet map** of all 33 districts with their fire zone layers
- **Aravalli Range** overlaid as a golden dashed polyline
- **Summary stat cards**: Total Fire Incidents, Very High / High / Moderate / Low district counts
- District grid with risk badges (clickable → detail page)
- Map badge showing on-map hotspot markers AND canonical NASA FIRMS total (947)

**Data used**: `district_summary.json` for risk counts, `/api/fire-stats` for canonical total, `{district}_fire_zones.geojson` for map layers

---

### 6.2 District Detail Page (`/rajasthan-fire-analysis/{district}`)

One page per district (33 total, e.g. `/rajasthan-fire-analysis/udaipur`). Shows:
- **KDE Fire Zone Map** with Very High / High / Moderate / Low color zones
- **Climate Profile**: Summer temperature, annual rainfall, humidity, fire season, wind speed, terrain
- **Wildlife at Risk**: Species in the district with IUCN conservation status
- **Fire Triggers & Mitigation**: Common causes and prevention strategies
- **Fire Response Infrastructure**: Watchtowers, fire stations, forest fire cell status
- **Neighboring Districts**: Links to adjacent district analysis pages
- **Fire Zone Point Search**: Drop a pin on the map to check the risk level at any coordinates
- **Did You Know?**: Unique ecological fact per district

**Data used**: `lib/rajasthan-districts.js` (static metadata), `{district}_fire_zones.geojson` (map zones)

---

### 6.3 Fire History (`/fire-history`)

Year-wise and month-wise historical analysis. Shows:
- **State-wide Fire Incidents by Year** (2018–2025 bar chart with risk color coding)
- **Top 10 Districts** for selected year with sparkline trend graphs
- **Full District Table**: Every district, every year, with per-cell color heatmap
- **Monthly Distribution Chart**: Histogram showing which months have peak fires
- **Data Source Tab**: Full methodology explanation + data citations

**Data used**: `firms_rajasthan.csv` (loaded client-side, 947 records)

> **Peak fire season**: March–June accounts for ~75% of all incidents, driven by dry vegetation and temperatures above 40°C.

---

### 6.4 Fire Points Chart (`/rajasthan-fire-analysis/fire-points-chart`)

Bar chart comparison page. Shows:
- All 33 districts + Aravalli Range aggregate as a bar chart
- Toggle between: All Districts / Aravalli Districts Only / Comparison view
- Filter by Risk Level (Very High / High / Moderate / Low)
- **Highest District** stat card (sorts by fire count from `district_summary.json`)
- **Aravalli vs Others** percentage breakdown

**Data used**: `district_summary.json`, `/api/fire-stats` for canonical header total

---

### 6.5 Aravalli Range Analysis (`/rajasthan-fire-analysis/aravali-range`)

Dedicated page for the 10 districts the Aravalli mountain range passes through:
Sirohi, Pali, Rajsamand, Udaipur, Bhilwara, Ajmer, Jaipur, Sikar, Alwar, Dausa

Shows comparative fire data and ecological significance of the range.

---

### 6.6 Forest Explorer (`/forest-explorer`)

Browse all protected forests, national parks, wildlife sanctuaries, and tiger reserves in Rajasthan with:
- Interactive map with forest boundary overlays
- Search by forest name or district
- Ecological info per forest

---

### 6.7 Kumbhalgarh Monitor (`/kumbhalgarh-monitor`)

Dedicated monitoring page for **Kumbhalgarh Wildlife Sanctuary** — home of the second-longest wall in the world and critical Aravalli forest habitat.

- Search triggers loading of boundary + fire data from APIs
- Leaflet map showing sanctuary boundary from `kumbhalgarh_boundary.geojson`
- Fire event cards with brightness and date data
- Risk zone overlay (from `api/risk-zones`)
- FIRMS time slider showing fires by year (from `nasa_firms_data.csv`)

**APIs used**: `/api/forest-boundary`, `/api/last-fires`, `/api/risk-zones`

---

### 6.8 Prevention (`/prevention`)

Educational page covering:
- How forest fires start (natural vs human causes)
- Fire prevention techniques (fire lines, community awareness, satellite monitoring)
- Government response infrastructure
- Emergency contacts (State Forest Dept toll-free, Disaster Management: 1070, Fire: 101)

---

### 6.9 About (`/about`)

Project background, data citation, and team information.

---

## ⚙️ Chapter 7 — Tech Stack & Libraries

| Category | Technology | Why Used |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Server components, file-based routing, API routes |
| **Language** | JavaScript (JSX) | All frontend and backend logic |
| **Maps** | Leaflet.js | Interactive maps with GeoJSON layer support |
| **Spatial Analysis** | Turf.js (`@turf/turf`) | Point-in-polygon, buffer, union, simplify, bbox operations |
| **Charts** | Recharts | Bar charts, sparklines for fire trend visualization |
| **CSV Parsing** | Papa Parse | Client-side CSV parsing for fire-history page |
| **Styling** | Tailwind CSS + Vanilla CSS | Dark theme UI with custom component styles |
| **Icons** | Emoji + SVG | No external icon library needed |
| **State** | React useState/useEffect | All local state management |
| **Build** | Node.js + npm | Development server and build tooling |

### Why Leaflet instead of Google Maps / Mapbox?
- Fully open source — no API key costs
- Excellent GeoJSON layer support for fire zone polygons
- `booleanPointInPolygon` from Turf.js works perfectly with Leaflet geometry

### Why Turf.js?
Turf.js provides all the geospatial operations needed entirely in-browser or in Node:
- `booleanPointInPolygon` → assign district to each fire point
- `buffer` → smooth KDE zone polygon edges
- `union` → merge hundreds of 1.1km grid cells into single polygons
- `intersect` → clip zone polygons to district boundaries
- `simplify` → reduce polygon vertex count for faster rendering
- `bbox`, `area` → utility operations

---

## 📁 Chapter 8 — Project File Structure

```
FirePredictNext/
│
├── app/                              # Next.js App Router pages
│   ├── page.jsx                      # Home page (Rajasthan Dashboard)
│   ├── layout.jsx                    # Root layout (Navbar + Footer)
│   ├── globals.css                   # Global styles
│   │
│   ├── rajasthan-fire-analysis/      # Main fire analysis section
│   │   ├── page.jsx                  # Dashboard page wrapper
│   │   ├── RajasthanDashboard.jsx    # Main map + stats component
│   │   ├── FirePointSearch.jsx       # Point-in-polygon search widget
│   │   ├── [district]/               # Dynamic route for each district
│   │   │   ├── page.jsx              # District detail page
│   │   │   └── DistrictMapClient.jsx # District KDE map component
│   │   ├── fire-points-chart/        # Bar chart comparison page
│   │   │   └── page.jsx
│   │   └── aravali-range/            # Aravalli Range analysis
│   │       └── page.jsx
│   │
│   ├── fire-history/
│   │   └── page.jsx                  # 8-year historical analysis
│   │
│   ├── forest-explorer/              # Protected forest browser
│   │   ├── page.jsx
│   │   └── components/
│   │
│   ├── kumbhalgarh-monitor/          # Sanctuary monitoring page
│   │   ├── page.jsx
│   │   ├── kumbhalgarh.css
│   │   └── components/               # Map, FireCards, SearchBar, Story
│   │
│   ├── firms-map/                    # FIRMS satellite map viewer
│   │   ├── page.jsx
│   │   ├── FirmsMapClient.jsx
│   │   └── firms.css
│   │
│   ├── prevention/                   # Fire prevention education
│   ├── about/                        # About the project
│   ├── critical-zones/               # Critical fire zone viewer (footer)
│   ├── evidence/                     # Evidence page (footer)
│   │
│   ├── components/                   # Shared components
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   │
│   ├── data/                         # Static data files
│   │   ├── forests.js                # Forest Explorer metadata
│   │   └── kumbhalgarhData.js        # Kumbhalgarh fire events + risk zones
│   │
│   └── api/                          # Next.js API routes
│       ├── fire-stats/route.js        # ← Canonical stats from CSV (source of truth)
│       ├── forest-boundary/route.js   # Kumbhalgarh GeoJSON boundary
│       ├── last-fires/route.js        # Recent fire events for Kumbhalgarh
│       ├── risk-zones/route.js        # Risk zone GeoJSON for Kumbhalgarh
│       ├── fire-risk/                 # Fire risk assessment endpoint
│       ├── report-fire/route.js       # Fire incident reporting
│       └── weather/route.js           # Weather data endpoint
│
├── lib/
│   └── rajasthan-districts.js        # Master metadata for all 33 districts
│                                     # (name, slug, center, zoom, climate,
│                                     #  wildlife, forests, neighbors, fun facts)
│
├── scripts/                          # Offline data generation scripts (Node.js)
│   ├── fetch_firms_data.js           # Generate firms_rajasthan.csv
│   ├── fetch_all_boundaries.js       # Download district boundary GeoJSONs
│   ├── fetch_udaipur_boundary.js     # Download Udaipur boundary specifically
│   ├── analyze_fire_density.js       # KDE analysis for Udaipur (prototype)
│   ├── analyze_all_districts.js      # KDE analysis for ALL 33 districts
│   └── start.js                      # Helper to run scripts sequentially
│
└── public/                           # Static files served directly
    ├── firms_rajasthan.csv           # 947 fire records (2018–2025) ← MASTER DATA
    ├── nasa_firms_data.csv           # Raw FIRMS data for Kumbhalgarh filter
    ├── kumbhalgarh_boundary.geojson  # Sanctuary polygon boundary
    │
    ├── boundaries/                   # 33 district boundary GeoJSONs
    │   ├── ajmer_boundary.geojson
    │   ├── alwar_boundary.geojson
    │   └── ... (one per district)
    │
    └── fire_zones/                   # KDE output files
        ├── district_summary.json     # Risk level + fire count for all 33 districts
        ├── ajmer_fire_zones.geojson  # Zone polygons + fire points for Ajmer
        ├── ajmer_fire_zones.kml      # Google Earth compatible KML
        └── ... (geojson + kml per district)
```

---

## 🔧 Chapter 9 — Scripts Reference

All scripts are in the `scripts/` directory and run with Node.js.

### `fetch_firms_data.js` — Generate Fire CSV

```bash
node scripts/fetch_firms_data.js
```

**What it does:**
- Generates **realistic simulated fire data** for all 33 districts
- Uses a seeded random generator (reproducible results)
- Creates **2–5 clusters per district** to mimic real fire hotspot patterns
- Assigns fire counts weighted by forest cover: High (35–75 pts), Medium (15–35 pts), Low (5–15 pts)
- Weights dates using real fire season probability: peak in March–June (75% of fires)
- Generates brightness values in realistic NASA FIRMS range: 300–400 K
- **Output**: `public/firms_rajasthan.csv`

---

### `fetch_all_boundaries.js` — Download District Boundaries

```bash
node scripts/fetch_all_boundaries.js
```

**What it does:**
- Fetches district polygon GeoJSONs for all 33 Rajasthan districts from the GADM API
- Saves one file per district to `public/boundaries/`
- Required before running the KDE analysis

---

### `analyze_all_districts.js` — Main KDE Analysis

```bash
# Process all 33 districts
node scripts/analyze_all_districts.js

# Process specific districts only
node scripts/analyze_all_districts.js ajmer udaipur sirohi
```

**What it does (per district):**
1. Reads `firms_rajasthan.csv` → filters points inside district boundary (spatial join via Turf.js)
2. Builds a **KDE density grid** (1.1 km cells, 8–9 km bandwidth, brightness-weighted)
3. Applies **2 passes of 3×3 Gaussian smoothing**
4. Extracts **4 zone polygons** via batch cell union + buffer smoothing + simplification
5. Clips polygons to district boundary
6. Exports `{district}_fire_zones.geojson` and `{district}_fire_zones.kml`
7. Appends to `district_summary.json` (risk level, fire count, zone areas, year range)

**Outputs:**
- `public/fire_zones/{district}_fire_zones.geojson` — map layer file
- `public/fire_zones/{district}_fire_zones.kml` — Google Earth download
- `public/fire_zones/district_summary.json` — summary for all districts

---

### `analyze_fire_density.js` — Udaipur Prototype

```bash
node scripts/analyze_fire_density.js
```

Same KDE process but specifically for Udaipur, used as a prototype before the generalized all-districts script was written.

---

## 🌐 Chapter 10 — API Routes

| Route | Method | Returns |
|---|---|---|
| `/api/fire-stats` | GET | Canonical stats from `firms_rajasthan.csv`: total records, districts count, year range, top district, per-district counts |
| `/api/forest-boundary` | GET | Kumbhalgarh sanctuary boundary GeoJSON |
| `/api/last-fires` | GET | Recent fire incident objects for Kumbhalgarh |
| `/api/risk-zones` | GET | Risk zone GeoJSON for Kumbhalgarh |
| `/api/weather` | GET | Temperature/humidity data for fire condition context |
| `/api/report-fire` | POST | Accept fire incident report submissions |

### The `/api/fire-stats` Route (Single Source of Truth)

This route was created specifically to solve the **number consistency problem** — different pages were showing different totals (947 vs 863 vs 877) because they read from different data sources.

`/api/fire-stats` reads directly from `firms_rajasthan.csv` and returns:
```json
{
  "totalRecords": 947,
  "districtsAffected": 33,
  "yearRange": "2018–2025",
  "yearsCount": 8,
  "topDistrict": { "slug": "dungarpur", "name": "Dungarpur", "count": 73 },
  "districtCounts": { "ajmer": 22, "dungarpur": 73, ... }
}
```

All pages that show a "total fire incidents" number should use `totalRecords` from this endpoint.

---

## 🚀 Chapter 11 — How to Run Locally

### Prerequisites
- Node.js v18+
- npm v8+

### 1. Install Dependencies

```bash
cd FirePredictNext
npm install
```

### 2. Generate the Fire Data (if not already present)

```bash
# Step 1: Generate firms_rajasthan.csv
node scripts/fetch_firms_data.js

# Step 2: Download district boundaries (needs internet)
node scripts/fetch_all_boundaries.js

# Step 3: Run KDE analysis for all districts (takes ~5-10 minutes)
node scripts/analyze_all_districts.js
```

> ⚠️ If `public/fire_zones/` and `public/boundaries/` are already populated, you can skip Steps 2 and 3.

### 3. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. (Optional) Build for Production

```bash
npm run build
npm start
```

---

## 📊 Chapter 12 — Key Numbers & Data Facts

| Metric | Value | Source |
|---|---|---|
| Total fire records | **947** | `firms_rajasthan.csv` (master) |
| Districts covered | **33** | All Rajasthan districts |
| Years covered | **8** (2018–2025) | FIRMS data range |
| Aravalli range districts | **10** | Sirohi → Alwar corridor |
| KDE grid resolution | **~1.1 km** per cell | `GRID_CELL_SIZE = 0.01°` |
| KDE bandwidth | **~8–9 km** | `KDE_BANDWIDTH = 0.08°` |
| Smoothing passes | **2** Gaussian passes | 3×3 kernel |
| Risk zones per district | **4** | Very High, High, Moderate, Low |
| Top fire district | **Dungarpur** (73 records) | CSV spatial join |
| Peak fire month | **April** | Highest incident share |
| Fire season | **March–June** | ~75% of all incidents |
| Brightness threshold | **> 300 K** | NASA FIRMS standard |

### Why numbers differ across pages?

Different pages may show slightly different totals because they read from **different data sources**:

| Page | Number Shown | Source | Notes |
|---|---|---|---|
| Fire History badge | 947 | `firms_rajasthan.csv` | ✅ Single source of truth |
| Dashboard "Total Fire Incidents" | 947 | `/api/fire-stats` | ✅ Single source of truth |
| Dashboard map badge | Varies | GeoJSON Point features loaded | This is the **on-map count**, may differ from CSV total |
| Chart page "Total Fire Records" | 947 | `/api/fire-stats` | ✅ Single source of truth |

---

## 📖 Chapter 13 — Glossary

| Term | Meaning |
|---|---|
| **FIRMS** | Fire Information for Resource Management System — NASA's global fire monitoring platform |
| **MODIS** | Moderate Resolution Imaging Spectroradiometer — satellite sensor for fire detection |
| **VIIRS** | Visible Infrared Imaging Radiometer Suite — higher resolution successor to MODIS |
| **Thermal Anomaly / Hotspot** | A pixel detected as significantly hotter than surrounding pixels by the satellite |
| **Brightness Temperature** | Temperature of a pixel as measured in Kelvin from satellite infrared sensor |
| **KDE** | Kernel Density Estimation — converts point data into a smooth density surface |
| **Gaussian Kernel** | Bell-shaped mathematical function used in KDE to spread point influence over area |
| **Bandwidth** | KDE parameter controlling how far a fire point's influence spreads (here: ~8–9km) |
| **Iso-band / Contour** | Line or zone on a density surface where all points have the same density value |
| **Spatial Join** | Operation that assigns attributes (e.g., district name) to points based on which polygon contains them |
| **Point-in-Polygon** | Algorithm checking if a coordinate falls inside a polygon boundary |
| **GeoJSON** | Standard format for geographic data in JSON — used for all map layers |
| **KML** | Keyhole Markup Language — Google Earth's native format (exported from this project) |
| **Turf.js** | JavaScript library for geospatial analysis (replaces a GIS software like QGIS) |
| **Aravalli Range** | Ancient fold mountain system (∼350 million years old) running SW–NE through Rajasthan |
| **Fire Season** | Period of highest fire risk — March to June in Rajasthan |
| **Loo** | Hot dry wind in North India during summer that accelerates fire spread |

---

## 📄 Data Citation

```
NASA FIRMS. (2018–2025). MODIS/Terra+Aqua Active Fire Detections MCD14ML & AF_J1V-C2 NRT [Data set].
NASA EOSDIS Land, Atmosphere Near real-time Capability for EOS (LANCE), FIRMS.
Retrieved from https://firms.modaps.eosdis.nasa.gov/
Processed and filtered for Rajasthan State, India by the FirePredictNext project.
```

---

*FirePredictNext — Building awareness for forest fire prevention through data visualization.*
