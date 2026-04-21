import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4 flex items-center text-white">
              <span className="text-3xl mr-2">🔥</span>
              Rajasthan Fire Analysis
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Comprehensive forest fire monitoring across Rajasthan using NASA FIRMS satellite data and KDE analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-white uppercase tracking-wider">Pages</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-400 hover:text-orange-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/rajasthan-fire-analysis/aravali-range" className="text-slate-400 hover:text-orange-400 transition-colors text-sm">
                  Aravali Range
                </Link>
              </li>
              <li>
                <Link href="/fire-history" className="text-slate-400 hover:text-orange-400 transition-colors text-sm">
                  Fire History
                </Link>
              </li>
              <li>
                <Link href="/forest-explorer" className="text-slate-400 hover:text-orange-400 transition-colors text-sm">
                  Forest Explorer
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-orange-400 transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/prevention" className="text-slate-400 hover:text-orange-400 transition-colors text-sm">
                  Prevention
                </Link>
              </li>
            </ul>
          </div>

          {/* Additional Pages */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-white uppercase tracking-wider">Explore More</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/critical-zones" className="text-slate-400 hover:text-orange-400 transition-colors text-sm">
                  Critical Zones
                </Link>
              </li>
              <li>
                <Link href="/evidence" className="text-slate-400 hover:text-orange-400 transition-colors text-sm">
                  Evidence
                </Link>
              </li>
              <li>
                <Link href="/kumbhalgarh-monitor" className="text-slate-400 hover:text-orange-400 transition-colors text-sm">
                  Kumbhalgarh Monitor
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-white uppercase tracking-wider">Emergency</h4>
            <p className="text-slate-400 text-sm mb-2">
              If you see a wildfire:
            </p>
            <p className="text-orange-400 font-bold text-2xl">Call 112</p>
            <p className="text-slate-500 mt-3 text-xs leading-relaxed">
              Forest Fire Helpline: <span className="text-slate-300">1800-180-4555</span>
            </p>
            <p className="text-slate-500 mt-2 text-xs">
              Report smoke or fire immediately. Do not assume someone else has called.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Rajasthan Fire Analysis. Educational purposes only.</p>
          <p className="mt-1">Data sourced from NASA FIRMS, FSI, and peer-reviewed research.</p>
        </div>
      </div>
    </footer>
  );
}
