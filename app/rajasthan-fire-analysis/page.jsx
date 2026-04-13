'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const RajasthanDashboard = dynamic(
  () => import('./RajasthanDashboard'),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-[600px] bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-red-500 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Loading Rajasthan Fire Analysis Dashboard...</p>
        </div>
      </div>
    )
  }
);

export default function RajasthanFireAnalysisPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-slate-950 to-orange-900/30"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,68,68,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,140,0,0.08) 0%, transparent 50%)'
        }}></div>
        <div className="relative max-w-[1600px] mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors mb-2 inline-block">
                ← Back to Home
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400">
                🔥 Rajasthan Forest Fire Analysis
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl">
                Comprehensive fire zone mapping across all 33 districts + Aravalli Range using Kernel Density Estimation on NASA FIRMS satellite data (2018–2025)
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-orange-400">33</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Districts</div>
              </div>
              <div className="px-4 py-2 bg-slate-800/60 border border-yellow-600/40 rounded-lg text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-yellow-400">⛰️</div>
                <div className="text-xs text-yellow-500/80 uppercase tracking-wider">Aravalli Range</div>
              </div>
              <div className="px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-red-400">KDE</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Method</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-6 pb-12">
        <RajasthanDashboard />
      </main>
    </div>
  );
}
