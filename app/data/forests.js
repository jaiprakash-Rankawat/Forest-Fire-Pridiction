import forestData from "./indian_forests_database.json";

// We maintain the same exported constant name so existing imports work
export const INDIAN_FORESTS = forestData;

// Group by state for easy searchable dropdown
export const FORESTS_BY_STATE = INDIAN_FORESTS.reduce((acc, forest) => {
  if (!acc[forest.state]) acc[forest.state] = [];
  acc[forest.state].push(forest);
  return acc;
}, {});

// Find nearest forest to given coordinates
export function findNearestForest(lat, lon) {
  let nearest = null;
  let minDist = Infinity;

  for (const forest of INDIAN_FORESTS) {
    const dist = Math.sqrt(
      Math.pow(lat - forest.lat, 2) + Math.pow(lon - forest.lon, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = forest;
    }
  }

  return { forest: nearest, distanceKm: Math.round(minDist * 111) };
}
