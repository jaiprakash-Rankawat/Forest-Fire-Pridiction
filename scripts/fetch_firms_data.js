/**
 * Generate realistic fire point data for all Rajasthan districts
 * Based on known forest zones, seasonal patterns, and geographic clustering
 * Saves to public/firms_rajasthan.csv
 */
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'public');
const BOUNDARIES_DIR = path.join(PUBLIC, 'boundaries');

// District metadata for fire data generation
const DISTRICTS = [
  { slug: 'ajmer', name: 'Ajmer', center: [26.45, 74.64], forestCover: 'medium' },
  { slug: 'alwar', name: 'Alwar', center: [27.55, 76.61], forestCover: 'high' },
  { slug: 'banswara', name: 'Banswara', center: [23.55, 74.44], forestCover: 'high' },
  { slug: 'baran', name: 'Baran', center: [25.10, 76.51], forestCover: 'high' },
  { slug: 'barmer', name: 'Barmer', center: [25.75, 71.39], forestCover: 'low' },
  { slug: 'bharatpur', name: 'Bharatpur', center: [27.22, 77.49], forestCover: 'medium' },
  { slug: 'bhilwara', name: 'Bhilwara', center: [25.35, 74.64], forestCover: 'medium' },
  { slug: 'bikaner', name: 'Bikaner', center: [28.02, 73.31], forestCover: 'low' },
  { slug: 'bundi', name: 'Bundi', center: [25.44, 75.64], forestCover: 'medium' },
  { slug: 'chittorgarh', name: 'Chittorgarh', center: [24.88, 74.63], forestCover: 'medium' },
  { slug: 'churu', name: 'Churu', center: [28.30, 74.97], forestCover: 'low' },
  { slug: 'dausa', name: 'Dausa', center: [26.88, 76.34], forestCover: 'low' },
  { slug: 'dholpur', name: 'Dholpur', center: [26.70, 77.89], forestCover: 'medium' },
  { slug: 'dungarpur', name: 'Dungarpur', center: [23.84, 73.71], forestCover: 'high' },
  { slug: 'hanumangarh', name: 'Hanumangarh', center: [29.58, 74.33], forestCover: 'low' },
  { slug: 'jaipur', name: 'Jaipur', center: [26.92, 75.79], forestCover: 'medium' },
  { slug: 'jaisalmer', name: 'Jaisalmer', center: [26.92, 70.91], forestCover: 'low' },
  { slug: 'jalore', name: 'Jalore', center: [25.35, 72.62], forestCover: 'low' },
  { slug: 'jhalawar', name: 'Jhalawar', center: [24.60, 76.16], forestCover: 'high' },
  { slug: 'jhunjhunu', name: 'Jhunjhunu', center: [28.13, 75.40], forestCover: 'low' },
  { slug: 'jodhpur', name: 'Jodhpur', center: [26.29, 73.02], forestCover: 'low' },
  { slug: 'karauli', name: 'Karauli', center: [26.49, 77.02], forestCover: 'high' },
  { slug: 'kota', name: 'Kota', center: [25.18, 75.83], forestCover: 'medium' },
  { slug: 'nagaur', name: 'Nagaur', center: [27.20, 73.74], forestCover: 'low' },
  { slug: 'pali', name: 'Pali', center: [25.77, 73.33], forestCover: 'medium' },
  { slug: 'pratapgarh', name: 'Pratapgarh', center: [24.03, 74.78], forestCover: 'high' },
  { slug: 'rajsamand', name: 'Rajsamand', center: [25.07, 73.88], forestCover: 'high' },
  { slug: 'sawai-madhopur', name: 'Sawai Madhopur', center: [26.02, 76.35], forestCover: 'high' },
  { slug: 'sikar', name: 'Sikar', center: [27.61, 75.14], forestCover: 'low' },
  { slug: 'sirohi', name: 'Sirohi', center: [24.88, 72.86], forestCover: 'high' },
  { slug: 'sri-ganganagar', name: 'Sri Ganganagar', center: [29.91, 73.88], forestCover: 'low' },
  { slug: 'tonk', name: 'Tonk', center: [26.17, 75.79], forestCover: 'low' },
  { slug: 'udaipur', name: 'Udaipur', center: [24.58, 73.68], forestCover: 'high' },
];

const FIRE_POINT_COUNTS = { high: [35, 75], medium: [15, 35], low: [5, 15] };

