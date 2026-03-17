"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

// Static imports
import SafetyHeader from "./components/SafetyHeader";
import LiveWeatherPanel from "./components/LiveWeatherPanel";
import FireAlertSystem from "./components/FireAlertSystem";
import CommunityReportForm from "./components/CommunityReportForm";
import SafetyTips from "./components/SafetyTips";
import HistoryChart from "./components/HistoryChart";
import EmergencyContacts from "./components/EmergencyContacts";

// Dynamic imports for Leaflet (breaks on SSR)
const FireRiskMap = dynamic(() => import("./components/FireRiskMap"), {
  ssr: false,
  loading: () => (
    <div className="bg-slate-100 rounded-2xl animate-pulse h-full min-h-[400px] flex items-center justify-center">
      <span className="text-slate-400 font-semibold">Loading map data...</span>
    </div>
  ),
});

export default function SafetyCenterPage() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRiskData() {
      try {
        const res = await fetch("/api/fire-risk");
        const json = await res.json();
        if (json.success) {
          setZones(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch fire risk zones:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRiskData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Head>
        <title>Forest Fire Safety & Prediction Center | FirePredictNext</title>
        <meta name="description" content="Monitor forest fire risks, view safety tips, and report fires." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <SafetyHeader />

        {/* Global Alert System */}
        {!loading && zones.length > 0 && <FireAlertSystem zones={zones} />}

        {/* Top Grid: Map & Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 h-[450px] lg:h-[600px] relative z-0">
            <FireRiskMap zones={zones} />
          </div>
          <div className="lg:col-span-1 h-full">
            <LiveWeatherPanel zones={zones} />
          </div>
        </div>

        {/* Middle Grid: Forms & Education */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <CommunityReportForm />
          </div>
          <div>
            <SafetyTips />
          </div>
        </div>

        {/* Bottom Grid: History & Contacts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 relative">
            <HistoryChart />
          </div>
          <div className="lg:col-span-1">
            <EmergencyContacts />
          </div>
        </div>
      </div>
    </div>
  );
}
