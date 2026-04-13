/**
 * Udaipur Forest Fire Density Analysis
 * 
 * Performs:
 * 1. Load boundary + fire points
 * 2. Grid-based Kernel Density Estimation (KDE)
 * 3. Classify into 4 fire risk zones
 * 4. Generate smoothed polygons via marching squares (iso-bands)
 * 5. Export as GeoJSON + KML
 */

const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

const PUBLIC = path.join(__dirname, '..', 'public');

// ─── CONFIG ───────────────────────────────────────────────────
const GRID_CELL_SIZE = 0.01;    // ~1.1km grid cells (in degrees)
const KDE_BANDWIDTH  = 0.08;    // kernel bandwidth in degrees (~8-9km)
const SMOOTH_PASSES  = 2;       // gaussian smoothing passes on the grid

// Zone thresholds (as percentile of max density)
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

// ─── MAIN ─────────────────────────────────────────────────────
async function main() {
  console.log('=== Udaipur Forest Fire Density Analysis ===\n');

  // 1. Load data
  const boundary = JSON.parse(fs.readFileSync(path.join(PUBLIC, 'udaipur_boundary.geojson'), 'utf8'));
  const csvRaw   = fs.readFileSync(path.join(PUBLIC, 'nasa_firms_data.csv'), 'utf8');
  
  const boundaryFeature = boundary.features[0];
  const bbox = turf.bbox(boundaryFeature);
  console.log(`Boundary bbox: [${bbox.map(b => b.toFixed(4)).join(', ')}]`);

  // 2. Parse fire points
  const firePoints = parseCSV(csvRaw);
  console.log(`Total fire points in CSV: ${firePoints.length}`);

  // Filter points within boundary
  const insidePoints = firePoints.filter(pt => {
    const point = turf.point([pt.longitude, pt.latitude]);
    return turf.booleanPointInPolygon(point, boundaryFeature);
  });
  console.log(`Fire points inside Udaipur: ${insidePoints.length}`);

  // If very few points inside, also use nearby points with extra weight
  let analysisPoints = insidePoints;
  if (insidePoints.length < 10) {
    console.log('Few points inside boundary. Using all points within bbox buffer for analysis.');
    const bufferedBbox = [bbox[0] - 0.1, bbox[1] - 0.1, bbox[2] + 0.1, bbox[3] + 0.1];
    analysisPoints = firePoints.filter(pt =>
      pt.longitude >= bufferedBbox[0] && pt.longitude <= bufferedBbox[2] &&
      pt.latitude >= bufferedBbox[1] && pt.latitude <= bufferedBbox[3]
    );
    console.log(`Points in buffered bbox: ${analysisPoints.length}`);
  }

  // 3. Build KDE grid
  console.log('\nComputing Kernel Density Estimation...');
  const grid = computeKDE(analysisPoints, bbox, GRID_CELL_SIZE, KDE_BANDWIDTH);
  console.log(`Grid dimensions: ${grid.cols} x ${grid.rows}`);

  // Smooth the grid
  for (let pass = 0; pass < SMOOTH_PASSES; pass++) {
    smoothGrid(grid);
  }
  console.log(`Applied ${SMOOTH_PASSES} Gaussian smoothing passes`);

  // 4. Normalize density values
  let maxDensity = 0;
  for (let i = 0; i < grid.values.length; i++) {
    if (grid.values[i] > maxDensity) maxDensity = grid.values[i];
  }
  console.log(`Max density value: ${maxDensity.toFixed(6)}`);

  // 5. Generate iso-band polygons for each zone
  console.log('\nGenerating zone polygons...');
  const zoneFeatures = [];

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
        // Clip to boundary
        try {
          combined = turf.intersect(turf.featureCollection([combined, boundaryFeature]));
        } catch(e) {
          // Keep unclipped if intersection fails
        }

        if (combined) {
          combined.properties = {
            zone: zone.name,
            color: zone.color,
            opacity: zone.opacity,
            fill: zone.color,
            'fill-opacity': zone.opacity,
            stroke: zone.color,
            'stroke-width': 1,
            'stroke-opacity': 0.8
          };
          zoneFeatures.push(combined);
          const area = turf.area(combined) / 1e6; // km²
          console.log(`  ${zone.name}: ${area.toFixed(1)} km²`);
        }
      }
    } else {
      console.log(`  ${zone.name}: no polygons generated`);
    }
  }

  // 6. Build output GeoJSON
  // Add the boundary outline as the last feature
  const boundaryOutline = JSON.parse(JSON.stringify(boundaryFeature));
  boundaryOutline.properties = {
    name: 'Udaipur District Boundary',
    stroke: '#FFFFFF',
    'stroke-width': 2,
    'stroke-opacity': 0.9,
    fill: 'none',
    'fill-opacity': 0
  };

  // Add fire points as features
  const pointFeatures = analysisPoints.map(pt => turf.point(
    [pt.longitude, pt.latitude],
    {
      date: pt.acq_date,
      brightness: pt.brightness,
      'marker-color': '#FF4444',
      'marker-size': 'small'
    }
  ));

  const outputGeoJSON = {
    type: 'FeatureCollection',
    features: [...zoneFeatures.reverse(), boundaryOutline, ...pointFeatures]
  };

  const geoPath = path.join(PUBLIC, 'fire_zones_udaipur.geojson');
  fs.writeFileSync(geoPath, JSON.stringify(outputGeoJSON, null, 2));
  console.log(`\nSaved GeoJSON: ${geoPath}`);

  // 7. Generate KML
  console.log('\nGenerating KML...');
  const kml = generateKML(outputGeoJSON, zoneFeatures, boundaryFeature, pointFeatures);
  const kmlPath = path.join(PUBLIC, 'udaipur_fire_zones.kml');
  fs.writeFileSync(kmlPath, kml);
  console.log(`Saved KML: ${kmlPath}`);

  console.log('\n=== Analysis Complete ===');
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
      latitude: lat,
      longitude: lng,
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
    // Weight by brightness (higher brightness = larger fire)
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
        
        // Gaussian kernel
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
  // 3x3 Gaussian kernel weights
  const k = [1, 2, 1, 2, 4, 2, 1, 2, 1];
  const kSum = 16;

  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      let sum = 0;
      let ki = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          sum += values[(r + dr) * cols + (c + dc)] * k[ki++];
        }
      }
      out[r * cols + c] = sum / kSum;
    }
  }

  // Copy back
  for (let i = 0; i < values.length; i++) {
    if (out[i] > 0) values[i] = out[i];
  }
}

