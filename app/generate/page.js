"use client";
import { useState } from "react";

export default function Generate() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setOutput("AI Generated listing will appear here once API is connected!");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Generate Listing</h1>
        <p className="text-gray-500 mb-8">Fill in the details below</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Property Details</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Property Type</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                <option>House</option>
                <option>Apartment</option>
                <option>Condo</option>
                <option>Villa</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Location</label>
              <input placeholder="e.g. Austin, Texas" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Bedrooms</label>
              <input placeholder="e.g. 3" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Bathrooms</label>
              <input placeholder="e.g. 2" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Key Features</label>
              <textarea placeholder="e.g. pool, garage, mountain view" className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Tone</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                <option>Professional</option>
                <option>Luxury</option>
                <option>Friendly</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Output Type</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                <option>Property Listing</option>
                <option>Social Media Caption</option>
                <option>Buyer Email</option>
              </select>
            </div>
            <button onClick={handleGenerate} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
              {loading ? "Generating..." : "Generate with AI"}
            </button>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Generated Output</h2>
            {output ? (
              <div>
                <p className="text-gray-700 leading-relaxed">{output}</p>
                <button className="mt-6 w-full border border-blue-600 text-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50">
                  Copy to Clipboard
                </button>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                Your generated listing will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}