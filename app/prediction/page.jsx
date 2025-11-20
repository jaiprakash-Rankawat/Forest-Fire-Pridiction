import PredictionForm from '../components/PredictionForm';

export const metadata = {
  title: 'Fire Risk Prediction | Forest Fire Prediction',
  description: 'Use AI-powered analysis to assess forest fire risk based on environmental parameters.',
};

export default function PredictionPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🔮 Forest Fire Risk Prediction
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enter current environmental conditions to receive an AI-powered assessment of forest fire risk. 
            Our model analyzes temperature, humidity, wind, vegetation dryness, and rainfall patterns to 
            determine fire danger levels.
          </p>
        </div>

        <PredictionForm />

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-800 mb-3">How This Works</h3>
          <p className="text-gray-700 mb-4">
            Our prediction model evaluates multiple environmental factors that contribute to wildfire risk:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-fire-500 mr-2">🌡️</span>
              <span><strong>Temperature:</strong> Higher temperatures dry out vegetation and increase fire intensity</span>
            </li>
            <li className="flex items-start">
              <span className="text-fire-500 mr-2">💧</span>
              <span><strong>Humidity:</strong> Low humidity causes rapid fuel drying and erratic fire behavior</span>
            </li>
            <li className="flex items-start">
              <span className="text-fire-500 mr-2">💨</span>
              <span><strong>Wind Speed:</strong> Strong winds spread fires rapidly and carry embers long distances</span>
            </li>
            <li className="flex items-start">
              <span className="text-fire-500 mr-2">🌾</span>
              <span><strong>Vegetation Dryness:</strong> Drought-stressed plants become highly flammable fuel</span>
            </li>
            <li className="flex items-start">
              <span className="text-fire-500 mr-2">🌧️</span>
              <span><strong>Rainfall:</strong> Extended dry periods create critical fire conditions</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-yellow-800 mb-3">⚠️ Important Note</h3>
          <p className="text-gray-700">
            This tool is for <strong>educational purposes only</strong>. For official fire weather forecasts and warnings, 
            always consult your local fire authority, National Weather Service, or official government sources. 
            If you see a wildfire, call 911 immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
