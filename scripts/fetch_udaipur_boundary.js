/**
 * Fetch Udaipur district boundary from polygons.openstreetmap.fr
 * OSM Relation ID: 1950135
 */
const fs = require('fs');
const https = require('https');
const path = require('path');

// polygons.openstreetmap.fr provides pre-built GeoJSON for OSM relations
const url = 'https://nominatim.openstreetmap.org/search?q=Udaipur+district+Rajasthan+India&format=geojson&polygon_geojson=1&limit=1&admin_level=5';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: { 'User-Agent': 'FirePredictNext/1.0 (educational project)' }
    };
    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log('Fetching Udaipur district boundary from Nominatim...');
  
  try {
    const raw = await fetchUrl(url);
    const parsed = JSON.parse(raw);

    if (!parsed.features || parsed.features.length === 0) {
      console.error('No features found. Trying polygon download...');
      // Fallback: try the direct polygon download
      const fallbackUrl = 'https://polygons.openstreetmap.fr/get_geojson.py?id=1950135&params=0';
      console.log('Trying polygons.openstreetmap.fr...');
      const raw2 = await fetchUrl(fallbackUrl);
      const geo2 = JSON.parse(raw2);
      const geojson = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: { name: 'Udaipur District', admin_level: '5', source: 'OpenStreetMap' },
          geometry: geo2
        }]
      };
      saveGeoJSON(geojson);
      return;
    }

    // Wrap in a clean FeatureCollection
    const feature = parsed.features[0];
    feature.properties = {
      name: feature.properties?.display_name || 'Udaipur District',
      admin_level: '5',
      source: 'OpenStreetMap/Nominatim'
    };

    const geojson = {
      type: 'FeatureCollection',
      features: [feature]
    };

    saveGeoJSON(geojson);
  } catch (e) {
    console.error('Error:', e.message);
    
    // Final fallback: try the OSM polygon service directly
    console.log('\nTrying fallback: polygons.openstreetmap.fr...');
    try {
      const fallbackUrl = 'https://polygons.openstreetmap.fr/get_geojson.py?id=1950135&params=0';
      const raw2 = await fetchUrl(fallbackUrl);
      const geo2 = JSON.parse(raw2);
      const geojson = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: { name: 'Udaipur District', admin_level: '5', source: 'OpenStreetMap' },
          geometry: geo2
        }]
      };
      saveGeoJSON(geojson);
    } catch (e2) {
      console.error('Fallback also failed:', e2.message);
    }
  }
}

function saveGeoJSON(geojson) {
  const outPath = path.join(__dirname, '..', 'public', 'udaipur_boundary.geojson');
  fs.writeFileSync(outPath, JSON.stringify(geojson, null, 2));
  
  const geo = geojson.features[0].geometry;
  let coordCount = 0;
  if (geo.type === 'Polygon') {
    geo.coordinates.forEach(ring => coordCount += ring.length);
  } else if (geo.type === 'MultiPolygon') {
    geo.coordinates.forEach(poly => poly.forEach(ring => coordCount += ring.length));
  }
  
  console.log(`Saved boundary to ${outPath}`);
  console.log(`Geometry type: ${geo.type}`);
  console.log(`Coordinate points: ${coordCount}`);
}

main();
