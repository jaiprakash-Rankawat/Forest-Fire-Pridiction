import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Cache so we only parse the CSV once per server lifetime
let _cache = null;

export async function GET() {
  if (_cache) return NextResponse.json(_cache);

  try {
    const filePath = path.join(process.cwd(), 'public', 'firms_rajasthan.csv');
    const text = await fs.readFile(filePath, 'utf-8');

    const lines = text.trim().split('\n');
    const dataLines = lines.slice(1).filter(l => l.trim() !== ''); // skip header

    const districtMap = {};
    const yearSet = new Set();

    dataLines.forEach(line => {
      const parts = line.split(',');
      const date = parts[2]?.trim();
      const district = parts[4]?.trim();
      const year = date ? parseInt(date.slice(0, 4), 10) : NaN;

      if (!district || isNaN(year)) return;

      districtMap[district] = (districtMap[district] || 0) + 1;
      yearSet.add(year);
    });

    const totalRecords = dataLines.length;
    const districtsAffected = Object.keys(districtMap).length;
    const years = [...yearSet].sort();

    // Top district by count
    const topDistrict = Object.entries(districtMap)
      .sort((a, b) => b[1] - a[1])[0];

    _cache = {
      totalRecords,          // e.g. 947  — the ONE canonical number for all pages
      districtsAffected,     // 33
      yearRange: `${years[0]}–${years[years.length - 1]}`,
      yearsCount: years.length,
      topDistrict: {
        slug: topDistrict[0],
        name: topDistrict[0].split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
        count: topDistrict[1],
      },
      districtCounts: districtMap, // { "ajmer": 22, "dungarpur": 73, ... }
    };

    return NextResponse.json(_cache);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
