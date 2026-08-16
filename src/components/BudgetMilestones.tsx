"use client";

import { useProposalState, getCurrencySymbol } from "@/hooks/useProposalState";
import { DollarSign, Clock, CheckCircle2, AlertCircle } from "lucide-react";

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
  const isHourly = state.pricingType === "hourly";
  const totalBudget = parseFloat(state.totalPrice) || 0;
  const currentTotalPercent = state.paymentMilestones.reduce(
    (acc, ms) => acc + (parseFloat(ms.percentage) || 0),
    0
  );
  const isOverBudget = !isHourly && !state.hideMilestones && currentTotalPercent > 100;
  const currencySymbol = getCurrencySymbol(state.currency);

  const hourlyRateNum = parseFloat(state.hourlyRate || "0");
  const estimatedHoursNum = parseFloat(state.estimatedHours || "0");
  const calculatedHourlyTotal =
    !isNaN(hourlyRateNum) && !isNaN(estimatedHoursNum) && estimatedHoursNum > 0
      ? hourlyRateNum * estimatedHoursNum
      : null;

  return (
    <div className="space-y-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Project Pricing & Financials
          </h2>
        </div>

        {/* Pricing Type Toggle */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Pricing Model
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => updateField("pricingType", "fixed")}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition ${!isHourly
                  ? "bg-white text-blue-600 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900"
                }`}
            >
              <DollarSign size={15} />
              Fixed Price Quote
            </button>
            <button
              type="button"
              onClick={() => updateField("pricingType", "hourly")}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition ${isHourly
                  ? "bg-white text-blue-600 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900"
                }`}
            >
              <Clock size={15} />
              Hourly Rate
            </button>
          </div>
        </div>

        {/* Currency Selector (shared) */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            value={state.currency}
            onChange={(e) => updateField("currency", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          >
            <option value="USD">USD ($)</option>
            <option value="EURO">EURO (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="AUD">AUD (A$)</option>
            <option value="CAD">CAD (C$)</option>
            <option value="SGD">SGD (S$)</option>
            <option value="AED">AED (AED)</option>
            <option value="SAR">SAR (SAR)</option>
            <option value="RUPEE">INR (₹)</option>
          </select>
        </div>

        {/* ================= FIXED PRICE SECTION ================= */}
        {!isHourly && (
          <>
            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Fixed Project Budget / Total Quote
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 font-medium text-sm">
                  {currencySymbol}
                </span>
                <input
                  type="text"
                  value={state.totalPrice}
                  onChange={(e) => updateField("totalPrice", e.target.value)}
                  className="w-full pl-14 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  placeholder="e.g. 1500"
                />
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mb-5">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="hideMilestones"
                    type="checkbox"
                    checked={state.hideMilestones || false}
                    onChange={(e) => updateField("hideMilestones", e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                </div>
                <div className="ml-2.5 text-xs">
                  <label
                    htmlFor="hideMilestones"
                    className="font-medium text-gray-800 cursor-pointer select-none"
                  >
                    Skip milestones (Show Fixed Quote only)
                  </label>
                  <p className="text-gray-500 mt-0.5 leading-relaxed">
                    Check this if you do not want to present milestone breakdowns at this stage. The proposal will clearly present the full Fixed Quote.
                  </p>
                </div>
              </div>
            </div>

            {state.hideMilestones ? (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-xs space-y-1 text-blue-900">
                <div className="flex items-center gap-1.5 font-semibold text-blue-800">
                  <CheckCircle2 size={15} className="text-blue-600 shrink-0" />
                  Fixed Quote Presentation Active
                </div>
                <p className="text-blue-700 leading-relaxed">
                  The proposal will display a clean Fixed Quotation of{" "}
                  <span className="font-bold">
                    {currencySymbol}{state.totalPrice || "0"}
                  </span>{" "}
                  without displaying intermediate milestone percentages.
                </p>
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Payment Milestones Breakdown
                  </h3>
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="text-xs text-blue-600 font-medium hover:text-blue-700 transition"
                  >
                    + Add Milestone
                  </button>
                </div>

                <div className="space-y-2.5">
                  {state.paymentMilestones.map((ms, index) => {
                    const perc = parseFloat(ms.percentage) || 0;
                    const calculatedAmount = totalBudget * (perc / 100);
                    const isLast = index === state.paymentMilestones.length - 1;

                    return (
                      <div
                        key={ms.id}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <span className="text-xs font-medium text-gray-500 shrink-0 w-4">
                          {index + 1}.
                        </span>

                        <input
                          type="text"
                          value={ms.name}
                          onChange={(e) =>
                            updateMilestone(ms.id, "name", e.target.value)
                          }
                          className="flex-1 min-w-0 px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          placeholder="Milestone name"
                        />

                        <div className="relative w-16 shrink-0">
                          <input
                            type="text"
                            value={ms.percentage}
                            onChange={(e) =>
                              updateMilestone(ms.id, "percentage", e.target.value)
                            }
                            className={`w-full pl-2 pr-5 py-1.5 text-xs border ${isOverBudget
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                              } rounded-md focus:outline-none focus:ring-2 bg-white`}
                            placeholder="0"
                          />
                          <span className="absolute right-1.5 top-1.5 text-gray-500 text-xs">
                            %
                          </span>
                        </div>

                        <div className="w-20 text-right text-xs font-medium text-gray-700 px-1.5 py-1.5 bg-white rounded border border-gray-200 shrink-0 truncate">
                          {currencySymbol}
                          {calculatedAmount.toFixed(0)}
                        </div>

                        {isLast ? (
                          <span className="text-[10px] text-gray-400 font-medium shrink-0 w-8 text-center">
                            FIXED
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removeMilestone(ms.id)}
                            className="text-[10px] text-red-500 hover:text-red-700 font-medium transition shrink-0 w-8 text-center"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex items-center justify-between text-xs pt-1 px-1 text-gray-500">
                    <span>Total Allocated:</span>
                    <span
                      className={`font-semibold ${isOverBudget
                          ? "text-red-600"
                          : currentTotalPercent === 100
                            ? "text-green-600"
                            : "text-gray-700"
                        }`}
                    >
                      {currentTotalPercent}%
                    </span>
                  </div>

                  {isOverBudget && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1">
                      <AlertCircle size={14} className="shrink-0" />
                      Warning: Milestones total exceeds 100%.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* ================= HOURLY RATE SECTION ================= */}
        {isHourly && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Hourly Rate
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 font-medium text-sm">
                  {currencySymbol}
                </span>
                <input
                  type="text"
                  value={state.hourlyRate || ""}
                  onChange={(e) => updateField("hourlyRate", e.target.value)}
                  className="w-full pl-14 pr-14 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  placeholder="e.g. 50"
                />
                <span className="absolute right-3 top-2 text-gray-400 text-xs font-medium">
                  / hour
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Estimated Hours (Optional)
              </label>
              <input
                type="text"
                value={state.estimatedHours || ""}
                onChange={(e) => updateField("estimatedHours", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 40 or 30-40 hours"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Leave blank if billing solely on logged hours.
              </p>
            </div>

            {calculatedHourlyTotal !== null && (
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-xs space-y-1 text-green-900">
                <div className="flex items-center justify-between font-semibold text-green-800">
                  <span>Estimated Total:</span>
                  <span className="text-sm font-bold">
                    {currencySymbol}{calculatedHourlyTotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-green-700">
                  Based on {currencySymbol}{state.hourlyRate}/hr for {estimatedHoursNum} hours.
                </p>
              </div>
            )}

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-800">Hourly Engagement Note:</span>{" "}
              The proposal will outline an hourly rate model. Milestone tables will not be shown; instead, the hourly pricing terms and logging cadence will be presented.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

