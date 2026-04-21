"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// All 33 districts of Rajasthan
const ALL_DISTRICTS = [
  "Ajmer",
  "Alwar",
  "Banswara",
  "Baran",
  "Barmer",
  "Bharatpur",
  "Bhilwara",
  "Bikaner",
  "Bundi",
  "Chittorgarh",
  "Churu",
  "Dausa",
  "Dholpur",
  "Dungarpur",
  "Hanumangarh",
  "Jaipur",
  "Jaisalmer",
  "Jalore",
  "Jhalawar",
  "Jhunjhunu",
  "Jodhpur",
  "Karauli",
  "Kota",
  "Nagaur",
  "Pali",
  "Pratapgarh",
  "Rajsamand",
  "Sawai Madhopur",
  "Sikar",
  "Sirohi",
  "Sri Ganganagar",
  "Tonk",
  "Udaipur",
];

// Districts that the Aravalli Range passes through
const ARAVALLI_DISTRICTS = [
  "Sirohi",
  "Pali",
  "Rajsamand",
  "Udaipur",
  "Bhilwara",
  "Ajmer",
  "Jaipur",
  "Sikar",
  "Alwar",
  "Dausa",
];

const COLORS = {
  aravali: "#FFD700", // Golden yellow for Aravalli range
  nonAravali: "#3B82F6", // Blue for non-Aravalli districts
  aravaliRange: "#FF8C00", // Orange for Aravalli Range aggregate
};

