'use client';
import { useState, useEffect } from 'react';
import ForestSelector from './ForestSelector';

const RajasthanPredictionForm = ({ onForestSelect, onPredictionResult }) => {
  const [selectedForest, setSelectedForest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [formData, setFormData] = useState({
    temperature: '',
    humidity: '',
    windSpeed: '',
    vegetation: 'moderate',
    rainfall: '0',
    daysSinceRain: '10'
  });

  // Fetch live weather data from Open-Meteo
  const fetchLiveWeather = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m`
      );
      const data = await response.json();
      
      if (data.current) {
        return {
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          rainfall: data.current.rain,
        };
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch weather:", error);
      return null;
    }
  };

  // Update parent when forest selection changes
  const handleForestSelect = async (forest) => {
    setSelectedForest(forest);
    onForestSelect(forest);
    
    if (forest) {
      setIsWeatherLoading(true);
      // Show loading state/placeholder if you want, or just auto-fill
      // Use live data if available, else fallback to forest defaults
      const liveWeather = await fetchLiveWeather(forest.coordinates.lat, forest.coordinates.lng);
      
      if (liveWeather) {
        setFormData(prev => ({
          ...prev,
          temperature: liveWeather.temperature.toString(),
          humidity: liveWeather.humidity.toString(),
          windSpeed: liveWeather.windSpeed.toString(),
          rainfall: liveWeather.rainfall.toString(),
          // Simple logic: if raining now, days since rain is 0, else keep default
          daysSinceRain: liveWeather.rainfall > 0 ? '0' : '10' 
        }));
      } else {
        // Fallback to static data
        setFormData(prev => ({
          ...prev,
          temperature: forest.climate.avgTemp.toString(),
          humidity: '30', 
          windSpeed: '12', 
        }));
      }
      setIsWeatherLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedForest) {
      alert("Please select a forest area first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/rajasthan-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          forestId: selectedForest.id,
          ...formData
        }),
      });

      const data = await response.json();
      onPredictionResult(data);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <ForestSelector selectedForest={selectedForest} onSelect={handleForestSelect} />

      {selectedForest && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6 relative">
          
          {isWeatherLoading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-lg backdrop-blur-[1px]">
               <div className="text-orange-600 font-semibold flex items-center animate-pulse text-sm sm:text-base">
                  Fetching live weather...
               </div>
            </div>
          )}

          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span>Environmental Parameters</span>
            <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 self-start sm:self-auto">
               Live Data Integrated
            </span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:ring-fire-500 focus:border-fire-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Humidity (%)</label>
              <input
                type="number"
                name="humidity"
                value={formData.humidity}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:ring-fire-500 focus:border-fire-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wind Speed (km/h)</label>
              <input
                type="number"
                name="windSpeed"
                value={formData.windSpeed}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:ring-fire-500 focus:border-fire-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vegetation Dryness</label>
              <select
                name="vegetation"
                value={formData.vegetation}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-fire-500 focus:border-fire-500"
              >
                <option value="low">Low (Green)</option>
                <option value="moderate">Moderate</option>
                <option value="high">High (Yellow/Brown)</option>
                <option value="extreme">Extreme (Very Dry)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Days Since Rain</label>
              <input
                type="number"
                name="daysSinceRain"
                value={formData.daysSinceRain}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:ring-fire-500 focus:border-fire-500"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recent Rainfall (mm)</label>
              <input
                type="number"
                name="rainfall"
                value={formData.rainfall}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:ring-fire-500 focus:border-fire-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || isWeatherLoading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Zones...
              </span>
            ) : (
              'Run Zone Analysis'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default RajasthanPredictionForm;
