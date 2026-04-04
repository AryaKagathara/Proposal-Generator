"use client";

import { useProposalState, getCurrencySymbol } from "@/hooks/useProposalState";

export function BudgetMilestones({
  state,
  updateField,
  addMilestone,
  updateMilestone,
  removeMilestone,
}: {
  state: ReturnType<typeof useProposalState>["state"];
  updateField: ReturnType<typeof useProposalState>["updateField"];
  addMilestone: ReturnType<typeof useProposalState>["addMilestone"];
  updateMilestone: ReturnType<typeof useProposalState>["updateMilestone"];
  removeMilestone: ReturnType<typeof useProposalState>["removeMilestone"];
}) {

  const totalBudget = parseFloat(state.totalPrice) || 0;
  const currentTotalPercent = state.paymentMilestones.reduce((acc, ms) => acc + (parseFloat(ms.percentage) || 0), 0);
  const isOverBudget = currentTotalPercent > 100;
  const currencySymbol = getCurrencySymbol(state.currency);

  return (
    <div className="space-y-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Budget & Milestones</h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Budget</label>
          <div className="flex gap-2">
            <select
              value={state.currency}
              onChange={(e) => updateField("currency", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="USD">USD</option>
              <option value="EURO">EURO</option>
              <option value="GBP">GBP</option>
              <option value="RUPEE">INR</option>
            </select>
            <div className="relative flex-1">
              <span className="absolute left-3 top-2 text-gray-500 font-medium">{currencySymbol}</span>
              <input
                type="text"
                value={state.totalPrice}
                onChange={(e) => updateField("totalPrice", e.target.value)}
                className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Milestones</h3>
            <button
              onClick={addMilestone}
              className="text-xs text-blue-600 font-medium hover:text-blue-700 transition"
            >
              + Add
            </button>
          </div>

          <div className="space-y-3">
            {state.paymentMilestones.map((ms, index) => {
              const perc = parseFloat(ms.percentage) || 0;
              const calculatedAmount = totalBudget * (perc / 100);
              const isLast = index === state.paymentMilestones.length - 1;

              return (
                <div key={ms.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-xs font-medium text-gray-500 shrink-0 w-4">{index + 1}.</span>

                  <input
                    type="text"
                    value={ms.name}
                    onChange={(e) => updateMilestone(ms.id, "name", e.target.value)}
                    className="w-[200px] shrink-0 min-w-0 px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Name"
                  />

                  <div className="relative w-16 shrink-0">
                    <input
                      type="text"
                      value={ms.percentage}
                      onChange={(e) => updateMilestone(ms.id, "percentage", e.target.value)}
                      className={`w-full pl-2 pr-5 py-1.5 text-xs border ${isOverBudget ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-md focus:outline-none focus:ring-2`}
                      placeholder="0"
                    />
                    <span className="absolute right-1.5 top-1.5 text-gray-500 text-xs">%</span>
                  </div>

                  <div className="w-[100px] w-16 text-right text-xs font-medium text-gray-700 px-1 py-1.5 bg-white rounded border border-gray-200 shrink-0 truncate">
                    {currencySymbol}{calculatedAmount.toFixed(0)}
                  </div>

                  {isLast ? (
                    <span className="text-[10px] text-gray-400 font-medium shrink-0 w-6 text-center">FIXED</span>
                  ) : (
                    <button
                      onClick={() => removeMilestone(ms.id)}
                      className="text-[10px] text-red-500 hover:text-red-700 font-medium transition shrink-0 w-6 text-center"
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })}

            {isOverBudget && (
              <p className="text-xs text-red-500 font-medium mt-1">Warning: Exceeds 100%.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
