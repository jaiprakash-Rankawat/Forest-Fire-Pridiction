'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState, useRef, useEffect } from 'react';

const DistrictMapClient = dynamic(
  () => import('./DistrictMapClient'),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-[calc(100vh-300px)] min-h-[500px] bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-red-500 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Loading Fire Zone Analysis...</p>
        </div>
      </div>
    )
  }
);

const FirePointSearch = dynamic(
  () => import('../FirePointSearch'),
  { ssr: false, loading: () => <div className="h-[200px] bg-slate-900 rounded-xl animate-pulse"></div> }
);

import { RAJASTHAN_DISTRICTS } from '../../../lib/rajasthan-districts';

const DISTRICTS = RAJASTHAN_DISTRICTS.reduce((acc, d) => {
  acc[d.slug] = d;
  return acc;
}, {});

// IUCN Status color mapping
const IUCN_COLORS = {
  'Critically Endangered': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  'Endangered': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  'Vulnerable': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  'Near Threatened': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  'Least Concern': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
};

export default function DistrictAnalysisPage({ params }) {
  const { district: slug } = use(params);
  const district = DISTRICTS[slug];
  const router = useRouter();

  // Search bar state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const searchRef = useRef(null);

  const filteredDistricts = searchQuery.trim()
    ? RAJASTHAN_DISTRICTS.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.majorForest?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : RAJASTHAN_DISTRICTS.slice(0, 8);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSearchKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx(prev => Math.min(prev + 1, filteredDistricts.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlightIdx >= 0 && filteredDistricts[highlightIdx]) {
      e.preventDefault();
      router.push(`/rajasthan-fire-analysis/${filteredDistricts[highlightIdx].slug}`);
      setSearchOpen(false);
      setSearchQuery('');
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  }

  if (!district) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">District Not Found</h1>
          <p className="text-slate-400 mb-6">The district &quot;{slug}&quot; was not found.</p>
          <Link href="/rajasthan-fire-analysis" className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Get neighbor districts data
  const neighborDistricts = (district.neighbors || [])
    .map(nSlug => DISTRICTS[nSlug])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-6 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-5">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 border-b border-slate-800">
          <div>
            <Link href="/rajasthan-fire-analysis" className="text-sm text-slate-500 hover:text-slate-300 transition-colors mb-2 inline-block">
              ← Back to Rajasthan Dashboard
            </Link>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400">
              {district.name} Fire Zone Analysis
            </h1>
            <p className="text-slate-400 mt-1">Kernel Density Estimation · Risk Classification · Satellite Overlay</p>
          </div>
          <div className="flex gap-3 mt-3 md:mt-0">
            <a
              href={`/fire_zones/${slug}_fire_zones.kml`}
              download
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-red-500/25 hover:scale-105 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download KML
            </a>
          </div>
        </header>

        {/* ===== District Search Bar ===== */}
        <div ref={searchRef} className="relative z-50">
          <div className="bg-slate-900/90 border border-slate-700/50 rounded-xl p-3 backdrop-blur-sm flex items-center gap-3">
            <svg className="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search any district... (e.g. Jaipur, Udaipur, Ranthambore)"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); setHighlightIdx(-1); }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={handleSearchKeyDown}
              className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 outline-none text-sm"
              id="district-search-input"
            />
            <span className="text-xs text-slate-600 hidden sm:block">33 districts</span>
          </div>

          {/* Search Dropdown */}
          {searchOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900/95 border border-slate-700/60 rounded-xl shadow-2xl shadow-black/50 backdrop-blur-md max-h-80 overflow-y-auto">
              {filteredDistricts.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-sm">No districts found</div>
              ) : (
                filteredDistricts.map((d, idx) => {
                  const isCurrentDistrict = d.slug === slug;
                  const coverColor = d.forestCover === 'high' ? 'text-red-400' : d.forestCover === 'medium' ? 'text-orange-400' : 'text-green-400';
                  return (
                    <Link
                      key={d.slug}
                      href={`/rajasthan-fire-analysis/${d.slug}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className={`flex items-center justify-between px-4 py-3 transition-colors border-b border-slate-800/50 last:border-b-0 ${
                        highlightIdx === idx ? 'bg-orange-500/10' : isCurrentDistrict ? 'bg-slate-800/40' : 'hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{d.forestCover === 'high' ? '🌳' : d.forestCover === 'medium' ? '🌿' : '🏜️'}</span>
                        <div>
                          <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                            {d.name}
                            {isCurrentDistrict && <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-medium">Current</span>}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{d.majorForest?.split('&')[0]?.trim()}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] uppercase tracking-wider font-semibold ${coverColor}`}>
                        {d.forestCover}
                      </span>
                    </Link>
                  );
                })
              )}
            </div>
          )}
        </div>
        
        <main className="space-y-8">
          {/* Map & Charts Section */}
          <section>
            <DistrictMapClient 
              districtSlug={slug} 
              districtName={district.name}
              center={district.center}
              zoom={district.zoom}
            />
          </section>

          {/* ===== SECTION: Climate Quick Stats ===== */}
          {district.climate && (
            <section className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-cyan-500/30 transition-colors">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                Climate Profile — {district.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-slate-800/70 rounded-lg p-3.5 text-center border border-slate-700/40">
                  <div className="text-2xl mb-1.5">🌡️</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Summer Temp</div>
                  <div className="text-base font-bold text-red-400">{district.climate.avgSummerTemp}</div>
                </div>
                <div className="bg-slate-800/70 rounded-lg p-3.5 text-center border border-slate-700/40">
                  <div className="text-2xl mb-1.5">🌧️</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Annual Rain</div>
                  <div className="text-base font-bold text-blue-400">{district.climate.annualRainfall}</div>
                </div>
                <div className="bg-slate-800/70 rounded-lg p-3.5 text-center border border-slate-700/40">
                  <div className="text-2xl mb-1.5">💧</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Dry Humidity</div>
                  <div className="text-base font-bold text-yellow-400">{district.climate.humidityDrySeason}</div>
                </div>
                <div className="bg-slate-800/70 rounded-lg p-3.5 text-center border border-slate-700/40">
                  <div className="text-2xl mb-1.5">🔥</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Fire Season</div>
                  <div className="text-base font-bold text-orange-400">{district.climate.fireSeason}</div>
                </div>
                <div className="bg-slate-800/70 rounded-lg p-3.5 text-center border border-slate-700/40">
                  <div className="text-2xl mb-1.5">💨</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Wind Speed</div>
                  <div className="text-base font-bold text-teal-400">{district.climate.windSpeed}</div>
                </div>
                <div className="bg-slate-800/70 rounded-lg p-3.5 text-center border border-slate-700/40">
                  <div className="text-2xl mb-1.5">⛰️</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Terrain</div>
                  <div className="text-xs font-semibold text-slate-300 leading-snug">{district.climate.terrain}</div>
                </div>
              </div>
            </section>
          )}

          {/* ===== SECTION: Wildlife at Risk ===== */}
          {district.wildlife && district.wildlife.length > 0 && (
            <section className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-emerald-500/30 transition-colors">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-500 mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Wildlife & Biodiversity at Risk
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Forest fires directly threaten the habitats and survival of these species found in {district.name}'s forests and sanctuaries.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {district.wildlife.map((animal, idx) => {
                  const iucn = IUCN_COLORS[animal.status] || IUCN_COLORS['Least Concern'];
                  return (
                    <div key={idx} className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/40 hover:border-slate-600 transition-colors group">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{animal.icon}</div>
                      <div className="text-sm font-bold text-slate-200 mb-1.5">{animal.name}</div>
                      <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${iucn.bg} ${iucn.text} ${iucn.border}`}>
                        {animal.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Main Content Grid: 2 columns */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Topography & Ecological Profile Card */}
            <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600 transition-colors">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-500 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                Geographic & Ecological Profile
              </h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><span className="text-slate-300 font-semibold">Major Forests / Reserves:</span> <span className="text-emerald-300 font-medium">{district.majorForest}</span></li>
                <li><span className="text-slate-300 font-semibold">Forest Cover Rating:</span> <span className="capitalize">{district.forestCover}</span></li>
                <li>
                  {district.forestCover === 'high' && "This region features dense canopies and significant protected areas, often including deciduous forests in the Aravalli range or southern tribal belts. The heavy vegetative fuel load makes parts of this district highly susceptible to intense, fast-spreading fires during dry months."}
                  {district.forestCover === 'medium' && "Characterized by moderate vegetative cover including mixed scrub forests, thorny bushes, and transitional open woodlands. Fire incidents here are frequently localized but can spread through ground vegetation rapidly during peak summer heat."}
                  {district.forestCover === 'low' && "Predominantly arid, semi-arid, or desert ecology with sparse scrub vegetation. Large-scale canopy fires are rare, but localized brush fires can still occur in extreme dry and windy conditions."}
                </li>
                <li><span className="text-slate-300 font-semibold">Primary Flora:</span> {district.forestCover === 'high' ? 'Teak, Bamboo, Dhok, Salar' : district.forestCover === 'medium' ? 'Khejri, Babool, Neem, local shrubs' : 'Desert shrubs, Thor, Khejri'}</li>
              </ul>
            </div>

            {/* Zone Classification Methodology Card */}
            <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600 transition-colors">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Why are zones divided this way?
              </h3>
              <p className="text-sm text-slate-400 mb-3">
                The map classifies {district.name}'s regions into <strong className="text-red-400">Very High</strong>, <strong className="text-orange-400">High</strong>, <strong className="text-yellow-400">Moderate</strong>, and <strong className="text-green-500">Low</strong> risk zones using a statistical algorithm called <strong>Kernel Density Estimation (KDE)</strong> applied to NASA FIRMS satellite data.
              </p>
              <ul className="space-y-2 text-sm text-slate-400 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                <li><strong className="text-red-400">Very High:</strong> The algorithm detected intense, repeating, and geographically clustered historical thermal anomalies (often indicating deliberate burnings or recurring dense-biomass ignitions).</li>
                <li><strong className="text-orange-400">High & Moderate:</strong> Buffer zones where heat signatures are moderate or infrequent but physically close enough to extreme hotspots to carry "spill-over" risk.</li>
                <li><strong className="text-green-500">Low:</strong> Areas with statistically insignificant or entirely absent historical heat anomalies over the past 5-7 years.</li>
              </ul>
            </div>

            {/* Susceptibility & Human Factors Card */}
            <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600 transition-colors">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Fire Triggers & Mitigation
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  <span className="text-slate-300 font-semibold block mb-1">Common Triggers:</span>
                  Minor forest produce collection, dry grass burning by pastoralists, discarded campfires, and agricultural residue burning adjacent to forest edges.
                </p>
                <div className="h-px w-full bg-slate-800"></div>
                <p className="text-sm text-slate-400">
                  <span className="text-slate-300 font-semibold block mb-1">Impact Vectors:</span>
                  High summer temperatures (up to {district.climate?.avgSummerTemp || '45°C'}), low humidity ({district.climate?.humidityDrySeason || '15-25%'}), and hot dry winds (Loo) act as extreme catalysts for minor sparks.
                </p>
                <div className="h-px w-full bg-slate-800"></div>
                <p className="text-sm text-slate-400">
                  <span className="text-slate-300 font-semibold block mb-1">Mitigation Focus:</span>
                  Creating clear fire-lines, community awareness programs, monitoring via satellite alerts, and rapid ground-response units.
                </p>
              </div>
            </div>

            {/* Emergency Info Card */}
            <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600 transition-colors">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Emergency Contacts
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
                  <p className="text-slate-300 font-bold mb-1">State Forest Department Toll-Free</p>
                  <p className="text-2xl text-red-400 font-black tracking-widest">1800-412-××××</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Disaster Mgt</p>
                    <p className="text-lg text-slate-200 font-bold">1070</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Fire Force</p>
                    <p className="text-lg text-slate-200 font-bold">101</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                  <Link href="/report-incident" className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors inline-block w-full py-2 bg-blue-500/10 rounded-lg border border-blue-500/20 hover:bg-blue-500/20">
                    Report Fire Incident 🚨
                  </Link>
                </div>
              </div>
            </div>

          </section>

          {/* ===== SECTION: Government Response & Infrastructure ===== */}
          {district.fireInfrastructure && (
            <section className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-amber-500/30 transition-colors">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500 mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Fire Response Infrastructure — {district.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-800/60 rounded-lg p-4 text-center border border-slate-700/40">
                  <div className="text-3xl mb-2">🗼</div>
                  <div className="text-2xl font-bold text-amber-400">{district.fireInfrastructure.watchtowers}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Fire Watchtowers</div>
                </div>
                <div className="bg-slate-800/60 rounded-lg p-4 text-center border border-slate-700/40">
                  <div className="text-3xl mb-2">🚒</div>
                  <div className="text-2xl font-bold text-red-400">{district.fireInfrastructure.fireStations}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Fire Stations</div>
                </div>
                <div className="bg-slate-800/60 rounded-lg p-4 text-center border border-slate-700/40">
                  <div className="text-3xl mb-2">🏢</div>
                  <div className={`text-lg font-bold ${district.fireInfrastructure.hasForestFireCell ? 'text-green-400' : 'text-slate-500'}`}>
                    {district.fireInfrastructure.hasForestFireCell ? 'Active ✓' : 'Not Yet'}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Forest Fire Cell</div>
                </div>
                <div className="bg-slate-800/60 rounded-lg p-4 text-center border border-slate-700/40">
                  <div className="text-3xl mb-2">🛰️</div>
                  <div className="text-lg font-bold text-blue-400">NASA FIRMS</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Satellite Monitor</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4 text-center italic">
                Infrastructure data compiled from Rajasthan Forest Department reports. Satellite monitoring via NASA FIRMS is active for all districts.
              </p>
            </section>
          )}

          {/* ===== SECTION: Neighboring Districts Comparison ===== */}
          {neighborDistricts.length > 0 && (
            <section className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-indigo-500/30 transition-colors">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-500 mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Neighboring Districts
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Fire patterns don't respect administrative boundaries. Explore how {district.name}'s neighbors compare.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {neighborDistricts.map(nd => {
                  const coverColor = nd.forestCover === 'high' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                                     nd.forestCover === 'medium' ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' :
                                     'text-green-400 bg-green-500/10 border-green-500/20';
                  return (
                    <Link 
                      key={nd.slug} 
                      href={`/rajasthan-fire-analysis/${nd.slug}`}
                      className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/40 hover:border-indigo-500/40 hover:bg-slate-700/40 transition-all group text-center"
                    >
                      <div className="text-base font-bold text-slate-200 group-hover:text-indigo-400 transition-colors mb-2">
                        {nd.name}
                      </div>
                      <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${coverColor}`}>
                        {nd.forestCover} cover
                      </span>
                      <div className="text-xs text-slate-500 mt-2">{nd.majorForest?.split('&')[0]?.trim() || '—'}</div>
                      <div className="text-[10px] text-indigo-400/70 mt-2 group-hover:text-indigo-300 transition-colors flex items-center justify-center gap-1">
                        View Analysis
                        <svg className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ===== SECTION: Fire Zone Point Search ===== */}
          <FirePointSearch
            mode="district"
            districtSlug={slug}
            districtName={district.name}
            center={district.center}
          />

          {/* ===== SECTION: Did You Know? ===== */}
          {district.funFact && (
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-indigo-950/40 to-slate-900/90 border border-indigo-500/20 rounded-xl p-6 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0 mt-1">💡</div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-300 mb-2">Did You Know?</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{district.funFact}</p>
                </div>
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
