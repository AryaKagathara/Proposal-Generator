"use client";

import { useProposalState } from "@/hooks/useProposalState";

export function PricingPortfolio({ 
  state, 
  updateField
}: { 
  state: ReturnType<typeof useProposalState>["state"];
  updateField: ReturnType<typeof useProposalState>["updateField"];
}) {
  
  return (
    <div className="space-y-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Portfolio Links</h2>
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
          Paste your project portfolios line-by-line. Write the <strong>Project Title</strong> on one line, followed by the <strong>Project Link</strong> on the next line. Leave a blank line to separate multiple projects.
        </p>
        <textarea
          rows={10}
          value={state.portfolioRawText || ""}
          onChange={(e) => updateField("portfolioRawText", e.target.value)}
          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400"
          placeholder={`Retail Packaging Design Portfolio\nhttps://comscitechnologies.myportfolio.com/packaging-design\n\nComsci Branding Portfolio\nhttps://comscitechnologies.myportfolio.com/`}
        />
      </div>
    </div>
  );
}
