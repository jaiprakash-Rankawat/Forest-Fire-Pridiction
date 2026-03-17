"use client";

import React, { useState } from "react";
import { FaCamera, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

export default function CommunityReportForm() {
  const [formData, setFormData] = useState({
    location: "",
    description: "",
    image: null
  });
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/report-fire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: formData.location,
          description: formData.description,
          imageUrl: formData.image ? "https://mock.image/report.jpg" : null
        })
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ location: "", description: "", image: null });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full">
      <div className="bg-fire-600 p-4 flex items-center justify-center">
        <h3 className="text-white font-bold text-xl flex items-center">
          <FaPaperPlane className="mr-2" /> Report a Fire
        </h3>
      </div>
      <div className="p-6 md:p-8">
        {status === "success" ? (
          <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl flex flex-col items-center justify-center text-center h-full">
            <span className="text-5xl mb-4">✅</span>
            <h4 className="text-xl font-bold mb-2">Report Submitted!</h4>
            <p className="text-green-700">Thank you for your vigilance. Authorities have been alerted to the location you provided.</p>
            <button 
              onClick={() => setStatus("idle")} 
              className="mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">
                Incident Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fire-500">
                  <FaMapMarkerAlt />
                </div>
                <input
                  type="text"
                  id="location"
                  placeholder="E.g., Highway 41 near Pine Forest..."
                  required
                  className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-fire-500 focus:border-fire-500 transition-all outline-none"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
                Description of the Fire
              </label>
              <textarea
                id="description"
                rows="4"
                placeholder="Size of fire, smoke color, direction it's spreading..."
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-fire-500 focus:border-fire-500 transition-all outline-none resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Upload Image (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-fire-400 hover:bg-fire-50 transition-colors cursor-pointer group">
                <div className="space-y-1 text-center">
                  <FaCamera className="mx-auto h-12 w-12 text-gray-400 group-hover:text-fire-500 mb-2 transition-colors" />
                  <div className="flex text-sm text-gray-600 flex-col items-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-fire-600 hover:text-fire-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-fire-500">
                      <span>Upload a file</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                      />
                    </label>
                    <p className="pl-1 mt-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                  {formData.image && (
                    <p className="text-sm text-green-600 font-medium mt-2 flex items-center justify-center">
                      <span className="mr-1">✓</span> {formData.image.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {status === "error" && (
              <p className="text-red-600 text-sm font-medium">Failed to submit report. Please try again or call emergency services.</p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all ${
                status === "submitting" ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {status === "submitting" ? "Submitting..." : "Send Emergency Alert"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
