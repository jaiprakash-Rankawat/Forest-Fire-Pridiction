export default function EvidenceCard({ caseStudy }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{caseStudy.title}</h3>
            <p className="text-orange-100 text-sm">{caseStudy.date}</p>
          </div>
          <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-red-600">
            {caseStudy.causeName}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500 uppercase">Location</p>
            <p className="font-semibold text-gray-800">{caseStudy.location}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500 uppercase">Area Burned</p>
            <p className="font-semibold text-gray-800">{caseStudy.area}</p>
          </div>
          {caseStudy.deaths > 0 && (
            <div className="bg-red-50 p-3 rounded">
              <p className="text-xs text-red-500 uppercase">Deaths</p>
              <p className="font-semibold text-red-800">{caseStudy.deaths}</p>
            </div>
          )}
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500 uppercase">Structures Lost</p>
            <p className="font-semibold text-gray-800">{caseStudy.structuresDestroyed}</p>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Specific Cause:</h4>
          <p className="text-fire-600 font-medium">{caseStudy.specificCause}</p>
        </div>

        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">What Happened:</h4>
          <div className="text-gray-700 text-sm whitespace-pre-line max-h-96 overflow-y-auto">
            {caseStudy.detailedDescription}
          </div>
        </div>

        {caseStudy.keyLessons && caseStudy.keyLessons.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-800 mb-3">Key Lessons:</h4>
            <ul className="space-y-2">
              {caseStudy.keyLessons.map((lesson, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">💡</span>
                  <span className="text-gray-700 text-sm">{lesson}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            <strong>Sources:</strong> {caseStudy.source}
          </p>
        </div>
      </div>
    </div>
  );
}
