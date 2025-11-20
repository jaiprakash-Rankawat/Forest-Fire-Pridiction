import { preventionStrategies, quickTips } from '../data/prevention';

export const metadata = {
  title: 'Prevention Strategies | Forest Fire Prediction',
  description: 'Research-backed strategies and actionable steps to prevent forest fires and protect communities.',
};

export default function PreventionPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🌲 Fire Prevention & Safety
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Research-backed strategies to prevent wildfires, protect communities, and reduce fire risk. 
            Since 84-90% of fires are human-caused, prevention is our most powerful tool.
          </p>
        </div>

        <div className="mb-12 bg-green-50 border-2 border-green-400 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4">🔥 Quick Prevention Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickTips.map((tip, index) => (
              <div key={index} className="flex items-start bg-white p-3 rounded shadow-sm">
                <span className="text-green-600 mr-2 font-bold">✓</span>
                <span className="text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          {preventionStrategies.map((strategy) => (
            <div key={strategy.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-fire-600 to-orange-600 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-orange-100 text-sm font-medium mb-1">{strategy.category}</p>
                    <h3 className="text-2xl font-bold text-white">{strategy.title}</h3>
                  </div>
                </div>
                <p className="text-orange-100 mt-3">{strategy.description}</p>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {strategy.strategies.map((item, index) => (
                    <div key={index} className="border-l-4 border-fire-400 pl-4">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">{item.name}</h4>
                      <p className="text-gray-700">{item.details}</p>
                    </div>
                  ))}
                </div>

                {strategy.impact && (
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 uppercase font-semibold mb-1">Impact:</p>
                    <p className="text-blue-800 font-medium">{strategy.impact}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-red-50 border-2 border-red-400 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
            <span className="text-3xl mr-2">🚨</span>
            Emergency: If You See a Wildfire
          </h2>
          <div className="space-y-3 text-gray-700">
            <p className="text-lg font-semibold">Immediate Actions:</p>
            <ol className="list-decimal ml-6 space-y-2">
              <li><strong>Call 911 immediately</strong> - Do not assume someone else has reported it</li>
              <li><strong>Provide exact location</strong> - Use landmarks, mile markers, or GPS coordinates</li>
              <li><strong>Describe the fire</strong> - Size, what's burning, wind direction, structures threatened</li>
              <li><strong>Follow evacuation orders</strong> - Leave immediately when authorities tell you to</li>
              <li><strong>If trapped</strong> - Call 911, go to a cleared area, stay low, cover up, stay calm</li>
            </ol>
            <p className="mt-4 font-semibold">Remember: Every second counts. Early reporting saves lives and property.</p>
          </div>
        </div>

        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Additional Resources</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Ready.gov/wildfires</strong> - Federal emergency management resources</li>
            <li>• <strong>Fire.airnow.gov</strong> - Air quality and smoke maps</li>
            <li>• <strong>Firewise USA</strong> - Community wildfire preparedness programs</li>
            <li>• <strong>Local Fire Department</strong> - Home assessments and community programs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
