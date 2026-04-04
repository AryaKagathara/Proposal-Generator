"use client";

import { useProposalState } from "@/hooks/useProposalState";
import { Plus, Trash2 } from "lucide-react";

export function PricingPortfolio({ 
  state, 
  addPortfolioLink,
  updatePortfolioLink,
  removePortfolioLink
}: { 
  state: ReturnType<typeof useProposalState>["state"];
  addPortfolioLink: ReturnType<typeof useProposalState>["addPortfolioLink"];
  updatePortfolioLink: ReturnType<typeof useProposalState>["updatePortfolioLink"];
  removePortfolioLink: ReturnType<typeof useProposalState>["removePortfolioLink"];
}) {
  
  return (
    <div className="space-y-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">

      {/* Portfolio Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Portfolio Links</h2>
          <button 
            onClick={addPortfolioLink}
            className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-md transition"
          >
            <Plus size={16} /> Add Link
          </button>
        </div>

        {state.portfolioLinks.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No portfolio links added.</p>
        ) : (
          <div className="space-y-3">
            {state.portfolioLinks.map((link) => (
              <div key={link.id} className="flex gap-3 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => updatePortfolioLink(link.id, "name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Project Name (e.g. Acme Redesign)"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updatePortfolioLink(link.id, "url", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
                <button 
                  onClick={() => removePortfolioLink(link.id)}
                  className="mt-2 text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
