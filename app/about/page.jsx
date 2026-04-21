import { causes } from '../data/causes';
import { evidence } from '../data/evidence';
import Link from 'next/link';

export const metadata = {
  title: 'About | Rajasthan Fire Analysis',
  description: 'Learn about forest fire causes, impacts, and the mission behind Rajasthan Fire Analysis — an educational platform powered by NASA FIRMS satellite data.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-slate-950 to-red-900/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,120,0,0.07) 0%, transparent 55%), radial-gradient(circle at 70% 50%, rgba(255,68,0,0.07) 0%, transparent 55%)'
        }}></div>
        <div className="relative max-w-[1600px] mx-auto px-4 md:px-6 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 text-orange-400 text-sm font-medium mb-5">
            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
            Educational Platform · NASA FIRMS Data
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 mb-4 leading-tight">
            🔥 Understanding Forest Fires
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Learn about the causes, impacts, and prevention of wildfires through research-backed information and real-world case studies from Rajasthan and beyond.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/"
              className="bg-orange-500/10 border border-orange-500/40 text-orange-300 px-6 py-2.5 rounded-lg font-semibold hover:bg-orange-500/20 transition-all duration-200 text-sm"
            >
              🗺️ View Fire Analysis
            </Link>
            <Link
              href="/evidence"
              className="bg-slate-800/60 border border-slate-700/50 text-slate-300 px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-700/60 transition-all duration-200 text-sm"
            >
              📚 View Case Studies
            </Link>
          </div>
        </div>
      </header>

      {/* Causes Section */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-12 space-y-8">

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400 mb-3">
            What Causes Forest Fires?
          </h2>
          <p className="text-slate-400 max-w-3xl mx-auto text-base leading-relaxed">
            Understanding the six main factors that create conditions for devastating wildfires, 
            backed by scientific research and documented evidence from major fire incidents worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {causes.map((cause) => (
            <div key={cause.id} className="bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden hover:border-orange-500/30 transition-colors backdrop-blur-sm">
              {/* Cause Header */}
              <div className="bg-gradient-to-r from-red-900/50 via-orange-900/40 to-amber-900/30 border-b border-slate-700/50 p-5">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{cause.icon || '🔥'}</span>
                  <div>
                    <p className="text-orange-400/80 text-xs font-semibold uppercase tracking-wider mb-1">Cause #{cause.id}</p>
                    <h3 className="text-xl font-bold text-slate-100">{cause.title}</h3>
                    {cause.description && (
                      <p className="text-slate-400 text-sm mt-1 leading-relaxed">{cause.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Evidence */}
              <div className="p-5">
                <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <span className="text-amber-400">📚</span>
                  Real Evidence: {cause.title}
                </h4>
                <div className="space-y-3">
                  {evidence
                    .filter((e) => e.causeId === cause.id)
                    .slice(0, 2)
                    .map((caseStudy) => (
                      <div key={caseStudy.id} className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/40">
                        <h5 className="font-bold text-slate-200 mb-1 text-sm">{caseStudy.title}</h5>
                        <p className="text-xs text-slate-500 mb-2">
                          <span className="font-semibold text-slate-400">Date:</span> {caseStudy.date} &nbsp;|&nbsp;
                          <span className="font-semibold text-slate-400">Location:</span> {caseStudy.location}
                        </p>
                        <p className="text-xs text-slate-400 mb-2">
                          <span className="font-semibold text-orange-400/80">Cause:</span> {caseStudy.specificCause}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-900/60 p-2 rounded border border-slate-700/30">
                            <span className="text-slate-500">Area:</span> <strong className="text-slate-300">{caseStudy.area}</strong>
                          </div>
                          <div className="bg-slate-900/60 p-2 rounded border border-slate-700/30">
                            <span className="text-slate-500">Structures:</span> <strong className="text-slate-300">{caseStudy.structuresDestroyed}</strong>
                          </div>
                        </div>
                        <Link
                          href="/evidence"
                          className="inline-block mt-3 text-orange-400 hover:text-orange-300 font-medium text-xs transition-colors"
                        >
                          Read Full Case Study →
                        </Link>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prevention CTA */}
        <section className="bg-slate-900/80 border border-emerald-700/30 rounded-xl p-8 backdrop-blur-sm hover:border-emerald-500/40 transition-colors text-center">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-400 mb-3">
            🌲 Prevention Saves Lives & Forests
          </h2>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto leading-relaxed">
            Learn research-backed strategies to prevent wildfires and protect communities across Rajasthan.
          </p>
          <Link
            href="/prevention"
            className="inline-block bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 px-8 py-3 rounded-lg font-bold hover:bg-emerald-600/30 transition-all duration-200"
          >
            Explore Prevention Strategies
          </Link>
        </section>
      </main>
    </div>
  );
}
