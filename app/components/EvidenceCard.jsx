"use client";
import { useState } from "react";
import {
  FiMapPin,
  FiCalendar,
  FiAward,
  FiAlertTriangle,
  FiHome,
  FiChevronDown,
  FiChevronUp,
  FiInfo,
} from "react-icons/fi";
import { renderFormattedText } from "@/lib/utils";

export default function EvidenceCard({ caseStudy }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxPreviewLength = 300;
  const showReadMore = caseStudy.detailedDescription.length > maxPreviewLength;
  const descriptionPreview = showReadMore
    ? `${caseStudy.detailedDescription.substring(0, maxPreviewLength)}...`
    : caseStudy.detailedDescription;

  const getCauseGradient = (causeName) => {
    switch (causeName) {
      case "Human Activities":
        return "from-red-600 to-orange-500";
      case "High Temperature":
        return "from-orange-600 to-yellow-500";
      case "Lightning":
        return "from-blue-600 to-purple-500";
      case "Drought":
        return "from-yellow-600 to-amber-500";
      case "Low Humidity":
        return "from-amber-500 to-orange-400";
      case "Strong Winds":
        return "from-slate-600 to-gray-500";
      default:
        return "from-gray-600 to-gray-400";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
      <div
        className={`bg-gradient-to-r ${getCauseGradient(
          caseStudy.causeName
        )} p-6`}
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FiCalendar className="text-white/80" />
              <span className="text-white/80 text-sm">{caseStudy.date}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
              {caseStudy.title}
            </h3>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
                {caseStudy.causeName}
              </span>
            </div>
          </div>
          {caseStudy.cost && (
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
              <p className="text-white/80 text-xs font-medium">
                ESTIMATED COST
              </p>
              <p className="text-white font-bold text-sm">
                {caseStudy.cost}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <FiMapPin className="w-4 h-4" />
              <p className="text-xs font-medium uppercase tracking-wider">
                Location
              </p>
            </div>
            <p className="font-semibold text-gray-800">{caseStudy.location}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <FiAward className="w-4 h-4" />
              <p className="text-xs font-medium uppercase tracking-wider">
                Area Burned
              </p>
            </div>
            <p className="font-semibold text-gray-800">{caseStudy.area}</p>
          </div>

          {caseStudy.deaths > 0 && (
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <div className="flex items-center gap-2 text-red-500 mb-1">
                <FiAlertTriangle className="w-4 h-4" />
                <p className="text-xs font-medium uppercase tracking-wider">
                  Fatalities
                </p>
              </div>
              <p className="font-bold text-red-700 text-lg">
                {caseStudy.deaths}
              </p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <FiHome className="w-4 h-4" />
              <p className="text-xs font-medium uppercase tracking-wider">
                Structures Lost
              </p>
            </div>
            <p className="font-semibold text-gray-800">
              {caseStudy.structuresDestroyed}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FiInfo className="text-orange-500 w-5 h-5" />
            <h4 className="text-lg font-semibold text-gray-800">
              Specific Cause
            </h4>
          </div>
          <p className="text-orange-600 font-medium bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
            {caseStudy.specificCause}
          </p>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            Incident Overview
          </h4>
          <div className="prose prose-sm max-w-none text-gray-700">
            <div
              className={`transition-all duration-300 leading-relaxed ${
                isExpanded ? "" : "max-h-64 overflow-hidden"
              }`}
            >
              {isExpanded ? renderFormattedText(caseStudy.detailedDescription) : renderFormattedText(descriptionPreview)}
            </div>
            {showReadMore && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <span>Show less</span>
                    <FiChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Read more</span>
                    <FiChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {caseStudy.keyLessons && caseStudy.keyLessons.length > 0 && (
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h4 className="text-lg font-semibold text-blue-800">
                Key Lessons Learned
              </h4>
            </div>
            <ul className="space-y-3">
              {caseStudy.keyLessons.map((lesson, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{lesson}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            <strong className="text-gray-600">Sources:</strong>{" "}
            {caseStudy.source}
          </p>
        </div>
      </div>
    </div>
  );
}
