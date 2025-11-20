# Forest Fire Prediction Website

## Overview
Educational Next.js website dedicated to understanding, predicting, and preventing forest fires through research-backed information and real-world case studies.

## Project Structure
```
project-root/
├── app/
│   ├── layout.jsx                 # Root layout with Navbar and Footer
│   ├── globals.css                # Tailwind CSS configuration
│   ├── page.jsx                   # Home page with all 6 causes
│   ├── prediction/page.jsx        # AI prediction tool
│   ├── evidence/page.jsx          # Case studies page
│   ├── prevention/page.jsx        # Prevention strategies
│   ├── components/
│   │   ├── Navbar.jsx            # Navigation component
│   │   ├── Footer.jsx            # Footer component
│   │   ├── CauseCard.jsx         # Displays fire causes
│   │   ├── EvidenceCard.jsx      # Displays case studies
│   │   └── PredictionForm.jsx    # Prediction input form
│   └── data/
│       ├── causes.js             # 6 fire causes with detailed research
│       ├── evidence.js           # 12 real case studies
│       └── prevention.js         # Prevention strategies
├── pages/api/
│   └── predict.js                # API route for fire risk prediction
├── lib/
│   └── utils.js                  # Helper functions
└── public/                       # Static assets directory
```

## Key Features

### 1. Home Page - Fire Causes
Comprehensive educational content on the 6 main causes of forest fires:
- **High Temperature** - Heat waves and climate change impacts
- **Low Humidity** - How dry air accelerates fire spread
- **High Wind** - Wind-driven fire behavior and ember transport
- **Human Activities** - 84-90% of fires are human-caused
- **Dry Vegetation** - Drought-stressed fuels and fire intensity
- **Lightning** - Natural ignition source, primarily in remote areas

Each cause includes:
- Detailed scientific explanations
- Key statistics from research
- Prevention tips
- 2 embedded real-world case studies

### 2. Evidence Page - Case Studies
12 documented real-world fire incidents organized by cause:

**Human Activities:**
- Camp Fire 2018 (PG&E equipment failure, 85 deaths)
- Caldor Fire 2021 (target shooting, 222,000 acres)

**High Temperature:**
- 2021 Siberia Wildfires (record heat, 17 million hectares)
- 2018 California Fire Siege (heat/drought, 100+ deaths)

**Lightning:**
- Tamarack Fire 2021 (lightning strike, explosive growth)
- 2015 Alaska Lightning Siege (99% lightning-caused)

**Dry Vegetation:**
- 2019-20 Australian Bushfires (multi-year drought, 46 million acres)
- Camp Fire fuel conditions (100 million dead trees)

**Low Humidity:**
- 2020 August Complex Fire (first gigafire, <10% humidity)
- 2022 Hermits Peak Fire (prescribed burn escape)

**High Wind:**
- 2018 Woolsey Fire (Santa Ana winds, Malibu)
- 2017 Thomas Fire (weeks of sustained winds)

### 3. Prediction Page
AI-powered fire risk assessment tool that analyzes:
- Temperature (°F)
- Humidity (%)
- Wind Speed (mph)
- Vegetation Dryness (4 levels)
- Days Since Rainfall

Returns:
- Risk Level (Low/Moderate/High/Extreme)
- Detailed analysis
- Contributing factors
- Specific recommendations

### 4. Prevention Page
Research-backed prevention strategies across 10 categories:
- Individual & Community Actions (defensible space, home hardening)
- Government & Utility Actions (infrastructure, forest management)
- Detection & Response (early warning systems)
- Community Planning (land use, building codes)
- Emergency Preparedness (evacuation planning)
- Climate Action (emissions reduction)
- Education & Awareness

## Data Sources
All content is sourced from credible scientific and official sources:
- NASA Earth Observatory & NOAA
- Cal Fire & U.S. Forest Service
- National Interagency Fire Center (NIFC)
- Peer-reviewed scientific journals
- Government investigation reports
- World Resources Institute
- Climate attribution studies

## Technical Stack
- **Framework:** Next.js 16 with App Router
- **Styling:** Tailwind CSS with custom fire-themed color palette
- **Language:** JavaScript
- **Deployment:** Configured for port 5000

## Color Theme
Custom fire gradient palette:
- fire-50 to fire-900 (orange/red gradient)
- Matches forest fire aesthetic
- Accessible contrast ratios

## Recent Changes (November 20, 2025)
- ✅ Initial project setup with Next.js 16 and Tailwind CSS v3
- ✅ Created comprehensive research data:
  - 6 fire causes with detailed scientific explanations
  - 12 real-world case studies (2 per cause)
  - 10 prevention strategy categories
- ✅ Built all pages: Home, Prediction, Evidence, Prevention
- ✅ Implemented 5 reusable components (Navbar, Footer, CauseCard, EvidenceCard, PredictionForm)
- ✅ Created AI prediction API with risk assessment logic
- ✅ Configured fire-themed UI with custom Tailwind colors
- ✅ Added responsive navigation and footer
- ✅ Tested and verified all functionality

## Development
```bash
npm run dev    # Start development server on port 5000
npm run build  # Build for production
npm run start  # Start production server
```

## Educational Purpose
This website is designed for educational purposes to:
- Raise awareness about forest fire causes and prevention
- Provide accurate, research-backed information
- Help users understand fire risk factors
- Promote fire safety and prevention behaviors
- Document real-world lessons from major fire incidents

## Future Enhancements
- Real-time weather API integration
- Interactive fire history map
- User accounts for prediction history
- Educational quizzes
- Data export functionality
- Multi-language support
