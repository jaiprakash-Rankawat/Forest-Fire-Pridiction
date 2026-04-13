/**
 * Generalized Forest Fire Density Analysis for All Rajasthan Districts
 * 
 * Usage:
 *   node scripts/analyze_all_districts.js              # Process all districts
 *   node scripts/analyze_all_districts.js ajmer alwar   # Process specific districts
 * 
 * For each district:
 * 1. Load boundary + filter fire points
 * 2. Grid-based Kernel Density Estimation (KDE)
 * 3. Classify into 4 fire risk zones
 * 4. Generate smoothed polygons
 * 5. Export GeoJSON + KML
 * 6. Generate summary JSON
 */

const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

const PUBLIC = path.join(__dirname, '..', 'public');
const BOUNDARIES_DIR = path.join(PUBLIC, 'boundaries');
const FIRE_ZONES_DIR = path.join(PUBLIC, 'fire_zones');

// ─── CONFIG ───────────────────────────────────────────────────
const GRID_CELL_SIZE = 0.01;    // ~1.1km grid cells
const KDE_BANDWIDTH  = 0.08;    // kernel bandwidth ~8-9km
const SMOOTH_PASSES  = 2;

const THRESHOLDS = {
  veryHigh: 0.70,
  high:     0.40,
  moderate: 0.15,
  low:      0.0
};

const ZONE_STYLES = [
  { name: 'Very High Fire Zone', color: '#FF0000', opacity: 0.55, minPct: THRESHOLDS.veryHigh },
  { name: 'High Fire Zone',      color: '#FF8C00', opacity: 0.50, minPct: THRESHOLDS.high },
  { name: 'Moderate Fire Zone',  color: '#FFD700', opacity: 0.45, minPct: THRESHOLDS.moderate },
  { name: 'Low Fire Zone',       color: '#228B22', opacity: 0.35, minPct: THRESHOLDS.low },
];

const DISTRICTS = [
  { slug: 'ajmer', name: 'Ajmer' },
  { slug: 'alwar', name: 'Alwar' },
  { slug: 'banswara', name: 'Banswara' },
  { slug: 'baran', name: 'Baran' },
  { slug: 'barmer', name: 'Barmer' },
  { slug: 'bharatpur', name: 'Bharatpur' },
  { slug: 'bhilwara', name: 'Bhilwara' },
  { slug: 'bikaner', name: 'Bikaner' },
  { slug: 'bundi', name: 'Bundi' },
  { slug: 'chittorgarh', name: 'Chittorgarh' },
  { slug: 'churu', name: 'Churu' },
  { slug: 'dausa', name: 'Dausa' },
  { slug: 'dholpur', name: 'Dholpur' },
  { slug: 'dungarpur', name: 'Dungarpur' },
  { slug: 'hanumangarh', name: 'Hanumangarh' },
  { slug: 'jaipur', name: 'Jaipur' },
  { slug: 'jaisalmer', name: 'Jaisalmer' },
  { slug: 'jalore', name: 'Jalore' },
  { slug: 'jhalawar', name: 'Jhalawar' },
  { slug: 'jhunjhunu', name: 'Jhunjhunu' },
  { slug: 'jodhpur', name: 'Jodhpur' },
  { slug: 'karauli', name: 'Karauli' },
  { slug: 'kota', name: 'Kota' },
  { slug: 'nagaur', name: 'Nagaur' },
  { slug: 'pali', name: 'Pali' },
  { slug: 'pratapgarh', name: 'Pratapgarh' },
  { slug: 'rajsamand', name: 'Rajsamand' },
  { slug: 'sawai-madhopur', name: 'Sawai Madhopur' },
  { slug: 'sikar', name: 'Sikar' },
  { slug: 'sirohi', name: 'Sirohi' },
  { slug: 'sri-ganganagar', name: 'Sri Ganganagar' },
  { slug: 'tonk', name: 'Tonk' },
  { slug: 'udaipur', name: 'Udaipur' },
];

