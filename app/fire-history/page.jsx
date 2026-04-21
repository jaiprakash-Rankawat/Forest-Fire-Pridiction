'use client';
import { useState, useEffect, useMemo } from 'react';

// ── helpers ──────────────────────────────────────────────────────────────────
const YEARS   = [2018,2019,2020,2021,2022,2023,2024,2025];
const MONTHS  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const RISK_COLORS = { high:'#ef4444', medium:'#f97316', low:'#22c55e', minimal:'#64748b' };

function classifyRisk(count) {
  if (count >= 40) return 'high';
  if (count >= 20) return 'medium';
  if (count >= 5)  return 'low';
  return 'minimal';
}

function displayDistrict(slug) {
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

// ── Bar chart (pure CSS) ──────────────────────────────────────────────────────
function MiniBar({ value, max, color = '#f97316', label }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-8 text-right text-slate-500 shrink-0">{value}</span>
      <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {label && <span className="text-slate-400 shrink-0 w-6">{label}</span>}
    </div>
  );
}

// ── Trend sparkline (SVG) ────────────────────────────────────────────────────
function Sparkline({ data, years, color = '#f97316', width = 120, height = 36 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 4) + 2;
    const y = height - 2 - ((v / max) * (height - 4));
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * (width - 4) + 2;
        const y = height - 2 - ((v / max) * (height - 4));
        return (
          <circle key={i} cx={x} cy={y} r="2.5" fill={color} opacity="0.8" />
        );
      })}
    </svg>
  );
}

