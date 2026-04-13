import { causes } from './data/causes';
import { evidence } from './data/evidence';
import CauseCard from './components/CauseCard';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-fire-700 via-fire-600 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            🔥 Understanding Forest Fires
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-orange-100">
            Learn about the causes, impacts, and prevention of wildfires through research-backed information and real-world case studies
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/rajasthan-fire-analysis"
              className="bg-white text-fire-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-200"
            >
              🗺️ Rajasthan Fire Analysis
            </Link>
            <Link
              href="/prediction"
              className="bg-fire-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-fire-900 transition-colors duration-200"
            >
              Try AI Prediction
            </Link>
            <Link
              href="/evidence"
              className="bg-fire-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-fire-900 transition-colors duration-200"
            >
              View Case Studies
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            What Causes Forest Fires?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understanding the six main factors that create conditions for devastating wildfires, 
            backed by scientific research and documented evidence from major fire incidents worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {causes.map((cause) => (
            <div key={cause.id}>
              <CauseCard cause={cause} />
              
              <div className="mt-4 bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border-l-4 border-fire-500">
                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">📚</span>
                  Real Evidence: {cause.title}
                </h4>
                <div className="space-y-3">
                  {evidence
                    .filter((e) => e.causeId === cause.id)
                    .slice(0, 2)
                    .map((caseStudy) => (
                      <div key={caseStudy.id} className="bg-white p-4 rounded-lg shadow">
                        <h5 className="font-bold text-gray-800 mb-1">{caseStudy.title}</h5>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold">Date:</span> {caseStudy.date} | 
                          <span className="font-semibold"> Location:</span> {caseStudy.location}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold text-fire-600">Cause:</span> {caseStudy.specificCause}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">Area:</span> <strong>{caseStudy.area}</strong>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">Structures:</span> <strong>{caseStudy.structuresDestroyed}</strong>
                          </div>
                        </div>
                        <Link
                          href="/evidence"
                          className="inline-block mt-3 text-fire-600 hover:text-fire-700 font-medium text-sm"
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
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Assess Fire Risk?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Use our AI-powered prediction tool to evaluate current conditions and understand fire risk levels
          </p>
          <Link
            href="/prediction"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-200"
          >
            Try Fire Risk Prediction
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-green-800 mb-4 text-center">
            🌲 Prevention Saves Lives & Forests
          </h2>
          <p className="text-lg text-gray-700 text-center mb-6">
            Learn research-backed strategies to prevent wildfires and protect communities
          </p>
          <div className="text-center">
            <Link
              href="/prevention"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors duration-200"
            >
              Explore Prevention Strategies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