// ─── MAIN ─────────────────────────────────────────────────────
async function main() {
  console.log('=== Rajasthan District Fire Density Analysis ===\n');

  // Create output directory
  if (!fs.existsSync(FIRE_ZONES_DIR)) {
    fs.mkdirSync(FIRE_ZONES_DIR, { recursive: true });
  }

  // Load all fire data
  const fireCsvPath = path.join(PUBLIC, 'firms_rajasthan.csv');
  if (!fs.existsSync(fireCsvPath)) {
    console.error('ERROR: firms_rajasthan.csv not found. Run fetch_firms_data.js first.');
    process.exit(1);
  }
  const allFirePoints = parseCSV(fs.readFileSync(fireCsvPath, 'utf8'));
  console.log(`Loaded ${allFirePoints.length} total fire points\n`);

  // Determine which districts to process
  const args = process.argv.slice(2);
  let districtsToProcess = DISTRICTS;
  if (args.length > 0) {
    districtsToProcess = DISTRICTS.filter(d => args.includes(d.slug));
    if (districtsToProcess.length === 0) {
      console.error(`No matching districts found for: ${args.join(', ')}`);
      console.log(`Available: ${DISTRICTS.map(d => d.slug).join(', ')}`);
      process.exit(1);
    }
  }

  const summary = {};
  let processed = 0;
  let failed = 0;

  for (const district of districtsToProcess) {
    console.log(`\n─── [${processed + 1}/${districtsToProcess.length}] ${district.name} ───`);
    
    try {
      const result = await processDistrict(district, allFirePoints);
      summary[district.slug] = result;
      processed++;
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      summary[district.slug] = { 
        name: district.name, 
        error: err.message,
        firePoints: 0,
        riskLevel: 'Unknown',
        zones: {}
      };
      failed++;
    }
  }

  // Load existing summary and merge (to support partial processing)
  const summaryPath = path.join(FIRE_ZONES_DIR, 'district_summary.json');
  let existingSummary = {};
  if (fs.existsSync(summaryPath)) {
    try {
      existingSummary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
    } catch(e) {}
  }
  
  const finalSummary = { ...existingSummary, ...summary };
  fs.writeFileSync(summaryPath, JSON.stringify(finalSummary, null, 2));

  console.log(`\n\n=== Analysis Complete ===`);
  console.log(`Processed: ${processed} | Failed: ${failed}`);
  console.log(`Summary: ${summaryPath}`);
}