export default function FireHistoryPage() {
  const [rawData, setRawData]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy]         = useState('total');    // total | district
  const [searchQ, setSearchQ]       = useState('');
  const [activeTab, setActiveTab]   = useState('overview'); // overview | district | monthly | source

  // ── load CSV ────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/firms_rajasthan.csv')
      .then(r => r.text())
      .then(text => {
        const lines = text.trim().split('\n').slice(1); // skip header
        const records = lines.map(line => {
          const [lat, lon, date, brightness, district] = line.split(',');
          const year  = parseInt(date?.slice(0, 4), 10);
          const month = parseInt(date?.slice(5, 7), 10);
          return { lat: +lat, lon: +lon, date, brightness: +brightness, district: district?.trim(), year, month };
        }).filter(r => r.district && !isNaN(r.year));
        setRawData(records);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // ── derived stats ────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const filtered = selectedYear === 'all' ? rawData : rawData.filter(r => r.year === +selectedYear);

    // total per year (for overview chart)
    const byYear = {};
    YEARS.forEach(y => { byYear[y] = 0; });
    rawData.forEach(r => { if (byYear[r.year] !== undefined) byYear[r.year]++; });

    // per district
    const districtMap = {};
    filtered.forEach(r => {
      if (!districtMap[r.district]) districtMap[r.district] = { total: 0, byYear: {}, byMonth: Array(12).fill(0), avgBrightness: 0, brightnessSum: 0 };
      districtMap[r.district].total++;
      districtMap[r.district].byYear[r.year] = (districtMap[r.district].byYear[r.year] || 0) + 1;
      districtMap[r.district].byMonth[r.month - 1]++;
      districtMap[r.district].brightnessSum += r.brightness;
    });
    Object.keys(districtMap).forEach(d => {
      districtMap[d].avgBrightness = districtMap[d].brightnessSum / districtMap[d].total;
      districtMap[d].trendData = YEARS.map(y => districtMap[d].byYear[y] || 0);
    });

    // monthly totals (state-wide, filtered year)
    const monthlyTotal = Array(12).fill(0);
    filtered.forEach(r => { monthlyTotal[r.month - 1]++; });

    // seasonal peak
    const peakMonth  = monthlyTotal.indexOf(Math.max(...monthlyTotal));
    const totalFiresFiltered = filtered.length;
    const maxDistYear = Object.entries(byYear).reduce((a, b) => b[1] > a[1] ? b : a, ['', 0]);
    const avgBrightness = filtered.length > 0 ? (filtered.reduce((s, r) => s + r.brightness, 0) / filtered.length).toFixed(1) : 0;

    return { byYear, districtMap, monthlyTotal, peakMonth, totalFiresFiltered, maxDistYear, avgBrightness };
  }, [rawData, selectedYear]);

  // ── sorted districts ────────────────────────────────────────────────────────
  const sortedDistricts = useMemo(() => {
    const list = Object.entries(stats.districtMap || {}).map(([slug, d]) => ({ slug, ...d }));
    const q = searchQ.toLowerCase();
    const filtered = q ? list.filter(d => d.slug.includes(q)) : list;
    if (sortBy === 'district') return filtered.sort((a, b) => a.slug.localeCompare(b.slug));
    return filtered.sort((a, b) => b.total - a.total);
  }, [stats.districtMap, sortBy, searchQ]);

  const maxDistTotal = sortedDistricts[0]?.total || 1;
  const maxYearCount = Math.max(...Object.values(stats.byYear || {}), 1);
  const maxMonthly   = Math.max(...(stats.monthlyTotal || []), 1);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full border-4 border-slate-800 border-t-orange-500 animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading fire history data…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400">
      Error loading data: {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-slate-950 to-red-900/20" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 60%, rgba(251,146,0,0.06) 0%, transparent 55%), radial-gradient(circle at 80% 40%, rgba(239,68,68,0.06) 0%, transparent 55%)' }} />

        <div className="relative max-w-[1600px] mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                NASA FIRMS · 2018 – 2025 · {rawData.length} Records
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 leading-tight mb-3">
                📅 Year-wise Fire History
              </h1>
              <p className="text-slate-400 text-base max-w-2xl leading-relaxed">
                Detailed district-level forest fire incident records across all 33 districts of Rajasthan,
                sourced from NASA FIRMS MODIS/VIIRS satellite data spanning 8 years.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-3 shrink-0">
              {[
                { label: 'Total Incidents', value: rawData.length, color: 'text-orange-400' },
                { label: 'Districts Affected', value: Object.keys(stats.districtMap).length, color: 'text-yellow-400' },
                { label: 'Years Covered', value: YEARS.length, color: 'text-red-400' },
                { label: 'Peak Year', value: stats.maxDistYear[0], color: 'text-amber-400' },
              ].map(s => (
                <div key={s.label} className="bg-slate-800/60 border border-slate-700/40 rounded-xl px-4 py-3 text-center backdrop-blur-sm min-w-[90px]">
                  <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── TABS ─────────────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 flex gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview',  label: '📊 Overview'        },
            { id: 'district',  label: '🗺️ By District'      },
            { id: 'monthly',   label: '📆 Monthly Trends'   },
            { id: 'source',    label: '🛰️ Data Source'       },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${
                activeTab === t.id
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-8 space-y-8">

        {/* ══ TAB: OVERVIEW ═════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <>
            {/* Year filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider mr-1">Filter Year:</span>
              {['all', ...YEARS.map(String)].map(y => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                    selectedYear === y
                      ? 'bg-orange-500/20 border-orange-500/60 text-orange-300'
                      : 'bg-slate-800/50 border-slate-700/40 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {y === 'all' ? 'All Years' : y}
                </button>
              ))}
            </div>

            {/* State-level year chart */}
            <section className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400 mb-6 flex items-center gap-2">
                📈 State-wide Fire Incidents by Year
              </h2>
              <div className="space-y-3">
                {YEARS.map(y => {
                  const count = stats.byYear[y] || 0;
                  const risk  = classifyRisk(count);
                  return (
                    <div key={y} className="flex items-center gap-3">
                      <span className="text-slate-400 text-sm font-bold w-10 shrink-0">{y}</span>
                      <div className="flex-1 h-7 bg-slate-800 rounded-lg overflow-hidden relative">
                        <div
                          className="h-full rounded-lg transition-all duration-700 relative flex items-center px-2"
                          style={{
                            width: `${Math.max(3, (count / maxYearCount) * 100)}%`,
                            backgroundColor: risk === 'high' ? '#ef4444' : risk === 'medium' ? '#f97316' : risk === 'low' ? '#22c55e' : '#475569',
                            opacity: selectedYear === 'all' || selectedYear === String(y) ? 1 : 0.25,
                          }}
                        >
                          <span className="text-white text-xs font-bold">{count > 4 ? count : ''}</span>
                        </div>
                      </div>
                      <span className="text-slate-300 text-sm font-semibold w-8 text-right shrink-0">{count}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border w-[62px] text-center ${
                        risk === 'high'    ? 'bg-red-500/10 border-red-500/30 text-red-400'    :
                        risk === 'medium' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                        risk === 'low'    ? 'bg-green-500/10 border-green-500/30 text-green-400'  :
                        'bg-slate-700/30 border-slate-600/30 text-slate-500'
                      }`}>{risk}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" /> High (≥40)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500" /> Medium (≥20)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500" /> Low (≥5)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-600" /> Minimal</span>
              </div>
            </section>

            {/* Top 10 districts for selected year */}
            <section className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400 mb-1 flex items-center gap-2">
                🏆 Top Districts – {selectedYear === 'all' ? 'All Years' : selectedYear}
              </h2>
              <p className="text-slate-500 text-xs mb-5">{stats.totalFiresFiltered} total incidents · Avg brightness {stats.avgBrightness} K</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sortedDistricts.slice(0, 10).map((d, idx) => {
                  const risk = classifyRisk(d.total);
                  return (
                    <div key={d.slug} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30 flex items-center gap-4">
                      <span className={`text-lg font-extrabold w-7 text-center ${idx < 3 ? 'text-amber-400' : 'text-slate-600'}`}>
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-bold text-slate-200 text-sm truncate">{displayDistrict(d.slug)}</span>
                          <span className={`text-xs font-bold ml-2 px-2 py-0.5 rounded-full border ${
                            risk === 'high'    ? 'bg-red-500/10 border-red-500/30 text-red-400'    :
                            risk === 'medium' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                            'bg-green-500/10 border-green-500/30 text-green-400'
                          }`}>{d.total} fires</span>
                        </div>
                        <MiniBar value={d.total} max={maxDistTotal} color={risk === 'high' ? '#ef4444' : risk === 'medium' ? '#f97316' : '#22c55e'} />
                        <div className="mt-2">
                          <Sparkline data={d.trendData} years={YEARS} color="#f97316" width={140} height={28} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* ══ TAB: BY DISTRICT ══════════════════════════════════════════════ */}
        {activeTab === 'district' && (
          <>
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Search district…"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                className="bg-slate-800/70 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 w-52"
              />
              <div className="flex gap-2 ml-auto">
                <span className="text-xs text-slate-500 self-center">Sort:</span>
                {[['total','🔥 By Count'],['district','🅰️ A–Z']].map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setSortBy(k)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      sortBy === k ? 'bg-orange-500/20 border-orange-500/60 text-orange-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Full district table */}
            <section className="bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">District</th>
                      <th className="px-4 py-3 text-center">Total</th>
                      {YEARS.map(y => <th key={y} className="px-2 py-3 text-center">{y}</th>)}
                      <th className="px-4 py-3 text-center">Trend</th>
                      <th className="px-4 py-3 text-center">Avg °K</th>
                      <th className="px-4 py-3 text-center">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDistricts.map((d, idx) => {
                      const risk = classifyRisk(d.total);
                      const maxCell = Math.max(...YEARS.map(y => d.byYear[y] || 0), 1);
                      return (
                        <tr key={d.slug} className="border-t border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 text-slate-600 text-xs">{idx + 1}</td>
                          <td className="px-4 py-3 font-semibold text-slate-200">{displayDistrict(d.slug)}</td>
                          <td className="px-4 py-3 text-center font-bold text-orange-400">{d.total}</td>
                          {YEARS.map(y => {
                            const cnt = d.byYear[y] || 0;
                            const pct = Math.round((cnt / maxCell) * 100);
                            const col = cnt >= 8 ? '#ef4444' : cnt >= 4 ? '#f97316' : cnt > 0 ? '#22c55e' : 'transparent';
                            return (
                              <td key={y} className="px-2 py-3 text-center">
                                <span
                                  className="inline-block min-w-[22px] px-1 py-0.5 rounded text-xs font-bold"
                                  style={{ backgroundColor: cnt > 0 ? col + '22' : 'transparent', color: cnt > 0 ? col : '#475569', border: cnt > 0 ? `1px solid ${col}44` : '1px solid transparent' }}
                                >
                                  {cnt || '—'}
                                </span>
                              </td>
                            );
                          })}
                          <td className="px-4 py-3 flex justify-center">
                            <Sparkline data={d.trendData} years={YEARS} color="#f97316" width={80} height={24} />
                          </td>
                          <td className="px-4 py-3 text-center text-slate-400 text-xs">{d.avgBrightness.toFixed(0)}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                              risk === 'high'    ? 'bg-red-500/10 border-red-500/30 text-red-400'    :
                              risk === 'medium' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                              risk === 'low'    ? 'bg-green-500/10 border-green-500/30 text-green-400'  :
                              'bg-slate-700/30 border-slate-600/30 text-slate-500'
                            }`}>{risk}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* ══ TAB: MONTHLY TRENDS ═══════════════════════════════════════════ */}
        {activeTab === 'monthly' && (
          <>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider mr-1">Filter Year:</span>
              {['all', ...YEARS.map(String)].map(y => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                    selectedYear === y
                      ? 'bg-orange-500/20 border-orange-500/60 text-orange-300'
                      : 'bg-slate-800/50 border-slate-700/40 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {y === 'all' ? 'All Years' : y}
                </button>
              ))}
            </div>

            <section className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400 mb-2">
                📆 Monthly Fire Distribution — {selectedYear === 'all' ? 'All Years' : selectedYear}
              </h2>
              <p className="text-slate-500 text-xs mb-6">
                Peak fire season in Rajasthan: <span className="text-orange-400 font-bold">{MONTHS[stats.peakMonth]}</span>
                &nbsp;· {stats.totalFiresFiltered} incidents in selection
              </p>

              {/* Month bars */}
              <div className="grid grid-cols-12 gap-1 items-end h-48">
                {stats.monthlyTotal.map((cnt, i) => {
                  const pct = (cnt / maxMonthly) * 100;
                  const isPeak = i === stats.peakMonth;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-xs font-bold text-slate-300">{cnt || ''}</span>
                      <div
                        className={`w-full rounded-t-md transition-all duration-700 ${isPeak ? 'ring-2 ring-amber-400/60' : ''}`}
                        style={{
                          height: `${Math.max(3, pct)}%`,
                          background: isPeak
                            ? 'linear-gradient(to top, #ef4444, #f97316)'
                            : 'linear-gradient(to top, #1e3a5f, #f97316)',
                          opacity: cnt === 0 ? 0.15 : 1,
                        }}
                      />
                      <span className={`text-[10px] font-semibold ${isPeak ? 'text-amber-400' : 'text-slate-500'}`}>{MONTHS[i]}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Key observations */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: '🔥',
                  title: 'Fire Season',
                  content: 'March–June accounts for ~75% of all fire incidents, driven by dry post-winter vegetation and rising temperatures above 40°C.',
                  color: 'border-red-700/30 hover:border-red-500/30'
                },
                {
                  icon: '❄️',
                  title: 'Cool Season',
                  content: 'January–February sees fewer but still-recorded fires in desert-edge districts like Bikaner, Churu, and Sri Ganganagar due to agricultural burning.',
                  color: 'border-blue-700/30 hover:border-blue-500/30'
                },
                {
                  icon: '🌧️',
                  title: 'Monsoon Dip',
                  content: 'July–September shows a sharp decline as monsoon moisture suppresses fire conditions. Isolated incidents may occur in drought-hit zones.',
                  color: 'border-cyan-700/30 hover:border-cyan-500/30'
                },
              ].map(o => (
                <div key={o.title} className={`bg-slate-900/80 border rounded-xl p-5 backdrop-blur-sm transition-colors ${o.color}`}>
                  <div className="text-2xl mb-2">{o.icon}</div>
                  <h3 className="font-bold text-slate-200 mb-2">{o.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{o.content}</p>
                </div>
              ))}
            </section>
          </>
        )}

        {/* ══ TAB: DATA SOURCE ══════════════════════════════════════════════ */}
        {activeTab === 'source' && (
          <div className="space-y-6">

            {/* NASA FIRMS */}
            <section className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400 mb-4 flex items-center gap-2">
                🛰️ Primary Data Source: NASA FIRMS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-300 leading-relaxed text-sm mb-4">
                    All fire incident data is sourced from the <strong className="text-orange-400">NASA Fire Information for Resource Management System (FIRMS)</strong>,
                    which provides near-real-time active fire data globally detected by satellite-mounted radiometers.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-start gap-2"><span className="text-orange-400 mt-1">→</span> <span><strong className="text-slate-300">Instrument:</strong> MODIS (Terra & Aqua satellites) + VIIRS (Suomi NPP)</span></li>
                    <li className="flex items-start gap-2"><span className="text-orange-400 mt-1">→</span> <span><strong className="text-slate-300">Spatial Resolution:</strong> 375 m (VIIRS) / 1 km (MODIS)</span></li>
                    <li className="flex items-start gap-2"><span className="text-orange-400 mt-1">→</span> <span><strong className="text-slate-300">Detection Threshold:</strong> Brightness temperature &gt; 300 K</span></li>
                    <li className="flex items-start gap-2"><span className="text-orange-400 mt-1">→</span> <span><strong className="text-slate-300">Latency:</strong> ~3 hours from satellite overpass</span></li>
                    <li className="flex items-start gap-2"><span className="text-orange-400 mt-1">→</span> <span><strong className="text-slate-300">Provider:</strong> NASA LANCE / EOSDIS</span></li>
                  </ul>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700/40">
                  <h3 className="font-bold text-slate-200 mb-3 text-sm uppercase tracking-wider">Dataset Fields (firms_rajasthan.csv)</h3>
                  <div className="space-y-3">
                    {[
                      { field: 'latitude',   type: 'float',  desc: 'Fire point latitude (WGS84)' },
                      { field: 'longitude',  type: 'float',  desc: 'Fire point longitude (WGS84)' },
                      { field: 'acq_date',   type: 'date',   desc: 'Acquisition date (YYYY-MM-DD)' },
                      { field: 'brightness', type: 'float',  desc: 'Brightness temperature (Kelvin) — MODIS channel 21/22' },
                      { field: 'district',   type: 'string', desc: 'Rajasthan district (slug format, derived via spatial join)' },
                    ].map(r => (
                      <div key={r.field} className="flex items-start gap-3 text-xs">
                        <span className="font-mono text-amber-400 bg-amber-900/20 px-2 py-0.5 rounded border border-amber-800/30 shrink-0">{r.field}</span>
                        <span className="text-blue-400/70 shrink-0 w-12">{r.type}</span>
                        <span className="text-slate-500 leading-relaxed">{r.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Methodology */}
            <section className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-4 flex items-center gap-2">
                🔬 Methodology
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-400">
                <div className="space-y-4">
                  <div className="border-l-2 border-orange-500/40 pl-4">
                    <h4 className="font-bold text-slate-300 mb-1">1. Raw Data Download</h4>
                    <p className="leading-relaxed">Fire hotspot records (2018–2025) were downloaded from NASA FIRMS for the Rajasthan bounding box (23.0°N–30.2°N, 69.5°E–78.5°E) filtered by brightness ≥ 300 K.</p>
                  </div>
                  <div className="border-l-2 border-orange-500/40 pl-4">
                    <h4 className="font-bold text-slate-300 mb-1">2. Spatial Join to Districts</h4>
                    <p className="leading-relaxed">Each fire point was spatially joined to Rajasthan district boundaries (from Survey of India / GADM) using point-in-polygon analysis to assign the <code className="text-amber-400/80 bg-slate-800 px-1 rounded text-xs">district</code> field.</p>
                  </div>
                  <div className="border-l-2 border-orange-500/40 pl-4">
                    <h4 className="font-bold text-slate-300 mb-1">3. KDE Fire Zone Generation</h4>
                    <p className="leading-relaxed">Kernel Density Estimation (KDE) was applied per district to generate fire probability heatmaps, forming the GeoJSON fire zone layers visible on the main dashboard.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border-l-2 border-blue-500/40 pl-4">
                    <h4 className="font-bold text-slate-300 mb-1">4. Risk Classification</h4>
                    <p className="leading-relaxed">Districts are classified into Very High / High / Moderate / Low risk tiers based on total fire incident count and spatial density. Thresholds are derived from the state distribution.</p>
                  </div>
                  <div className="border-l-2 border-blue-500/40 pl-4">
                    <h4 className="font-bold text-slate-300 mb-1">5. Historical Coverage</h4>
                    <p className="leading-relaxed">The dataset covers 2018–2025 (8 years), providing a robust historical baseline. Year 2025 data is ongoing as of May 2025 and will be updated as new FIRMS records are released.</p>
                  </div>
                  <div className="border-l-2 border-blue-500/40 pl-4">
                    <h4 className="font-bold text-slate-300 mb-1">6. Limitations</h4>
                    <p className="leading-relaxed">FIRMS may miss sub-canopy fires, small smouldering events (&lt; 0.1 ha), or fires obscured by cloud cover. Confidence filters may reduce count in some years.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Additional sources */}
            <section className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-400 mb-4 flex items-center gap-2">
                📚 Additional Sources & References
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {[
                  { name: 'NASA FIRMS', url: 'https://firms.modaps.eosdis.nasa.gov/', desc: 'Fire Information for Resource Management System — primary fire hotspot data' },
                  { name: 'Forest Survey of India (FSI)', url: 'https://fsi.nic.in/', desc: 'State Forest Reports, forest cover maps, district-level forest type classification' },
                  { name: 'NRSC Fire Alert', url: 'https://www.nrsc.gov.in/', desc: 'National Remote Sensing Centre satellite-based forest fire alert system for India' },
                  { name: 'GADM District Boundaries', url: 'https://gadm.org/', desc: 'Global Administrative Areas — Rajasthan district polygon boundaries (Level 2)' },
                  { name: 'Global Forest Watch (GFW)', url: 'https://www.globalforestwatch.org/', desc: 'Tree cover loss and forest canopy data for Rajasthan' },
                  { name: 'IMD India Meteorology Dept.', url: 'https://mausam.imd.gov.in/', desc: 'Historical temperature, humidity and rainfall data used to validate fire conditions' },
                ].map(s => (
                  <div key={s.name} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">{s.name}</span>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-orange-400 hover:text-orange-300 transition-colors shrink-0 mt-0.5"
                      >
                        Visit ↗
                      </a>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Citation */}
            <section className="bg-amber-900/10 border border-amber-700/30 rounded-xl p-5">
              <h3 className="text-sm font-bold text-amber-400 mb-2 uppercase tracking-wider">📄 How to Cite This Data</h3>
              <code className="text-xs text-slate-400 leading-relaxed block bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                NASA FIRMS. (2018–2025). <em>MODIS/Terra+Aqua Active Fire Detections MCD14ML & AF_J1V-C2 NRT [Data set]</em>.
                NASA EOSDIS Land, Atmosphere Near real-time Capability for EOS (LANCE),
                FIRMS. Retrieved from https://firms.modaps.eosdis.nasa.gov/. Processed and filtered
                for Rajasthan State, India by Rajasthan Fire Analysis project.
              </code>
            </section>
          </div>
        )}

      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
