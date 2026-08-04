"use client";

import { useProposalState } from "@/hooks/useProposalState";
import { Plus, Trash2, Calendar } from "lucide-react";

export function ScopeBuilder({
  state,
  updateField,
  addPhase,
  updatePhase,
  removePhase,
  addDeliverable,
  updateDeliverable,
  removeDeliverable
}: {
  state: ReturnType<typeof useProposalState>["state"];
  updateField: ReturnType<typeof useProposalState>["updateField"];
  addPhase: ReturnType<typeof useProposalState>["addPhase"];
  updatePhase: ReturnType<typeof useProposalState>["updatePhase"];
  removePhase: ReturnType<typeof useProposalState>["removePhase"];
  addDeliverable: ReturnType<typeof useProposalState>["addDeliverable"];
  updateDeliverable: ReturnType<typeof useProposalState>["updateDeliverable"];
  removeDeliverable: ReturnType<typeof useProposalState>["removeDeliverable"];
}) {
  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Project Scope & Phases</h2>
          <p className="text-xs text-gray-500 mt-1">Define project implementation phases and deliverables for each phase.</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!state.hideScopeTimeline}
              onChange={(e) => updateField("hideScopeTimeline", !e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            Show Timelines
          </label>
          <button
            onClick={addPhase}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition"
          >
            <Plus size={14} /> Add Phase
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {state.phases.map((phase, index) => (
          <div key={phase.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex-1 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder={`Phase ${index + 1} Name`}
                  value={phase.name}
                  onChange={(e) => updatePhase(phase.id, "name", e.target.value)}
                  className="w-full font-semibold text-gray-800 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none pb-1 text-base"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto items-center">
                {!state.hideScopeTimeline && (
                  <div className="relative flex-1 sm:w-40">
                    <span className="absolute left-2.5 top-2 text-gray-400">
                      <Calendar size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="Duration (e.g. 2 Weeks)"
                      value={phase.duration}
                      onChange={(e) => updatePhase(phase.id, "duration", e.target.value)}
                      className="w-full pl-8 pr-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                )}
                <button
                  onClick={() => removePhase(phase.id)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                  title="Delete Phase"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Deliverables */}
            <div className="pl-2 sm:pl-4 border-l-2 border-gray-200/80 space-y-3">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Deliverables & Details</div>
              {phase.deliverables.map((del) => (
                <div key={del.id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm space-y-2 relative group">
                  <div className="flex justify-between items-center gap-2">
                    <input
                      type="text"
                      placeholder="Deliverable title (e.g. UI/UX Wireframes)"
                      value={del.label}
                      onChange={(e) => updateDeliverable(phase.id, del.id, "label", e.target.value)}
                      className="w-full text-sm font-medium text-gray-700 focus:outline-none focus:border-b border-blue-500 pb-0.5"
                    />
                    <button
                      onClick={() => removeDeliverable(phase.id, del.id)}
                      className="text-gray-400 hover:text-red-500 p-1 hover:bg-gray-100 rounded transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Remove Deliverable"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Describe the deliverables in detail..."
                    value={del.description}
                    onChange={(e) => updateDeliverable(phase.id, del.id, "description", e.target.value)}
                    className="w-full text-xs text-gray-500 border-none resize-none focus:outline-none focus:ring-0 p-0"
                  />
                </div>
              ))}

              <button
                onClick={() => addDeliverable(phase.id)}
                className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded transition"
              >
                <Plus size={12} /> Add Deliverable
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-100">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Additional Notes or Future Scope Details
        </label>
        <textarea
          rows={6}
          value={state.customScopeContent}
          onChange={(e) => updateField("customScopeContent", e.target.value)}
          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400"
          placeholder="e.g. # Future Phases&#10;- Advanced search capabilities&#10;- Localization (Multi-language)"
        />
      </div>
    </div>
  );
}