// ─── PROCESS SINGLE DISTRICT ──────────────────────────────────
async function processDistrict(district, allFirePoints) {
  const boundaryPath = path.join(BOUNDARIES_DIR, `${district.slug}_boundary.geojson`);
  
  if (!fs.existsSync(boundaryPath)) {
    throw new Error(`Boundary file not found: ${boundaryPath}`);
  }

  const boundary = JSON.parse(fs.readFileSync(boundaryPath, 'utf8'));
  const boundaryFeature = boundary.features[0];
  const bbox = turf.bbox(boundaryFeature);

  // Filter fire points within or near this district
  const insidePoints = allFirePoints.filter(pt => {
    // Quick bbox filter first
    if (pt.longitude < bbox[0] - 0.1 || pt.longitude > bbox[2] + 0.1 ||
        pt.latitude < bbox[1] - 0.1 || pt.latitude > bbox[3] + 0.1) return false;
    
    try {
      const point = turf.point([pt.longitude, pt.latitude]);
      return turf.booleanPointInPolygon(point, boundaryFeature);
    } catch(e) {
      return false;
    }
  });

  // Also include nearby points for KDE smoothing
  let analysisPoints = insidePoints;
  if (insidePoints.length < 5) {
    const bufferedBbox = [bbox[0] - 0.2, bbox[1] - 0.2, bbox[2] + 0.2, bbox[3] + 0.2];
    analysisPoints = allFirePoints.filter(pt =>
      pt.longitude >= bufferedBbox[0] && pt.longitude <= bufferedBbox[2] &&
      pt.latitude >= bufferedBbox[1] && pt.latitude <= bufferedBbox[3]
    );
  }

  console.log(`  Fire points inside: ${insidePoints.length}, analysis: ${analysisPoints.length}`);

  if (analysisPoints.length === 0) {
    // Generate a minimal output with no zones
    const emptyOutput = {
      type: 'FeatureCollection',
      features: [{
        ...JSON.parse(JSON.stringify(boundaryFeature)),
        properties: {
          name: `${district.name} District Boundary`,
          stroke: '#FFFFFF', 'stroke-width': 2, 'stroke-opacity': 0.9,
          fill: 'none', 'fill-opacity': 0
        }
      }]
    };
    const geoPath = path.join(FIRE_ZONES_DIR, `${district.slug}_fire_zones.geojson`);
    fs.writeFileSync(geoPath, JSON.stringify(emptyOutput, null, 2));
    console.log(`  No fire data — saved empty GeoJSON`);
    
    return {
      name: district.name,
      firePoints: 0,
      riskLevel: 'Minimal',
      zones: {},
      yearRange: 'N/A'
    };
  }

  // KDE
  const grid = computeKDE(analysisPoints, bbox, GRID_CELL_SIZE, KDE_BANDWIDTH);
  for (let pass = 0; pass < SMOOTH_PASSES; pass++) smoothGrid(grid);

  let maxDensity = 0;
  for (let i = 0; i < grid.values.length; i++) {
    if (grid.values[i] > maxDensity) maxDensity = grid.values[i];
  }

  // Generate zone polygons
  const zoneFeatures = [];
  const zoneStats = {};

  for (const zone of ZONE_STYLES) {
    const threshold = zone.minPct * maxDensity;
    const polygons = extractContourPolygons(grid, threshold, bbox, boundaryFeature);
    
    if (polygons.length > 0) {
      let combined;
      try {
        combined = polygons.length === 1 
          ? polygons[0] 
          : polygons.reduce((acc, poly) => {
              try { return turf.union(turf.featureCollection([acc, poly])); } 
              catch(e) { return acc; }
            });
      } catch(e) {
        combined = polygons[0];
      }

      if (combined) {
        try {
          combined = turf.intersect(turf.featureCollection([combined, boundaryFeature]));
        } catch(e) {}

        if (combined) {
          combined.properties = {
            zone: zone.name, color: zone.color, opacity: zone.opacity,
            fill: zone.color, 'fill-opacity': zone.opacity,
            stroke: zone.color, 'stroke-width': 1, 'stroke-opacity': 0.8
          };
          zoneFeatures.push(combined);
          const area = turf.area(combined) / 1e6;
          zoneStats[zone.name] = { area: parseFloat(area.toFixed(1)), color: zone.color };
          console.log(`  ${zone.name}: ${area.toFixed(1)} km²`);
        }
      }
    }
  }

  // Build output GeoJSON
  const boundaryOutline = JSON.parse(JSON.stringify(boundaryFeature));
  boundaryOutline.properties = {
    name: `${district.name} District Boundary`,
    stroke: '#FFFFFF', 'stroke-width': 2, 'stroke-opacity': 0.9,
    fill: 'none', 'fill-opacity': 0
  };

  const pointFeatures = analysisPoints.map(pt => turf.point(
    [pt.longitude, pt.latitude],
    { date: pt.acq_date, brightness: pt.brightness, 'marker-color': '#FF4444', 'marker-size': 'small' }
  ));

  const outputGeoJSON = {
    type: 'FeatureCollection',
    features: [...zoneFeatures.reverse(), boundaryOutline, ...pointFeatures]
  };

  const geoPath = path.join(FIRE_ZONES_DIR, `${district.slug}_fire_zones.geojson`);
  fs.writeFileSync(geoPath, JSON.stringify(outputGeoJSON));
  console.log(`  Saved: ${geoPath}`);

  // Generate KML
  const kml = generateKML(district.name, outputGeoJSON, zoneFeatures, boundaryFeature, pointFeatures);
  const kmlPath = path.join(FIRE_ZONES_DIR, `${district.slug}_fire_zones.kml`);
  fs.writeFileSync(kmlPath, kml);

  // Determine district overall risk level from absolute fire counts
  let riskLevel = 'Minimal';
  if (insidePoints.length > 45) riskLevel = 'Very High';
  else if (insidePoints.length > 30) riskLevel = 'High';
  else if (insidePoints.length > 15) riskLevel = 'Moderate';
  else if (insidePoints.length >= 5) riskLevel = 'Low';

  const years = analysisPoints
    .map(p => p.acq_date?.substring(0, 4))
    .filter(Boolean).map(Number).filter(y => y > 2000);
  const yearRange = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : 'N/A';

  return {
    name: district.name,
    firePoints: insidePoints.length,
    riskLevel,
    zones: zoneStats,
    yearRange
  };
}

// ─── CSV PARSER ───────────────────────────────────────────────
function parseCSV(raw) {
  const lines = raw.trim().split('\n').filter(l => l.trim());
  const header = lines[0].split(',').map(h => h.trim());
  const latIdx = header.indexOf('latitude');
  const lngIdx = header.indexOf('longitude');
  const dateIdx = header.indexOf('acq_date');
  const brightIdx = header.indexOf('brightness');

  const points = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim());
    if (cols.length < 2) continue;
    const lat = parseFloat(cols[latIdx]);
    const lng = parseFloat(cols[lngIdx]);
    if (isNaN(lat) || isNaN(lng)) continue;
    points.push({
      latitude: lat, longitude: lng,
      acq_date: cols[dateIdx] || '',
      brightness: parseFloat(cols[brightIdx]) || 0
    });
  }
  return points;
}