// ─── CONTOUR POLYGON EXTRACTION (Marching Squares) ───────────
function extractContourPolygons(grid, threshold, bbox, boundaryFeature) {
  const { values, cols, rows, x0, y0, cellSize } = grid;
  
  // Create a grid of points for turf
  const gridPoints = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const val = values[r * cols + c];
      if (val >= threshold) {
        const lon = x0 + (c + 0.5) * cellSize;
        const lat = y0 + (r + 0.5) * cellSize;
        gridPoints.push(turf.point([lon, lat], { density: val }));
      }
    }
  }

  if (gridPoints.length === 0) return [];

  // Use cell-based approach: create small polygons for each cell above threshold
  // then union them together
  const cellPolygons = [];
  const halfCell = cellSize * 0.55; // slight overlap for smoother joins

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

  // Batch union cells in groups to avoid stack overflow
  let merged = batchUnion(cellPolygons);
  
  // Buffer slightly to smooth edges, then simplify
  const results = [];
  if (merged) {
    try {
      // Positive buffer then negative to smooth jagged edges
      let smoothed = turf.buffer(merged, 1.5, { units: 'kilometers' });
      smoothed = turf.buffer(smoothed, -0.8, { units: 'kilometers' });
      if (smoothed) {
        // Simplify to reduce noise
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
      if (batch.length === 1) {
        next.push(batch[0]);
        continue;
      }
      try {
        const fc = turf.featureCollection(batch);
        const united = turf.dissolve(fc);
        if (united && united.features) {
          // dissolve returns a FeatureCollection
          united.features.forEach(f => next.push(f));
        } else {
          next.push(batch[0]);
        }
      } catch(e) {
        // Fallback: try sequential union
        let acc = batch[0];
        for (let j = 1; j < batch.length; j++) {
          try {
            acc = turf.union(turf.featureCollection([acc, batch[j]]));
          } catch(e2) { /* skip */ }
        }
        next.push(acc);
      }
    }
    if (next.length === current.length) break; // no more merging
    current = next;
  }

  // Final merge if still multiple
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
function generateKML(geojson, zones, boundary, points) {
  const kml = [];
  kml.push('<?xml version="1.0" encoding="UTF-8"?>');
  kml.push('<kml xmlns="http://www.opengis.net/kml/2.2">');
  kml.push('<Document>');
  kml.push('  <name>Udaipur Forest Fire Risk Zones</name>');
  kml.push('  <description>Forest fire density analysis for Udaipur District, Rajasthan, India. Generated using Kernel Density Estimation on NASA FIRMS data (2018-2025).</description>');

  // Styles for zones
  ZONE_STYLES.forEach((z, i) => {
    const abgr = hexToKMLColor(z.color, z.opacity);
    kml.push(`  <Style id="zone${i}">`);
    kml.push(`    <PolyStyle>`);
    kml.push(`      <color>${abgr}</color>`);
    kml.push(`      <outline>1</outline>`);
    kml.push(`    </PolyStyle>`);
    kml.push(`    <LineStyle>`);
    kml.push(`      <color>${hexToKMLColor(z.color, 0.9)}</color>`);
    kml.push(`      <width>1</width>`);
    kml.push(`    </LineStyle>`);
    kml.push(`  </Style>`);
  });

  // Boundary style
  kml.push('  <Style id="boundary">');
  kml.push('    <LineStyle><color>ccffffff</color><width>2</width></LineStyle>');
  kml.push('    <PolyStyle><fill>0</fill></PolyStyle>');
  kml.push('  </Style>');

  // Fire point style
  kml.push('  <Style id="firepoint">');
  kml.push('    <IconStyle>');
  kml.push('      <color>ff4444ff</color>');
  kml.push('      <scale>0.6</scale>');
  kml.push('      <Icon><href>http://maps.google.com/mapfiles/kml/shapes/shaded_dot.png</href></Icon>');
  kml.push('    </IconStyle>');
  kml.push('  </Style>');

  // Zone Folder
  kml.push('  <Folder>');
  kml.push('    <name>Fire Risk Zones</name>');
  zones.forEach((zone, i) => {
    if (zone) {
      kml.push(`    <Placemark>`);
      kml.push(`      <name>${zone.properties.zone}</name>`);
      kml.push(`      <styleUrl>#zone${i}</styleUrl>`);
      kml.push(`      ${geometryToKML(zone.geometry)}`);
      kml.push(`    </Placemark>`);
    }
  });
  kml.push('  </Folder>');

  // Boundary
  kml.push('  <Folder>');
  kml.push('    <name>District Boundary</name>');
  kml.push('    <Placemark>');
  kml.push('      <name>Udaipur District</name>');
  kml.push('      <styleUrl>#boundary</styleUrl>');
  kml.push(`      ${geometryToKML(boundary.geometry)}`);
  kml.push('    </Placemark>');
  kml.push('  </Folder>');

  // Fire Points
  kml.push('  <Folder>');
  kml.push('    <name>Fire Incidents</name>');
  points.forEach(pt => {
    const [lon, lat] = pt.geometry.coordinates;
    kml.push('    <Placemark>');
    kml.push(`      <name>Fire ${pt.properties.date}</name>`);
    kml.push(`      <description>Brightness: ${pt.properties.brightness}</description>`);
    kml.push('      <styleUrl>#firepoint</styleUrl>');
    kml.push(`      <Point><coordinates>${lon},${lat},0</coordinates></Point>`);
    kml.push('    </Placemark>');
  });
  kml.push('  </Folder>');

  kml.push('</Document>');
  kml.push('</kml>');

  return kml.join('\n');
}

function geometryToKML(geometry) {
  if (geometry.type === 'Polygon') {
    return polygonToKML(geometry.coordinates);
  } else if (geometry.type === 'MultiPolygon') {
    const parts = geometry.coordinates.map(coords => polygonToKML(coords));
    return `<MultiGeometry>${parts.join('')}</MultiGeometry>`;
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
  kml += '</Polygon>';
  return kml;
}

function hexToKMLColor(hex, opacity) {
  // KML uses AABBGGRR format
  const r = hex.substring(1, 3);
  const g = hex.substring(3, 5);
  const b = hex.substring(5, 7);
  const a = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return `${a}${b}${g}${r}`;
}

// ─── RUN ──────────────────────────────────────────────────────
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
