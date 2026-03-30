// Kumbhalgarh Wildlife Sanctuary — hardcoded data
// Center: ~25.10°N, 73.58°E | Area: ~578 sq km | Rajsamand, Rajasthan

// ── Forest Boundary GeoJSON ──────────────────────────────────────────────
export const forestBoundary = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Kumbhalgarh Wildlife Sanctuary",
        state: "Rajasthan",
        district: "Rajsamand",
        area_sq_km: 578,
        established: 1971,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.3, 24.6667],
            [73.2583, 24.6917],
            [73.2367, 24.72],
            [73.2, 24.7583],
            [73.1583, 24.7967],
            [73.1367, 24.83],
            [73.1467, 24.87],
            [73.175, 24.9083],
            [73.2033, 24.9417],
            [73.2467, 24.975],
            [73.275, 24.9967],
            [73.3083, 25.02],
            [73.3417, 25.0367],
            [73.37, 25.0583],
            [73.4083, 25.075],
            [73.4417, 25.1],
            [73.48, 25.125],
            [73.5083, 25.1367],
            [73.5367, 25.1583],
            [73.5583, 25.1917],
            [73.575, 25.22],
            [73.6, 25.2583],
            [73.625, 25.2967],
            [73.6467, 25.3367],
            [73.675, 25.375],
            [73.7083, 25.4033],
            [73.7367, 25.425],
            [73.775, 25.4583],
            [73.7917, 25.47],
            [73.8083, 25.4633],
            [73.82, 25.4417],
            [73.8, 25.4083],
            [73.7583, 25.38],
            [73.725, 25.3417],
            [73.7033, 25.3083],
            [73.6917, 25.27],
            [73.67, 25.2417],
            [73.6417, 25.2033],
            [73.625, 25.175],
            [73.5917, 25.1417],
            [73.5533, 25.1167],
            [73.5083, 25.0917],
            [73.47, 25.0667],
            [73.4467, 25.0367],
            [73.4367, 25.0033],
            [73.4467, 24.97],
            [73.4583, 24.925],
            [73.4417, 24.875],
            [73.4167, 24.825],
            [73.3917, 24.775],
            [73.3583, 24.7367],
            [73.325, 24.7],
            [73.3, 24.6667],
          ],
        ],
      },
    },
  ],
};

// ── Last 3 Fire Events ───────────────────────────────────────────────────
export const lastFires = [
  {
    id: 1,
    title: "Northern Ridge Fire",
    date: "2025-11-14",
    lat: 25.1850,
    lng: 73.5350,
    area_burned_ha: 12.4,
    description:
      "Fire broke out near the northern ridge due to dry conditions and high winds. Contained within 6 hours by forest rangers.",
    image: "/images/fires/burn_area_1.png",
  },
  {
    id: 2,
    title: "Dry Grassland Blaze",
    date: "2025-04-22",
    lat: 25.0650,
    lng: 73.5800,
    area_burned_ha: 8.7,
    description:
      "Grassland fire in the southeastern section, likely caused by unattended campfire. Wildlife evacuation protocols were activated.",
    image: "/images/fires/burn_area_2.png",
  },
  {
    id: 3,
    title: "Western Slope Incident",
    date: "2024-12-03",
    lat: 25.1200,
    lng: 73.4600,
    area_burned_ha: 5.2,
    description:
      "Small fire on the western slope, started near a hiking trail. Quick response limited the damage to 5.2 hectares of scrubland.",
    image: "/images/fires/burn_area_3.png",
  },
];

// ── Risk Zones GeoJSON ───────────────────────────────────────────────────
export const riskZones = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        risk: "high",
        label: "High Risk Zone",
        color: "#ef4444",
        fillColor: "#ef4444",
        description: "Dry deciduous forest with high fuel load",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.5000, 25.1800],
            [73.5400, 25.2000],
            [73.5800, 25.1900],
            [73.5900, 25.1600],
            [73.5600, 25.1500],
            [73.5200, 25.1550],
            [73.5000, 25.1800],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        risk: "medium",
        label: "Medium Risk Zone",
        color: "#f97316",
        fillColor: "#f97316",
        description: "Mixed forest with moderate undergrowth",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.5600, 25.0800],
            [73.6000, 25.1000],
            [73.6400, 25.0900],
            [73.6500, 25.0600],
            [73.6200, 25.0400],
            [73.5800, 25.0500],
            [73.5600, 25.0800],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        risk: "low",
        label: "Low Risk Zone",
        color: "#22c55e",
        fillColor: "#22c55e",
        description: "Dense canopy with higher moisture retention",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.4600, 25.0800],
            [73.4900, 25.1100],
            [73.5300, 25.1050],
            [73.5400, 25.0700],
            [73.5100, 25.0500],
            [73.4700, 25.0550],
            [73.4600, 25.0800],
          ],
        ],
      },
    },
  ],
};
