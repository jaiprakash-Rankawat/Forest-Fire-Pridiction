import { preventionStrategies, quickTips } from '../data/prevention';
import Link from 'next/link';

export const metadata = {
  title: 'Prevention | Rajasthan Fire Analysis',
  description: 'Research-backed strategies and actionable steps to prevent forest fires and protect communities across Rajasthan.',
};

export default function PreventionPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-950 to-green-900/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(16,185,129,0.07) 0%, transparent 55%), radial-gradient(circle at 75% 50%, rgba(34,197,94,0.05) 0%, transparent 55%)'
        }}></div>
        <div className="relative max-w-[1600px] mx-auto px-4 md:px-6 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 text-emerald-400 text-sm font-medium mb-5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Research-backed · Community Protection
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 mb-4 leading-tight">
            🌲 Fire Prevention & Safety
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Research-backed strategies to prevent wildfires, protect communities, and reduce fire risk.
            Since 84–90% of fires are human-caused, prevention is our most powerful tool.
          </p>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-12 space-y-8">

        {/* Quick Tips */}
        <section className="bg-gradient-to-br from-slate-900/90 via-emerald-950/20 to-slate-900/90 border border-emerald-600/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-500 mb-5 flex items-center gap-2">
            <span className="text-2xl">🔥</span> Quick Prevention Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg border border-emerald-700/20">
                <span className="text-emerald-400 font-bold mt-0.5 flex-shrink-0">✓</span>
                <span className="text-slate-300 text-sm leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Strategy Cards */}
        <div className="space-y-6">
          {preventionStrategies.map((strategy) => (
            <div key={strategy.id} className="bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden hover:border-orange-500/20 transition-colors backdrop-blur-sm">
              {/* Strategy Header */}
              <div className="bg-gradient-to-r from-red-900/40 via-orange-900/30 to-amber-900/20 border-b border-slate-700/50 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-orange-400/80 text-xs font-semibold uppercase tracking-wider mb-1">{strategy.category}</p>
                    <h3 className="text-2xl font-bold text-slate-100">{strategy.title}</h3>
                  </div>
                </div>
                <p className="text-slate-400 mt-3 text-sm leading-relaxed">{strategy.description}</p>
              </div>

              <div className="p-6">
                <div className="space-y-5">
                  {strategy.strategies.map((item, index) => (
                    <div key={index} className="border-l-2 border-orange-500/40 pl-4">
                      <h4 className="text-base font-bold text-slate-200 mb-1">{item.name}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.details}</p>
                    </div>
                  ))}
                </div>

                {strategy.impact && (
                  <div className="mt-6 bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1 tracking-wider">Impact:</p>
                    <p className="text-blue-300 text-sm font-medium">{strategy.impact}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Section */}
        <section className="bg-slate-900/80 border border-red-700/40 rounded-xl p-8 backdrop-blur-sm hover:border-red-500/40 transition-colors">
          <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center gap-2">
            <span className="text-3xl">🚨</span>
            Emergency: If You See a Wildfire
          </h2>
          <div className="space-y-3 text-slate-400">
            <p className="text-base font-semibold text-slate-300">Immediate Actions:</p>
            <ol className="list-decimal ml-6 space-y-2 text-sm leading-relaxed">
              <li><strong className="text-slate-200">Call 112 immediately</strong> — Do not assume someone else has reported it</li>
              <li><strong className="text-slate-200">Forest Fire Helpline</strong> — 1800-180-4555 (toll-free)</li>
              <li><strong className="text-slate-200">Provide exact location</strong> — Use landmarks, mile markers, or GPS coordinates</li>
              <li><strong className="text-slate-200">Describe the fire</strong> — Size, what's burning, wind direction, structures threatened</li>
              <li><strong className="text-slate-200">Follow evacuation orders</strong> — Leave immediately when authorities tell you to</li>
              <li><strong className="text-slate-200">If trapped</strong> — Call 112, go to a cleared area, stay low, cover up, stay calm</li>
            </ol>
            <p className="mt-4 font-semibold text-slate-300 text-sm">Remember: Every second counts. Early reporting saves lives and forests.</p>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-slate-200 mb-4">Additional Resources</h3>
          <ul className="space-y-2 text-slate-400 text-sm leading-relaxed">
            <li>• <strong className="text-slate-300">FSI (Forest Survey of India)</strong> — National forest fire tracking and monitoring</li>
            <li>• <strong className="text-slate-300">NASA FIRMS</strong> — Real-time global fire detection via satellite</li>
            <li>• <strong className="text-slate-300">NRSC FireAlert</strong> — Indian satellite-based fire alert system</li>
            <li>• <strong className="text-slate-300">Local Forest Department</strong> — District-level resources and fire reporting</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
