"use client";

import { useProposalState } from "@/hooks/useProposalState";
import { SERVICES_DATA } from "@/data/services";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { useState } from "react";

export function ScopeBuilder({
  state,
  updateField,
  addScopeItem,
  removeScopeItem,
  updateScopeItemDescription,
  updateCategoryTimeline,
  toggleCategoryScope
}: {
  state: ReturnType<typeof useProposalState>["state"];
  updateField: ReturnType<typeof useProposalState>["updateField"];
  addScopeItem: ReturnType<typeof useProposalState>["addScopeItem"];
  removeScopeItem: ReturnType<typeof useProposalState>["removeScopeItem"];
  updateScopeItemDescription: ReturnType<typeof useProposalState>["updateScopeItemDescription"];
  updateCategoryTimeline: ReturnType<typeof useProposalState>["updateCategoryTimeline"];
  toggleCategoryScope: ReturnType<typeof useProposalState>["toggleCategoryScope"];
}) {
  const [expandedCats, setExpandedCats] = useState<string[]>([]);

  const toggleCat = (id: string, e: React.MouseEvent) => {
    // prevent toggling if user clicks on the timeline input
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    setExpandedCats(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Scope & Timelines</h2>
      <div className="space-y-3">
        {SERVICES_DATA.map((cat) => {
          const isExpanded = expandedCats.includes(cat.id);
          const selectedCount = state.selectedScope.filter(s => s.categoryId === cat.id).length;
          const isAllSelected = selectedCount === cat.items.length && cat.items.length > 0;

          return (
            <div key={cat.id} className={`border ${selectedCount > 0 ? "border-blue-200" : "border-gray-200"} rounded-lg overflow-hidden`}>
              <div
                onClick={(e) => toggleCat(cat.id, e)}
                className={`w-full flex items-center justify-between p-4 cursor-pointer transition ${selectedCount > 0 ? "bg-blue-50 hover:bg-blue-100" : "bg-gray-50 hover:bg-gray-100"}`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="pt-1 flex items-center justify-center mr-1" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategoryScope(cat.id, cat.items, !isAllSelected);
                      }}
                      className={`w-5 h-5 rounded border ${isAllSelected ? 'bg-blue-500 border-blue-500 flex items-center justify-center' : 'border-gray-300 bg-white'}`}
                      title={isAllSelected ? "Deselect All" : "Select All"}
                    >
                      {isAllSelected && <Check size={14} className="text-white" />}
                    </button>
                  </div>
                  <span className="font-medium text-gray-800 whitespace-nowrap">{cat.title}</span>
                  {selectedCount > 0 && (
                    <>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {selectedCount} selected
                      </span>
                      <div className="ml-auto mr-4 max-w-[200px]" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          placeholder="Timeline (e.g. 2 Weeks)"
                          value={state.categoryTimelines[cat.id] || ""}
                          onChange={(e) => updateCategoryTimeline(cat.id, e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                      </div>
                    </>
                  )}
                </div>
                {isExpanded ? <ChevronUp size={20} className="text-gray-500 flex-shrink-0" /> : <ChevronDown size={20} className="text-gray-500 flex-shrink-0" />}
              </div>

              {isExpanded && (
                <div className="p-4 bg-white space-y-4 border-t border-gray-100">
                  {cat.items.map((sub) => {
                    const selectedItem = state.selectedScope.find(s => s.subServiceId === sub.id);
                    const checked = !!selectedItem;

                    return (
                      <div key={sub.id} className="flex gap-3">
                        <div className="pt-1">
                          <button
                            onClick={() => {
                              if (checked) {
                                removeScopeItem(sub.id);
                              } else {
                                addScopeItem({
                                  categoryId: cat.id,
                                  subServiceId: sub.id,
                                  label: sub.label,
                                  description: sub.defaultDescription
                                });
                              }
                            }}
                            className={`w-5 h-5 rounded border ${checked ? 'bg-blue-500 border-blue-500 flex items-center justify-center' : 'border-gray-300'}`}
                          >
                            {checked && <Check size={14} className="text-white" />}
                          </button>
                        </div>
                        <div className="flex-1">
                          <label className={`block font-medium ${checked ? 'text-gray-900' : 'text-gray-600'}`}>
                            {sub.label}
                          </label>
                          {checked ? (
                            <textarea
                              rows={2}
                              value={selectedItem.description}
                              onChange={(e) => updateScopeItemDescription(sub.id, e.target.value)}
                              className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <p className="text-sm text-gray-500 mt-1">{sub.defaultDescription}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Additional Scope Details (Paste AI Content, Titles, Bullet Points)
        </label>
        <textarea
          rows={6}
          value={state.customScopeContent}
          onChange={(e) => updateField("customScopeContent", e.target.value)}
          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400"
          placeholder="e.g. # Advanced Features&#10;- User Authentication&#10;- Payment Integration"
        />
      </div>
    </div>
  );
}
