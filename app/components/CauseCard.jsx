export default function CauseCard({ cause }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-fire-500 to-fire-600 p-6">
        <div className="flex items-center space-x-4">
          <span className="text-6xl">{cause.icon}</span>
          <h3 className="text-2xl font-bold text-white">{cause.title}</h3>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-700 mb-4 font-medium">{cause.description}</p>

        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">How It Causes Fires:</h4>
          <div className="prose max-w-none text-gray-600 text-sm whitespace-pre-line">
            {cause.detailedExplanation}
          </div>
        </div>

        {cause.statistics && cause.statistics.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Key Statistics:</h4>
            <ul className="space-y-2">
              {cause.statistics.map((stat, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-fire-500 mr-2">📊</span>
                  <span className="text-gray-700 text-sm">{stat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {cause.preventionTips && cause.preventionTips.length > 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-green-800 mb-3">Prevention Tips:</h4>
            <ul className="space-y-2">
              {cause.preventionTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700 text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