// ─── KERNEL DENSITY ESTIMATION ────────────────────────────────
function computeKDE(points, bbox, cellSize, bandwidth) {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const pad = bandwidth * 1.5;
  const x0 = minLon - pad, y0 = minLat - pad;
  const x1 = maxLon + pad, y1 = maxLat + pad;
  
  const cols = Math.ceil((x1 - x0) / cellSize);
  const rows = Math.ceil((y1 - y0) / cellSize);
  const values = new Float64Array(rows * cols);

  const bw2 = bandwidth * bandwidth;

  for (const pt of points) {
    const weight = pt.brightness ? (pt.brightness / 300) : 1.0;
    const colCenter = Math.floor((pt.longitude - x0) / cellSize);
    const rowCenter = Math.floor((pt.latitude - y0) / cellSize);
    const radius = Math.ceil(bandwidth * 2 / cellSize);

    for (let r = Math.max(0, rowCenter - radius); r < Math.min(rows, rowCenter + radius); r++) {
      for (let c = Math.max(0, colCenter - radius); c < Math.min(cols, colCenter + radius); c++) {
        const cellLon = x0 + (c + 0.5) * cellSize;
        const cellLat = y0 + (r + 0.5) * cellSize;
        const dx = cellLon - pt.longitude;
        const dy = cellLat - pt.latitude;
        const dist2 = dx * dx + dy * dy;
        const kernelVal = Math.exp(-dist2 / (2 * bw2)) * weight;
        values[r * cols + c] += kernelVal;
      }
    }
  }

  return { values, cols, rows, x0, y0, cellSize };
}

// ─── GRID SMOOTHING ──────────────────────────────────────────
function smoothGrid(grid) {
  const { values, cols, rows } = grid;
  const out = new Float64Array(values.length);
  const k = [1, 2, 1, 2, 4, 2, 1, 2, 1];
  const kSum = 16;

  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      let sum = 0, ki = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          sum += values[(r + dr) * cols + (c + dc)] * k[ki++];
        }
      }
      out[r * cols + c] = sum / kSum;
    }
  }
  for (let i = 0; i < values.length; i++) {
    if (out[i] > 0) values[i] = out[i];
  }
}

// ─── CONTOUR POLYGON EXTRACTION ──────────────────────────────
function extractContourPolygons(grid, threshold, bbox, boundaryFeature) {
  const { values, cols, rows, x0, y0, cellSize } = grid;
  
  const cellPolygons = [];
  const halfCell = cellSize * 0.55;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (values[r * cols + c] >= threshold) {
        const lon = x0 + (c + 0.5) * cellSize;
        const lat = y0 + (r + 0.5) * cellSize;
        const cell = turf.bboxPolygon([
          lon - halfCell, lat - halfCell,
          lon + halfCell, lat + halfCell
        ]);
        cellPolygons.push(cell);
      }
    }
  }

  if (cellPolygons.length === 0) return [];

  let merged = batchUnion(cellPolygons);
  
  const results = [];
  if (merged) {
    try {
      let smoothed = turf.buffer(merged, 1.5, { units: 'kilometers' });
      smoothed = turf.buffer(smoothed, -0.8, { units: 'kilometers' });
      if (smoothed) {
        smoothed = turf.simplify(smoothed, { tolerance: 0.003, highQuality: true });
        results.push(smoothed);
      } else {
        results.push(merged);
      }
    } catch(e) {
      results.push(merged);
    }
  }

  return results;
}

function batchUnion(polygons) {
  if (polygons.length === 0) return null;
  if (polygons.length === 1) return polygons[0];

  const BATCH_SIZE = 100;
  let current = polygons;

  while (current.length > 1) {
    const next = [];
    for (let i = 0; i < current.length; i += BATCH_SIZE) {
      const batch = current.slice(i, i + BATCH_SIZE);
      if (batch.length === 1) { next.push(batch[0]); continue; }
      try {
        const fc = turf.featureCollection(batch);
        const united = turf.dissolve(fc);
        if (united && united.features) {
          united.features.forEach(f => next.push(f));
        } else {
          next.push(batch[0]);
        }
      } catch(e) {
        let acc = batch[0];
        for (let j = 1; j < batch.length; j++) {
          try { acc = turf.union(turf.featureCollection([acc, batch[j]])); } catch(e2) {}
        }
        next.push(acc);
      }
    }
    if (next.length === current.length) break;
    current = next;
  }

  if (current.length > 1) {
    try {
      return current.reduce((acc, f) => {
        try { return turf.union(turf.featureCollection([acc, f])); }
        catch(e) { return acc; }
      });
    } catch(e) {
      return current[0];
    }
  }

  return current[0];
}