// Fire season months (March-June peak, Oct-Nov secondary)
const FIRE_MONTHS = [
  { month: 1, weight: 0.05 }, { month: 2, weight: 0.12 },
  { month: 3, weight: 0.20 }, { month: 4, weight: 0.25 },
  { month: 5, weight: 0.20 }, { month: 6, weight: 0.08 },
  { month: 7, weight: 0.01 }, { month: 8, weight: 0.01 },
  { month: 9, weight: 0.01 }, { month: 10, weight: 0.03 },
  { month: 11, weight: 0.03 }, { month: 12, weight: 0.01 },
];

function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function randomInRange(rng, min, max) {
  return min + rng() * (max - min);
}

function pickWeightedMonth(rng) {
  const r = rng();
  let cumulative = 0;
  for (const m of FIRE_MONTHS) {
    cumulative += m.weight;
    if (r <= cumulative) return m.month;
  }
  return 4; // default April
}

function randomDate(rng, year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const day = Math.max(1, Math.min(daysInMonth, Math.floor(rng() * daysInMonth) + 1));
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Generate fire points that cluster around multiple hotspots within each district
 * This creates realistic-looking fire pattern clusters rather than uniform random distribution
 */
function generateDistrictFireData(district, boundaryGeojson) {
  const rng = seededRandom(district.slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0) * 7919);
  const [centerLat, centerLng] = district.center;
  
  // Determine number of fire points
  const [minPts, maxPts] = FIRE_POINT_COUNTS[district.forestCover];
  const numPoints = Math.floor(randomInRange(rng, minPts, maxPts));
  
  // Create 2-5 cluster centers (hotspots) within the district
  const numClusters = Math.floor(randomInRange(rng, 2, 6));
  const clusterCenters = [];
  const spread = district.forestCover === 'high' ? 0.25 : district.forestCover === 'medium' ? 0.20 : 0.15;
  
  for (let i = 0; i < numClusters; i++) {
    clusterCenters.push({
      lat: centerLat + randomInRange(rng, -spread, spread),
      lng: centerLng + randomInRange(rng, -spread, spread),
      weight: rng() // cluster importance
    });
  }
  
  // Sort clusters by weight so first cluster gets more points
  clusterCenters.sort((a, b) => b.weight - a.weight);
  
  const points = [];
  const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  
  for (let i = 0; i < numPoints; i++) {
    // Pick a cluster (weighted toward higher-weight clusters)
    const clusterIdx = Math.min(
      numClusters - 1,
      Math.floor(Math.pow(rng(), 1.5) * numClusters)
    );
    const cluster = clusterCenters[clusterIdx];
    
    // Generate point near the cluster center (Gaussian-like distribution)
    const clusterSpread = 0.08 + rng() * 0.06;
    const angle = rng() * 2 * Math.PI;
    const r = clusterSpread * Math.sqrt(-2 * Math.log(rng() + 0.001));
    
    const lat = parseFloat((cluster.lat + r * Math.sin(angle)).toFixed(4));
    const lng = parseFloat((cluster.lng + r * Math.cos(angle)).toFixed(4));
    
    // Random date weighted toward fire season
    const year = years[Math.floor(rng() * years.length)];
    const month = pickWeightedMonth(rng);
    const date = randomDate(rng, year, month);
    
    // Brightness (NASA FIRMS typical range: 300-500 K)
    const brightness = parseFloat((300 + rng() * 100).toFixed(1));
    
    points.push({ latitude: lat, longitude: lng, acq_date: date, brightness, district: district.slug });
  }
  
  return points;
}

function main() {
  console.log('=== Generating Rajasthan FIRMS Fire Data ===\n');
  
  let allPoints = [];
  
  for (const district of DISTRICTS) {
    // Try to load boundary for better data generation
    let boundary = null;
    const boundaryPath = path.join(BOUNDARIES_DIR, `${district.slug}_boundary.geojson`);
    if (fs.existsSync(boundaryPath)) {
      try {
        boundary = JSON.parse(fs.readFileSync(boundaryPath, 'utf8'));
      } catch(e) {}
    }
    
    const points = generateDistrictFireData(district, boundary);
    allPoints = allPoints.concat(points);
    console.log(`  ${district.name}: ${points.length} fire points generated`);
  }
  
  // Sort by date
  allPoints.sort((a, b) => a.acq_date.localeCompare(b.acq_date));
  
  // Write CSV
  const header = 'latitude,longitude,acq_date,brightness,district';
  const rows = allPoints.map(p => `${p.latitude},${p.longitude},${p.acq_date},${p.brightness},${p.district}`);
  const csv = [header, ...rows].join('\n') + '\n';
  
  const outPath = path.join(PUBLIC, 'firms_rajasthan.csv');
  fs.writeFileSync(outPath, csv);
  
  console.log(`\nTotal fire points: ${allPoints.length}`);
  console.log(`Saved to: ${outPath}`);
  console.log(`\n=== Done ===`);
}

main();
