'use client';

import { useState } from 'react';

export default function PredictionForm() {
  const [formData, setFormData] = useState({
    temperature: '',
    humidity: '',
    windSpeed: '',
    vegetation: 'moderate',
    rainfall: '',
    forestType: 'mixed'
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error('Error:', error);
      setPrediction({ error: 'Failed to generate prediction. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Extreme': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Environmental Parameters</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Temperature (°C)
            </label>
            <input
              type="number"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-transparent"
              placeholder="e.g., 29"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Humidity (%)
            </label>
            <input
              type="number"
              name="humidity"
              value={formData.humidity}
              onChange={handleChange}
              required
              min="0"
              max="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-transparent"
              placeholder="e.g., 25"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Wind Speed (mph)
            </label>
            <input
              type="number"
              name="windSpeed"
              value={formData.windSpeed}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-transparent"
              placeholder="e.g., 15"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Vegetation Dryness
            </label>
            <select
              name="vegetation"
              value={formData.vegetation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-transparent"
            >
              <option value="low">Low (Green/Moist)</option>
              <option value="moderate">Moderate (Some Dryness)</option>
              <option value="high">High (Very Dry)</option>
              <option value="extreme">Extreme (Critically Dry)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Days Since Last Rainfall
            </label>
            <input
              type="number"
              name="rainfall"
              value={formData.rainfall}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-transparent"
              placeholder="e.g., 14"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Forest Type
            </label>
            <select
              name="forestType"
              value={formData.forestType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-transparent"
            >
              <option value="coniferous">Coniferous (Pine, Fir, Spruce)</option>
              <option value="deciduous">Deciduous (Oak, Maple, Birch)</option>
              <option value="mixed">Mixed Forest</option>
              <option value="tropical">Tropical Rainforest</option>
              <option value="grassland">Grassland/Savanna</option>
              <option value="shrubland">Shrubland/Chaparral</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-fire-600 to-fire-500 text-white font-bold py-3 px-6 rounded-lg hover:from-fire-700 hover:to-fire-600 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Generate Fire Risk Prediction'}
        </button>
      </form>

      {prediction && !prediction.error && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Prediction Results</h2>

          <div className={`border-2 rounded-lg p-6 mb-6 ${getRiskColor(prediction.riskLevel)}`}>
            <h3 className="text-3xl font-bold mb-2">Risk Level: {prediction.riskLevel}</h3>
            <p className="text-lg">{prediction.riskDescription}</p>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Analysis:</h4>
            <p className="text-gray-700">{prediction.analysis}</p>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Contributing Factors:</h4>
            <ul className="space-y-2">
              {prediction.factors.map((factor, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-fire-500 mr-2">⚠️</span>
                  <span className="text-gray-700">{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-xl font-semibold text-blue-800 mb-3">Recommendations:</h4>
            <ul className="space-y-2">
              {prediction.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {prediction?.error && (
        <div className="mt-8 bg-red-50 border border-red-300 rounded-lg p-6">
          <p className="text-red-800">{prediction.error}</p>
        </div>
      )}
    </div>
  );
}