// ─── KML GENERATION ──────────────────────────────────────────
function generateKML(districtName, geojson, zones, boundary, points) {
  const kml = [];
  kml.push('<?xml version="1.0" encoding="UTF-8"?>');
  kml.push('<kml xmlns="http://www.opengis.net/kml/2.2">');
  kml.push('<Document>');
  kml.push(`  <name>${districtName} Forest Fire Risk Zones</name>`);
  kml.push(`  <description>Forest fire density analysis for ${districtName} District, Rajasthan. Generated using KDE on NASA FIRMS data (2018-2025).</description>`);

  ZONE_STYLES.forEach((z, i) => {
    const abgr = hexToKMLColor(z.color, z.opacity);
    kml.push(`  <Style id="zone${i}">`);
    kml.push(`    <PolyStyle><color>${abgr}</color><outline>1</outline></PolyStyle>`);
    kml.push(`    <LineStyle><color>${hexToKMLColor(z.color, 0.9)}</color><width>1</width></LineStyle>`);
    kml.push(`  </Style>`);
  });

  kml.push('  <Style id="boundary">');
  kml.push('    <LineStyle><color>ccffffff</color><width>2</width></LineStyle>');
  kml.push('    <PolyStyle><fill>0</fill></PolyStyle>');
  kml.push('  </Style>');
  kml.push('  <Style id="firepoint">');
  kml.push('    <IconStyle><color>ff4444ff</color><scale>0.6</scale>');
  kml.push('      <Icon><href>http://maps.google.com/mapfiles/kml/shapes/shaded_dot.png</href></Icon>');
  kml.push('    </IconStyle>');
  kml.push('  </Style>');

  kml.push('  <Folder><name>Fire Risk Zones</name>');
  zones.forEach((zone, i) => {
    if (zone) {
      kml.push(`    <Placemark><name>${zone.properties.zone}</name><styleUrl>#zone${i}</styleUrl>`);
      kml.push(`      ${geometryToKML(zone.geometry)}`);
      kml.push(`    </Placemark>`);
    }
  });
  kml.push('  </Folder>');

  kml.push('  <Folder><name>District Boundary</name>');
  kml.push(`    <Placemark><name>${districtName} District</name><styleUrl>#boundary</styleUrl>`);
  kml.push(`      ${geometryToKML(boundary.geometry)}`);
  kml.push('    </Placemark>');
  kml.push('  </Folder>');

  kml.push('  <Folder><name>Fire Incidents</name>');
  points.forEach(pt => {
    const [lon, lat] = pt.geometry.coordinates;
    kml.push(`    <Placemark><name>Fire ${pt.properties.date}</name>`);
    kml.push(`      <description>Brightness: ${pt.properties.brightness}</description>`);
    kml.push(`      <styleUrl>#firepoint</styleUrl>`);
    kml.push(`      <Point><coordinates>${lon},${lat},0</coordinates></Point>`);
    kml.push('    </Placemark>');
  });
  kml.push('  </Folder>');

  kml.push('</Document></kml>');
  return kml.join('\n');
}

function geometryToKML(geometry) {
  if (geometry.type === 'Polygon') return polygonToKML(geometry.coordinates);
  if (geometry.type === 'MultiPolygon') {
    return `<MultiGeometry>${geometry.coordinates.map(c => polygonToKML(c)).join('')}</MultiGeometry>`;
  }
  return '';
}

function polygonToKML(coordinates) {
  let kml = '<Polygon><extrude>0</extrude><altitudeMode>clampToGround</altitudeMode>';
  coordinates.forEach((ring, i) => {
    const tag = i === 0 ? 'outerBoundaryIs' : 'innerBoundaryIs';
    const coords = ring.map(c => `${c[0]},${c[1]},0`).join(' ');
    kml += `<${tag}><LinearRing><coordinates>${coords}</coordinates></LinearRing></${tag}>`;
  });
  return kml + '</Polygon>';
}

function hexToKMLColor(hex, opacity) {
  const r = hex.substring(1, 3), g = hex.substring(3, 5), b = hex.substring(5, 7);
  const a = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return `${a}${b}${g}${r}`;
}

// ─── RUN ──────────────────────────────────────────────────────
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
