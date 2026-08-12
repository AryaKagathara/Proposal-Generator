"use client";

import { useProposalState } from "@/hooks/useProposalState";

export function HeaderForm({
  state,
  updateField
}: {
  state: ReturnType<typeof useProposalState>["state"],
  updateField: ReturnType<typeof useProposalState>["updateField"]
}) {
  return (
    <div className="space-y-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client Name / Company</label>
          <input
            type="text"
            value={state.clientName}
            onChange={(e) => updateField("clientName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Acme Corp"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
          <input
            type="email"
            value={state.clientEmail}
            onChange={(e) => updateField("clientEmail", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="client@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Date</label>
          <input
            type="date"
            value={state.projectDate}
            onChange={(e) => updateField("projectDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Requirements / Details</label>
        <textarea
          rows={4}
          value={state.projectDetails}
          onChange={(e) => updateField("projectDetails", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste or type the client's job description, project goals, and specific requirements here..."
        />
      </div>

      <div className="pt-3 border-t border-gray-100 space-y-3">
        <div className="flex items-center gap-3 mb-2">
          <input
            type="checkbox"
            id="isPreliminaryQuote"
            checked={!!state.isPreliminaryQuote}
            onChange={(e) => updateField("isPreliminaryQuote", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="isPreliminaryQuote" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
            Preliminary Quotation (uncheck for Final Quotation)
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="hideContactDetails"
            checked={!!state.hideContactDetails}
            onChange={(e) => updateField("hideContactDetails", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="hideContactDetails" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
            Hide Contact Details
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="hideAboutAndLogo"
            checked={!!state.hideAboutAndLogo}
            onChange={(e) => updateField("hideAboutAndLogo", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="hideAboutAndLogo" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
            Hide About Us & Comsci logo (for Individual)
          </label>
        </div>
      </div>
    </div>
  );
}
