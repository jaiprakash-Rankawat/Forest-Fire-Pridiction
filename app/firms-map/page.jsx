import dynamic from 'next/dynamic';
import Head from 'next/head';

const FirmsMapClient = dynamic(
  () => import('./FirmsMapClient'),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-[calc(100vh-80px)] bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-green-500 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Initializing NASA FIRMS Database...</p>
        </div>
      </div>
    )
  }
);

export const metadata = {
  title: 'NASA FIRMS Fire Map - Kumbhalgarh',
  description: 'Interactive map visualizing NASA FIRMS heat signatures bounded within the Kumbhalgarh Wildlife Sanctuary.',
};

export default function FirmsMapPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
      <Head>
        <title>NASA FIRMS Map | Kumbhalgarh Dashboard</title>
      </Head>
      
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
              Kumbhalgarh FIRMS Explorer
            </h1>
            <p className="text-slate-400 mt-1">Satellite heat signatures bounded by structural polygon data.</p>
          </div>
        </header>
        
        <main>
          <FirmsMapClient />
        </main>
      </div>
    </div>
  );
}
