'use client';
import dynamic from 'next/dynamic';

const UdaipurMapClient = dynamic(
  () => import('./UdaipurMapClient'),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-[calc(100vh-80px)] bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-red-500 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Loading Fire Zone Analysis...</p>
        </div>
      </div>
    )
  }
);

export default function UdaipurAnalysisPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-6 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-5">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400">
              Udaipur Fire Zone Analysis
            </h1>
            <p className="text-slate-400 mt-1">Kernel Density Estimation · Risk Classification · Satellite Overlay</p>
          </div>
          <a
            href="/udaipur_fire_zones.kml"
            download
            className="mt-3 md:mt-0 px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-red-500/25 hover:scale-105 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download KML
          </a>
        </header>
        
        <main>
          <UdaipurMapClient />
        </main>
      </div>
    </div>
  );
}
