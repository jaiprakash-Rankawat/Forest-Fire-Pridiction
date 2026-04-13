/**
 * Fetch district boundaries for all 33 Rajasthan districts from Nominatim
 * Saves each to public/boundaries/{slug}_boundary.geojson
 * Respects Nominatim rate limit: 1 request/second
 */
const fs = require('fs');
const https = require('https');
const path = require('path');

const DISTRICTS = [
  { slug: 'ajmer', name: 'Ajmer', center: [26.45, 74.64] },
  { slug: 'alwar', name: 'Alwar', center: [27.55, 76.61] },
  { slug: 'banswara', name: 'Banswara', center: [23.55, 74.44] },
  { slug: 'baran', name: 'Baran', center: [25.10, 76.51] },
  { slug: 'barmer', name: 'Barmer', center: [25.75, 71.39] },
  { slug: 'bharatpur', name: 'Bharatpur', center: [27.22, 77.49] },
  { slug: 'bhilwara', name: 'Bhilwara', center: [25.35, 74.64] },
  { slug: 'bikaner', name: 'Bikaner', center: [28.02, 73.31] },
  { slug: 'bundi', name: 'Bundi', center: [25.44, 75.64] },
  { slug: 'chittorgarh', name: 'Chittorgarh', center: [24.88, 74.63] },
  { slug: 'churu', name: 'Churu', center: [28.30, 74.97] },
  { slug: 'dausa', name: 'Dausa', center: [26.88, 76.34] },
  { slug: 'dholpur', name: 'Dholpur', center: [26.70, 77.89] },
  { slug: 'dungarpur', name: 'Dungarpur', center: [23.84, 73.71] },
  { slug: 'hanumangarh', name: 'Hanumangarh', center: [29.58, 74.33] },
  { slug: 'jaipur', name: 'Jaipur', center: [26.92, 75.79] },
  { slug: 'jaisalmer', name: 'Jaisalmer', center: [26.92, 70.91] },
  { slug: 'jalore', name: 'Jalore', center: [25.35, 72.62] },
  { slug: 'jhalawar', name: 'Jhalawar', center: [24.60, 76.16] },
  { slug: 'jhunjhunu', name: 'Jhunjhunu', center: [28.13, 75.40] },
  { slug: 'jodhpur', name: 'Jodhpur', center: [26.29, 73.02] },
  { slug: 'karauli', name: 'Karauli', center: [26.49, 77.02] },
  { slug: 'kota', name: 'Kota', center: [25.18, 75.83] },
  { slug: 'nagaur', name: 'Nagaur', center: [27.20, 73.74] },
  { slug: 'pali', name: 'Pali', center: [25.77, 73.33] },
  { slug: 'pratapgarh', name: 'Pratapgarh', center: [24.03, 74.78] },
  { slug: 'rajsamand', name: 'Rajsamand', center: [25.07, 73.88] },
  { slug: 'sawai-madhopur', name: 'Sawai Madhopur', center: [26.02, 76.35] },
  { slug: 'sikar', name: 'Sikar', center: [27.61, 75.14] },
  { slug: 'sirohi', name: 'Sirohi', center: [24.88, 72.86] },
  { slug: 'sri-ganganagar', name: 'Sri Ganganagar', center: [29.91, 73.88] },
  { slug: 'tonk', name: 'Tonk', center: [26.17, 75.79] },
  { slug: 'udaipur', name: 'Udaipur', center: [24.58, 73.68] },
];

const BOUNDARIES_DIR = path.join(__dirname, '..', 'public', 'boundaries');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: { 'User-Agent': 'FirePredictNext/1.0 (educational forest fire project)' }
    };
    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate a simplified boundary polygon from center coordinates
 * Used as fallback when Nominatim doesn't return data
 */
function generateFallbackBoundary(district) {
  const [lat, lng] = district.center;
  // Create a roughly district-sized polygon (~40-60km radius)
  const radius = 0.35 + Math.random() * 0.15; // ~35-50km in degrees
  const points = 36; // 36-sided polygon
  const coords = [];
  
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    // Add slight randomness for natural look
    const r = radius * (0.85 + Math.random() * 0.3);
    const pLng = lng + r * Math.cos(angle) * (1 / Math.cos(lat * Math.PI / 180));
    const pLat = lat + r * Math.sin(angle);
    coords.push([parseFloat(pLng.toFixed(6)), parseFloat(pLat.toFixed(6))]);
  }
  // Close the ring
  coords[coords.length - 1] = coords[0];

  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {
        name: `${district.name} District`,
        admin_level: '5',
        source: 'Generated (fallback)'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [coords]
      }
    }]
  };
}

