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
    </div>
  );
}
