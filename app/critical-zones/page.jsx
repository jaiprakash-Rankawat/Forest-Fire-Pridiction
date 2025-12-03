'use client';

import { useState, useEffect } from 'react';

export default function CriticalZones() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    // Fetch initial summary data
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await fetch('/api/critical-zones');
      const data = await response.json();
      setCountries(data.availableCountries);
      setSummary(data.summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleSearch = async () => {
    if (!selectedCountry) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/critical-zones?country=${selectedCountry}`);
      const data = await response.json();
      setCountryData(data);
    } catch (error) {
      console.error('Error fetching country data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(2)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatArea = (acres) => {
    return acres.toLocaleString() + ' acres';
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Extreme': return 'bg-red-100 text-red-800 border-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🔥 Critical Fire Zones
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Explore historical wildfire cases from around the world, ranked by economic impact and severity
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Search by Country</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-transparent text-lg"
            >
              <option value="">Select a country...</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              disabled={!selectedCountry || loading}
              className="px-8 py-3 bg-gradient-to-r from-fire-600 to-fire-500 text-white font-bold rounded-lg hover:from-fire-700 hover:to-fire-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Country Results */}
        {countryData && (
          <div className="mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {countryData.country} - Fire Statistics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
                  <div className="text-sm font-medium opacity-90">Total Cases</div>
                  <div className="text-4xl font-bold mt-2">{countryData.totalCases}</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                  <div className="text-sm font-medium opacity-90">Total Cost</div>
                  <div className="text-3xl font-bold mt-2">{formatCurrency(countryData.totalCost)}</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
                  <div className="text-sm font-medium opacity-90">Total Area Burned</div>
                  <div className="text-2xl font-bold mt-2">{formatArea(countryData.totalArea)}</div>
                </div>
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-6 text-white">
                  <div className="text-sm font-medium opacity-90">Total Casualties</div>
                  <div className="text-4xl font-bold mt-2">{countryData.totalCasualties}</div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Cases Ranked by Cost
              </h3>

              <div className="space-y-4">
                {countryData.cases.map((fire, index) => (
                  <div
                    key={fire.id}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl font-bold text-fire-600">#{index + 1}</span>
                          <h4 className="text-2xl font-bold text-gray-900">{fire.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getSeverityColor(fire.severity)}`}>
                            {fire.severity}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">
                          📍 {fire.location} • 📅 {fire.year}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{fire.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-lg p-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600 font-medium">Economic Cost</div>
                        <div className="text-xl font-bold text-fire-600">{formatCurrency(fire.cost)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-medium">Area Burned</div>
                        <div className="text-lg font-semibold text-gray-900">{formatArea(fire.area)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-medium">Casualties</div>
                        <div className="text-lg font-semibold text-gray-900">{fire.casualties}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-medium">Forest Type</div>
                        <div className="text-lg font-semibold text-gray-900">{fire.forestType}</div>
                      </div>
                    </div>

                    <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                      <h5 className="text-sm font-bold text-orange-800 mb-3">🌡️ Environmental Conditions During Fire</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-orange-700 font-medium">Temperature</div>
                          <div className="text-lg font-bold text-orange-900">{fire.minTemp}°C</div>
                        </div>
                        <div>
                          <div className="text-xs text-orange-700 font-medium">Wind Speed</div>
                          <div className="text-lg font-bold text-orange-900">{fire.minWindSpeed} mph</div>
                        </div>
                        <div>
                          <div className="text-xs text-orange-700 font-medium">Days Since Rain</div>
                          <div className="text-lg font-bold text-orange-900">{fire.minRainfall} days</div>
                        </div>
                        <div>
                          <div className="text-xs text-orange-700 font-medium">Humidity</div>
                          <div className="text-lg font-bold text-orange-900">{fire.minHumidity}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Global Summary */}
        {!countryData && summary.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Global Fire Impact Summary
            </h2>
            <p className="text-gray-600 mb-6">
              Countries ranked by total economic cost of wildfires
            </p>

            <div className="space-y-4">
              {summary.map((item, index) => (
                <div
                  key={item.country}
                  className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={async () => {
                    setSelectedCountry(item.country);
                    setLoading(true);
                    try {
                      const response = await fetch(`/api/critical-zones?country=${item.country}`);
                      const data = await response.json();
                      setCountryData(data);
                    } catch (error) {
                      console.error('Error fetching country data:', error);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-fire-600">#{index + 1}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{item.country}</h3>
                        <p className="text-gray-600">{item.totalCases} documented cases</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 font-medium">Total Economic Impact</div>
                      <div className="text-3xl font-bold text-fire-600">{formatCurrency(item.totalCost)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                    <div>
                      <div className="text-sm text-gray-600 font-medium">Total Area Burned</div>
                      <div className="text-lg font-semibold text-gray-900">{formatArea(item.totalArea)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 font-medium">Total Casualties</div>
                      <div className="text-lg font-semibold text-gray-900">{item.totalCasualties}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 font-medium">Most Expensive Fire</div>
                      <div className="text-lg font-semibold text-gray-900">{item.mostExpensiveFire.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
