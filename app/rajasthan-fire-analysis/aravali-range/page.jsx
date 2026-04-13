'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
const FirePointSearch = dynamic(
  () => import('../FirePointSearch'),
  { ssr: false, loading: () => <div className="h-[200px] bg-slate-900 rounded-xl animate-pulse"></div> }
);

const AravaliMapClient = dynamic(
  () => import('./AravaliMapClient'),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-[calc(100vh-300px)] min-h-[500px] bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-red-500 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Loading Aravali Range Fire Analysis...</p>
        </div>
      </div>
    )
  }
);

// Districts that the Aravalli Range passes through
const ARAVALLI_DISTRICTS = [
  'Sirohi', 'Pali', 'Rajsamand', 'Udaipur', 'Bhilwara', 'Ajmer', 
  'Jaipur', 'Sikar', 'Alwar', 'Dausa'
];

const ARAVALLI_SLUGS = ARAVALLI_DISTRICTS.map(d => d.toLowerCase().replace(/\s+/g, '-'));

export default function AravaliRangePage() {
  const [fireData, setFireData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFireData() {
      try {
        // Load district summary data
        const response = await fetch('/fire_zones/district_summary.json');
        const summaryData = await response.json();
        
        // Calculate Aravalli range totals
        let totalFirePoints = 0;
        let districtData = [];
        
        ARAVALLI_DISTRICTS.forEach(districtName => {
          const slug = districtName.toLowerCase().replace(/\s+/g, '-');
          const data = summaryData[slug];
          if (data) {
            totalFirePoints += data.firePoints || 0;
            districtData.push({
              name: districtName,
              slug: slug,
              firePoints: data.firePoints || 0,
              riskLevel: data.riskLevel || 'Unknown'
            });
          }
        });

        // Calculate total state fire points (all 33 districts)
        let stateTotal = 0;
        Object.values(summaryData).forEach(d => {
          stateTotal += d.firePoints || 0;
        });

        setFireData({
          totalFirePoints,
          stateTotal,
          districts: districtData.sort((a, b) => b.firePoints - a.firePoints),
          districtCount: ARAVALLI_DISTRICTS.length
        });
      } catch (error) {
        console.error('Error loading fire data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFireData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-6 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-5">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 border-b border-slate-800">
          <div>
            <Link href="/rajasthan-fire-analysis" className="text-sm text-slate-500 hover:text-slate-300 transition-colors mb-2 inline-block">
              &larr; Back to Rajasthan Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400">
              <span className="text-2xl">-</span> Aravali Range Fire Analysis
            </h1>
            <p className="text-slate-400 mt-1">Comprehensive fire zone mapping across Rajasthan's ancient mountain spine</p>
          </div>
          <div className="flex gap-3 mt-3 md:mt-0">
            <div className="px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-yellow-400">{ARAVALLI_DISTRICTS.length}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Districts</div>
            </div>
            <div className="px-4 py-2 bg-slate-800/60 border border-orange-500/40 rounded-lg text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-orange-400">{loading ? '...' : fireData?.totalFirePoints?.toLocaleString() || 0}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Fire Points</div>
            </div>
          </div>
        </header>

        <main className="space-y-8">
          {/* Map Section */}
          <section>
            <AravaliMapClient />
          </section>

          {/* Summary Stats */}
          {!loading && fireData && (
            <section className="bg-gradient-to-br from-slate-900/90 via-yellow-950/20 to-slate-900/90 border border-yellow-600/30 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 mb-4 flex items-center gap-2">
                <span className="text-2xl">-</span> Aravali Range Fire Summary
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{fireData.totalFirePoints.toLocaleString()}</div>
                  <div className="text-sm text-slate-400">Total Fire Incidents</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">{Math.round(fireData.totalFirePoints / fireData.districtCount)}</div>
                  <div className="text-sm text-slate-400">Average per District</div>
                </div>
                <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">{fireData.stateTotal > 0 ? Math.round((fireData.totalFirePoints / fireData.stateTotal) * 100) : 0}%</div>
                  <div className="text-sm text-slate-400">of State Total</div>
                </div>
              </div>
            </section>
          )}

          {/* District Breakdown */}
          {!loading && fireData && (
            <section className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500 mb-4">
                Fire Points by Aravalli District
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {fireData.districts.map((district, idx) => (
                  <Link
                    key={district.slug}
                    href={`/rajasthan-fire-analysis/${district.slug}`}
                    className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/40 hover:border-orange-500/40 hover:bg-slate-700/40 transition-all group text-center"
                  >
                    <div className="text-lg font-bold text-slate-200 group-hover:text-orange-400 transition-colors mb-2">
                      {district.name}
                    </div>
                    <div className="text-2xl font-bold text-orange-400 mb-1">{district.firePoints.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">fire incidents</div>
                    <div className="mt-2 text-xs text-orange-400/70 group-hover:text-orange-300 transition-colors">
                      View Details &rarr;
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Ecological Significance */}
          <section className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-emerald-500/30 transition-colors">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-500 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              Ecological Significance & Fire Risk
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <span className="text-3xl">-</span>
                <div>
                  <div className="text-sm font-bold text-slate-300 mb-2">Ancient Mountain System</div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    The Aravalli Range is one of the world's oldest fold mountains (~350 million years), stretching 692 km through Rajasthan. Its ancient geological structure creates unique microclimates and forest ecosystems.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-3xl">-</span>
                <div>
                  <div className="text-sm font-bold text-slate-300 mb-2">Biodiversity Corridor</div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Acts as a critical wildlife corridor connecting fragmented forests from Gujarat to Haryana. Home to leopards, sloth bears, wolves, and numerous endemic plant species found nowhere else in Rajasthan.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-3xl">-</span>
                <div>
                  <div className="text-sm font-bold text-slate-300 mb-2">Climate Barrier</div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Intercepts monsoon moisture from the southeast, creating dramatic rainfall gradients (800mm east vs 200mm west). This climate division directly influences vegetation patterns and fire susceptibility.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
              <h4 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Why Aravalli Districts Have Higher Fire Risk
              </h4>
              <ul className="text-sm text-slate-400 space-y-2">
                <li><strong className="text-orange-400">Dense Forest Cover:</strong> The slopes support the state's most extensive deciduous forests, creating heavy fuel loads during dry months.</li>
                <li><strong className="text-orange-400">Human Activity:</strong> Traditional practices like controlled burning, minor forest produce collection, and pilgrimage activities increase ignition sources.</li>
                <li><strong className="text-orange-400">Topography:</strong> Steep slopes and valleys accelerate fire spread, making containment challenging.</li>
                <li><strong className="text-orange-400">Climate Factors:</strong> Summer temperatures reach 45°C+ with low humidity (15-25%), creating ideal fire conditions.</li>
              </ul>
            </div>
          </section>

          {/* Conservation & Prevention */}
          <section className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-blue-500/30 transition-colors">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Conservation & Fire Prevention
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-slate-300 mb-3">Current Challenges</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">-</span>
                    <span>Forest fragmentation due to mining and urbanization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">-</span>
                    <span>Climate change intensifying drought conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">-</span>
                    <span>Limited resources for fire surveillance in remote areas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">-</span>
                    <span>Traditional burning practices conflicting with conservation</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-slate-300 mb-3">Prevention Strategies</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">-</span>
                    <span>Community-based fire monitoring programs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">-</span>
                    <span>Creation of strategic fire lines and buffer zones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">-</span>
                    <span>Early warning systems using satellite technology</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">-</span>
                    <span>Sustainable alternatives to traditional burning practices</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* ===== SECTION: Fire Zone Point Search ===== */}
          <FirePointSearch
            mode="aravali"
            districtName="Aravali Range"
            center={[26.0, 74.0]}
            aravaliDistricts={ARAVALLI_SLUGS}
          />
        </main>
      </div>
    </div>
  );
}