async function fetchDistrictBoundary(district) {
  const searchQuery = encodeURIComponent(`${district.name} district Rajasthan India`);
  const url = `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=geojson&polygon_geojson=1&limit=1&admin_level=5`;
  
  try {
    const { status, data } = await fetchUrl(url);
    
    if (status !== 200) {
      console.log(`  HTTP ${status} for ${district.name}, using fallback`);
      return generateFallbackBoundary(district);
    }

    const parsed = JSON.parse(data);
    
    if (!parsed.features || parsed.features.length === 0) {
      // Try without admin_level filter
      const url2 = `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=geojson&polygon_geojson=1&limit=1`;
      await sleep(1100);
      const { data: data2 } = await fetchUrl(url2);
      const parsed2 = JSON.parse(data2);
      
      if (!parsed2.features || parsed2.features.length === 0) {
        console.log(`  No results for ${district.name}, using fallback boundary`);
        return generateFallbackBoundary(district);
      }
      
      const feature = parsed2.features[0];
      // Check if it has polygon geometry
      if (!feature.geometry || (feature.geometry.type !== 'Polygon' && feature.geometry.type !== 'MultiPolygon')) {
        console.log(`  Non-polygon geometry for ${district.name}, using fallback`);
        return generateFallbackBoundary(district);
      }
      
      feature.properties = {
        name: `${district.name} District`,
        admin_level: '5',
        source: 'OpenStreetMap/Nominatim'
      };
      return { type: 'FeatureCollection', features: [feature] };
    }

    const feature = parsed.features[0];
    
    if (!feature.geometry || (feature.geometry.type !== 'Polygon' && feature.geometry.type !== 'MultiPolygon')) {
      console.log(`  Non-polygon result for ${district.name}, using fallback`);
      return generateFallbackBoundary(district);
    }

    feature.properties = {
      name: `${district.name} District`,
      admin_level: '5',
      source: 'OpenStreetMap/Nominatim'
    };

    return { type: 'FeatureCollection', features: [feature] };
  } catch (err) {
    console.log(`  Error fetching ${district.name}: ${err.message}, using fallback`);
    return generateFallbackBoundary(district);
  }
}

async function main() {
  console.log('=== Fetching Rajasthan District Boundaries ===\n');
  
  // Create output directory
  if (!fs.existsSync(BOUNDARIES_DIR)) {
    fs.mkdirSync(BOUNDARIES_DIR, { recursive: true });
  }

  // Check for already-downloaded boundaries to support resumption
  const existing = fs.readdirSync(BOUNDARIES_DIR).filter(f => f.endsWith('_boundary.geojson'));
  const existingSlugs = new Set(existing.map(f => f.replace('_boundary.geojson', '')));
  
  let downloaded = 0;
  let skipped = 0;
  let fallbacks = 0;

  for (const district of DISTRICTS) {
    if (existingSlugs.has(district.slug)) {
      console.log(`[${skipped + downloaded + 1}/${DISTRICTS.length}] ${district.name} — already exists, skipping`);
      skipped++;
      continue;
    }

    console.log(`[${skipped + downloaded + 1}/${DISTRICTS.length}] Fetching ${district.name}...`);
    
    const geojson = await fetchDistrictBoundary(district);
    const outPath = path.join(BOUNDARIES_DIR, `${district.slug}_boundary.geojson`);
    fs.writeFileSync(outPath, JSON.stringify(geojson, null, 2));
    
    const isFallback = geojson.features[0].properties.source.includes('fallback');
    if (isFallback) fallbacks++;
    
    const geo = geojson.features[0].geometry;
    let coordCount = 0;
    if (geo.type === 'Polygon') {
      geo.coordinates.forEach(ring => coordCount += ring.length);
    } else if (geo.type === 'MultiPolygon') {
      geo.coordinates.forEach(poly => poly.forEach(ring => coordCount += ring.length));
    }
    
    console.log(`  → Saved: ${geo.type}, ${coordCount} coords${isFallback ? ' (FALLBACK)' : ''}`);
    downloaded++;
    
    // Rate limit: 1 request per second for Nominatim
    if (!isFallback) {
      await sleep(1100);
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`Downloaded: ${downloaded} | Skipped: ${skipped} | Fallbacks: ${fallbacks}`);
  console.log(`Files in: ${BOUNDARIES_DIR}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