export default function FirePointsChartPage() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("fires"); // 'name', 'fires', 'aravali'
  const [viewMode, setViewMode] = useState("all"); // 'all', 'aravali', 'comparison'
  const [filterRiskLevel, setFilterRiskLevel] = useState(null);
  const [canonicalStats, setCanonicalStats] = useState(null); // from /api/fire-stats

  useEffect(() => {
    // Check if we came from dashboard with a risk level filter
    const search = new URLSearchParams(window.location.search);
    const risk = search.get("riskLevel");
    if (risk) {
      setFilterRiskLevel(risk);
    }

    // Load canonical total from CSV (single source of truth)
    fetch('/api/fire-stats')
      .then(r => r.json())
      .then(s => setCanonicalStats(s))
      .catch(() => {});

    async function loadFireData() {
      try {
        const response = await fetch("/fire_zones/district_summary.json");
        const summaryData = await response.json();

        // Process all districts
        let allDistrictsData = [];
        let aravaliTotal = 0;
        let nonAravaliTotal = 0;

        ALL_DISTRICTS.forEach((districtName) => {
          const slug = districtName.toLowerCase().replace(/\s+/g, "-");
          const data = summaryData[slug];
          const firePoints = data?.firePoints || 0;
          const isAravali = ARAVALLI_DISTRICTS.includes(districtName);

          allDistrictsData.push({
            name: districtName,
            slug: slug,
            firePoints: firePoints,
            isAravali: isAravali,
            riskLevel: data?.riskLevel || "Unknown",
          });

          if (isAravali) {
            aravaliTotal += firePoints;
          } else {
            nonAravaliTotal += firePoints;
          }
        });

        // Add Aravalli Range aggregate
        const aravaliAggregate = {
          name: "Aravali Range",
          slug: "aravali-range",
          firePoints: aravaliTotal,
          isAravali: true,
          isAggregate: true,
        };

        setChartData({
          districts: allDistrictsData,
          aravaliAggregate: aravaliAggregate,
          aravaliTotal: aravaliTotal,
          nonAravaliTotal: nonAravaliTotal,
          totalFirePoints: aravaliTotal + nonAravaliTotal,
        });
      } catch (error) {
        console.error("Error loading fire data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFireData();
  }, []);

  const getSortedData = () => {
    if (!chartData) return [];

    let data = [...chartData.districts];
    
    // Apply risk level filter if active
    if (filterRiskLevel) {
      data = data.filter((d) => d.riskLevel === filterRiskLevel);
    }

    switch (sortBy) {
      case "fires":
        return data.sort((a, b) => b.firePoints - a.firePoints);
      case "aravali":
        return data.sort((a, b) => {
          if (a.isAravali && !b.isAravali) return -1;
          if (!a.isAravali && b.isAravali) return 1;
          return b.firePoints - a.firePoints;
        });
      default:
        return data.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const getComparisonData = () => {
    if (!chartData) return [];

    return [
      {
        name: "Aravali Range Districts",
        firePoints: chartData.aravaliTotal,
        isAravali: true,
      },
      {
        name: "Other Districts",
        firePoints: chartData.nonAravaliTotal,
        isAravali: false,
      },
    ];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-slate-200">{label}</p>
          <p className="text-sm text-orange-400">
            Fire Points: {data.firePoints.toLocaleString()}
          </p>
          {data.riskLevel && (
            <p className="text-xs text-slate-400">
              Risk Level: {data.riskLevel}
            </p>
          )}
          {data.isAravali && (
            <p className="text-xs text-yellow-400">Aravalli Range District</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-orange-500 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">
            Loading fire points chart...
          </p>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Failed to load fire data</p>
          <Link
            href="/rajasthan-fire-analysis"
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const sortedData = getSortedData();
  const comparisonData = getComparisonData();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-6 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 border-b border-slate-800">
          <div>
            <Link
              href="/rajasthan-fire-analysis"
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors mb-2 inline-block"
            >
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400">
              {filterRiskLevel ? `${filterRiskLevel} Risk Districts Analysis` : "Rajasthan Fire Points Analysis"}
            </h1>
            <p className="text-slate-400 mt-1">
              {filterRiskLevel 
                ? `Comparing fire incidents precisely for the ${filterRiskLevel} Risk category.`
                : "Comprehensive comparison of fire incidents across all 33 districts and Aravali Range"
              }
            </p>
          </div>
          <div className="flex gap-3 mt-3 md:mt-0">
            {filterRiskLevel && (
              <button
                onClick={() => {
                  setFilterRiskLevel(null);
                  window.history.replaceState({}, '', window.location.pathname);
                }}
                className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/40 rounded-lg hover:bg-red-500/30 transition-all font-medium text-sm"
              >
                Clear Filter ✕
              </button>
            )}
            <div className="px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-orange-400">
                {canonicalStats ? canonicalStats.totalRecords.toLocaleString() : chartData.totalFirePoints.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">
                Total Fire Records
              </div>
              <div className="text-[10px] text-slate-600 mt-0.5">NASA FIRMS · 2018–2025</div>
            </div>
            <div className="px-4 py-2 bg-slate-800/60 border border-yellow-500/40 rounded-lg text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-yellow-400">
                {ARAVALLI_DISTRICTS.length}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">
                Aravalli Districts
              </div>
            </div>
          </div>
        </header>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-600/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">-</span>
              <h3 className="text-lg font-bold text-yellow-400">
                Aravali Range
              </h3>
            </div>
            <div className="text-2xl font-bold text-yellow-300 mb-1">
              {chartData.aravaliTotal.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">fire incidents</div>
            <div className="text-xs text-yellow-400/70 mt-2">
              {Math.round(
                (chartData.aravaliTotal / chartData.totalFirePoints) * 100,
              )}
              % of state total
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-600/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">-</span>
              <h3 className="text-lg font-bold text-blue-400">
                Other Districts
              </h3>
            </div>
            <div className="text-2xl font-bold text-blue-300 mb-1">
              {chartData.nonAravaliTotal.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">fire incidents</div>
            <div className="text-xs text-blue-400/70 mt-2">
              {Math.round(
                (chartData.nonAravaliTotal / chartData.totalFirePoints) * 100,
              )}
              % of state total
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-600/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">-</span>
              <h3 className="text-lg font-bold text-orange-400">
                Avg. Aravali
              </h3>
            </div>
            <div className="text-2xl font-bold text-orange-300 mb-1">
              {Math.round(chartData.aravaliTotal / ARAVALLI_DISTRICTS.length)}
            </div>
            <div className="text-sm text-slate-400">per district</div>
            <div className="text-xs text-orange-400/70 mt-2">
              {Math.round(
                (chartData.aravaliTotal /
                  ARAVALLI_DISTRICTS.length /
                  (chartData.nonAravaliTotal /
                    (ALL_DISTRICTS.length - ARAVALLI_DISTRICTS.length))) *
                  100,
              )}
              % vs others
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-600/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">-</span>
              <h3 className="text-lg font-bold text-green-400">
                Highest District
              </h3>
            </div>
            <div className="text-lg font-bold text-green-300 mb-1 truncate">
              {sortedData[0]?.name || "N/A"}
            </div>
            <div className="text-sm text-slate-400">
              {sortedData[0]?.firePoints?.toLocaleString() || 0} incidents
            </div>
            <div className="text-xs text-green-400/70 mt-2">
              {sortedData[0]?.isAravali
                ? "Aravali District"
                : "Non-Aravali District"}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === "all"
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
              }`}
            >
              All Districts
            </button>
            <button
              onClick={() => setViewMode("aravali")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === "aravali"
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
              }`}
            >
              Aravali Districts
            </button>
            <button
              onClick={() => setViewMode("comparison")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === "comparison"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
              }`}
            >
              Comparison
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-orange-500/50"
            >
              <option value="name">Sort by Name</option>
              <option value="fires">Sort by Fire Count</option>
              <option value="aravali">Aravalli First</option>
            </select>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
            {viewMode === "all" && "Fire Points - All Districts"}
            {viewMode === "aravali" && "Fire Points - Aravali Range Districts"}
            {viewMode === "comparison" && "Aravali Range vs Other Districts"}
            {filterRiskLevel && (
              <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full border border-orange-500/30">
                Filtered: {filterRiskLevel} Risk
              </span>
            )}
          </h2>

          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={
                viewMode === "comparison"
                  ? comparisonData
                  : viewMode === "aravali"
                    ? sortedData.filter((d) => d.isAravali)
                    : sortedData
              }
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
              />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              {viewMode !== "comparison" && <Legend />}
              <Bar dataKey="firePoints" name="Fire Points">
                {(viewMode === "comparison"
                  ? comparisonData
                  : viewMode === "aravali"
                    ? sortedData.filter((d) => d.isAravali)
                    : sortedData
                ).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      viewMode === "comparison"
                        ? entry.isAravali
                          ? COLORS.aravaliRange
                          : COLORS.nonAravali
                        : entry.isAravali
                          ? COLORS.aravali
                          : COLORS.nonAravali
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend for comparison view */}
          {viewMode === "comparison" && (
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: COLORS.aravaliRange }}
                ></div>
                <span className="text-sm text-slate-400">
                  Aravali Range Districts
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: COLORS.nonAravali }}
                ></div>
                <span className="text-sm text-slate-400">Other Districts</span>
              </div>
            </div>
          )}
        </div>

        {/* District Links */}
        {viewMode !== "comparison" && (
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-slate-200 mb-4">
              Quick Links to District Analysis
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {(viewMode === "aravali"
                ? sortedData.filter((d) => d.isAravali)
                : sortedData
              ).map((district) => (
                <Link
                  key={district.slug}
                  href={`/rajasthan-fire-analysis/${district.slug}`}
                  className={`px-3 py-2 rounded-lg text-center text-sm font-medium transition-all ${
                    district.isAravali
                      ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20"
                      : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {district.name}
                  {district.isAravali && (
                    <span className="block text-xs mt-1"> </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Aravali Range Link */}
        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/30 rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-yellow-400 mb-2">
            View Detailed Aravali Range Analysis
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Explore comprehensive fire analysis specifically for the Aravali
            Range districts with interactive maps and ecological insights.
          </p>
          <Link
            href="/rajasthan-fire-analysis/aravali-range"
            className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all"
          >
            <span className="mr-2">-</span> Go to Aravali Range Analysis
          </Link>
        </div>
      </div>
    </div>
  );
}
