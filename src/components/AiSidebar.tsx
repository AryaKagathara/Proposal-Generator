"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Loader2 } from "lucide-react";

interface AiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: any) => void;
}

export function AiSidebar({ isOpen, onClose, onApply }: AiSidebarProps) {
  const [apiKey, setApiKey] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [userProposal, setUserProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedData, setGeneratedData] = useState<any>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("gemini_api_key");
      if (savedKey) {
        setApiKey(savedKey);
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    setGeneratedData(null);

    // Save API key to localStorage if entered
    if (apiKey.trim()) {
      localStorage.setItem("gemini_api_key", apiKey.trim());
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription,
          userProposal,
          apiKey: apiKey.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate proposal content");
      }

      setGeneratedData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedData) {
      // Remove previewText before applying to proposal state to keep it clean
      const { previewText, ...structuredFields } = generatedData;
      onApply(structuredFields);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Overlay backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-purple-50">
            <div className="flex items-center gap-2 text-purple-900">
              <Sparkles className="h-5 w-5 text-purple-600 animate-pulse" />
              <h2 className="text-lg font-bold">AI Proposal Assistant</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* API Key */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Gemini API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter Gemini API Key (or configure GEMINI_API_KEY in env)"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-[10px] text-gray-400">
                Your key is stored securely in your local browser storage.
              </p>
            </div>

            {/* Job Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Client Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job post or requirements here..."
                rows={5}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans"
              />
            </div>

            {/* Written Proposal */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                My Proposal Draft (Optional)
              </label>
              <textarea
                value={userProposal}
                onChange={(e) => setUserProposal(e.target.value)}
                placeholder="Paste your draft proposal, notes, or specific points you want the AI to include..."
                rows={5}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={loading || !jobDescription.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-medium rounded-lg shadow-sm transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating structured content...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Proposal Content
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-150 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Generated Preview */}
            {generatedData && (
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  Generated Proposal Preview
                </h3>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {generatedData.previewText || "No preview text generated."}
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!generatedData}
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 rounded-lg text-sm font-medium shadow-sm transition"
            >
              Apply Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
