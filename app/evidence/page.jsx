"use client";

import { useState } from "react";
import { evidence } from "../data/evidence";
import EvidenceCard from "../components/EvidenceCard";
import {
  FiAlertTriangle,
  FiBookOpen,
  FiFileText,
  FiGlobe,
  FiShield,
  FiTrendingUp,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const stats = [
  { id: 1, name: "Case Studies", value: evidence.length, icon: FiFileText },
  {
    id: 2,
    name: "Primary Causes",
    value: new Set(evidence.map((item) => item.causeName)).size,
    icon: FiAlertTriangle,
  },
  {
    id: 3,
    name: "Years Covered",
    value: new Set(evidence.map((item) => new Date(item.date).getFullYear()))
      .size,
    icon: FiTrendingUp,
  },
];

export default function EvidencePage() {
  const [expandedSections, setExpandedSections] = useState({});

  const groupedEvidence = evidence.reduce((acc, caseStudy) => {
    if (!acc[caseStudy.causeName]) {
      acc[caseStudy.causeName] = [];
    }
    acc[caseStudy.causeName].push(caseStudy);
    return acc;
  }, {});

  // Sort cases by date (newest first)
  Object.keys(groupedEvidence).forEach((cause) => {
    groupedEvidence[cause].sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  const toggleSection = (causeName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [causeName]: !prev[causeName],
    }));
  };

  const expandAll = () => {
    const allExpanded = {};
    Object.keys(groupedEvidence).forEach((cause) => {
      allExpanded[cause] = true;
    });
    setExpandedSections(allExpanded);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Understanding Wildfires Through{" "}
              <span className="text-yellow-300">Real-World Evidence</span>
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
              Explore documented case studies of major forest fires, analyze
              their causes, and learn valuable lessons to prevent future
              disasters.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative -mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-orange-100 rounded-lg p-3">
                    <stat.icon
                      className="h-6 w-6 text-orange-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Note Box */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-400 p-6 rounded-r-lg shadow-sm mb-12">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertTriangle
                className="h-5 w-5 text-orange-500"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">
                About These Case Studies
              </h3>
              <div className="mt-2 text-sm text-orange-700">
                <p>
                  These case studies are based on official fire investigation
                  reports, peer-reviewed research, and credible news sources.
                  They demonstrate how theoretical causes manifest in real-world
                  disasters and provide valuable insights for prevention and
                  response.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Grid */}
        <div className="space-y-6">
          {/* Expand/Collapse All Controls */}
          <div className="flex justify-end gap-3 mb-6">
            <button
              onClick={expandAll}
              className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <FiChevronDown className="w-4 h-4" />
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <FiChevronUp className="w-4 h-4" />
              Collapse All
            </button>
          </div>

          {Object.entries(groupedEvidence).map(([causeName, cases]) => {
            const isExpanded = expandedSections[causeName];
            
            return (
              <section
                key={causeName}
                className="scroll-mt-16 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300"
                id={causeName.toLowerCase().replace(/\s+/g, "-")}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleSection(causeName)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-2 h-12 bg-orange-500 rounded-full"></span>
                    <div className="text-left">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {causeName}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {cases.length} {cases.length === 1 ? "case study" : "case studies"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                      {cases.length} {cases.length === 1 ? "case" : "cases"}
                    </span>
                    <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <FiChevronDown className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </button>

                {/* Accordion Content */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    isExpanded ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <div className="px-6 pb-6 pt-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {cases.map((caseStudy) => (
                        <div key={caseStudy.id} className="animate-fade-in">
                          <EvidenceCard caseStudy={caseStudy} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Methodology Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-12 sm:p-12 lg:px-16">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Our Research Methodology
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-gray-500">
                  We maintain the highest standards in compiling and presenting
                  wildfire case studies.
                </p>
              </div>
            </div>
            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="pt-6">
                  <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                    <div className="-mt-6">
                      <div className="inline-flex items-center justify-center rounded-xl bg-orange-500 p-3 shadow-lg">
                        <FiFileText
                          className="h-8 w-8 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="mt-8 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                        Primary Sources
                      </h3>
                      <ul className="mt-4 space-y-3 text-base text-gray-600 list-disc pl-5">
                        <li>Cal Fire and U.S. Forest Service reports</li>
                        <li>Government investigations</li>
                        <li>Scientific publications</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                    <div className="-mt-6">
                      <div className="inline-flex items-center justify-center rounded-xl bg-orange-500 p-3 shadow-lg">
                        <FiShield
                          className="h-8 w-8 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="mt-8 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                        Verification
                      </h3>
                      <ul className="mt-4 space-y-3 text-base text-gray-600 list-disc pl-5">
                        <li>Cross-referenced data</li>
                        <li>Peer-reviewed when possible</li>
                        <li>Multiple source verification</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                    <div className="-mt-6">
                      <div className="inline-flex items-center justify-center rounded-xl bg-orange-500 p-3 shadow-lg">
                        <FiGlobe
                          className="h-8 w-8 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="mt-8 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                        Global Perspective
                      </h3>
                      <ul className="mt-4 space-y-3 text-base text-gray-600 list-disc pl-5">
                        <li>International case studies</li>
                        <li>Diverse ecosystems</li>
                        <li>Varied climate conditions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
