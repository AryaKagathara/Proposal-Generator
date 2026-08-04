"use client";

import { useProposalState, getCurrencySymbol } from "@/hooks/useProposalState";
import { HeaderForm } from "./HeaderForm";
import { ScopeBuilder } from "./ScopeBuilder";
import { PricingPortfolio } from "./PricingPortfolio";
import { BudgetMilestones } from "./BudgetMilestones";
import { ProposalDocument } from "./ProposalPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileDown, RefreshCw } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export function ProposalGenerator() {
  const { state, isLoaded, saveState, ...actions } = useProposalState();
  const [isClient, setIsClient] = useState(false);
  const [activeGenerator, setActiveGenerator] = useState<'header' | 'sidebar' | null>(null);

  // Invalidate the PDF if the user types anything
  useEffect(() => {
    setActiveGenerator(null);
  }, [state]);

  const pdfDocument = useMemo(() => (
    <ProposalDocument state={state} origin={typeof window !== 'undefined' ? window.location.origin : ''} />
  ), [state]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isLoaded || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin text-blue-500">
          <RefreshCw size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Agency Proposal Generator
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Build custom proposals for Design & Development services instantly.
            </p>
          </div>

          <div>
            {activeGenerator !== 'header' ? (
              <button
                onClick={() => { saveState(); setActiveGenerator('header'); }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 ${activeGenerator === 'sidebar' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition shadow-sm`}
                disabled={activeGenerator === 'sidebar'}
              >
                <FileDown size={18} />
                Prepare PDF
              </button>
            ) : (
              <PDFDownloadLink
                document={pdfDocument}
                fileName={`Proposal_${state.clientName.replace(/\s+/g, '_') || 'Client'}_${state.projectDate.replace(/\s+/g, '_') || 'Date'}.pdf`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition shadow-sm"
              >
                {({ loading, error }) => (
                  <>
                    <FileDown size={18} />
                    {error ? `Error: ${error.message || 'Failed'}` : loading ? 'Preparing...' : 'Download Now'}
                  </>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-7 space-y-8">
            <HeaderForm state={state} updateField={actions.updateField} />
            <ScopeBuilder
              state={state}
              updateField={actions.updateField}
              addPhase={actions.addPhase}
              updatePhase={actions.updatePhase}
              removePhase={actions.removePhase}
              addDeliverable={actions.addDeliverable}
              updateDeliverable={actions.updateDeliverable}
              removeDeliverable={actions.removeDeliverable}
            />
            <PricingPortfolio
              state={state}
              addPortfolioLink={actions.addPortfolioLink}
              updatePortfolioLink={actions.updatePortfolioLink}
              removePortfolioLink={actions.removePortfolioLink}
            />
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              <BudgetMilestones
                state={state}
                updateField={actions.updateField}
                addMilestone={actions.addMilestone}
                updateMilestone={actions.updateMilestone}
                removeMilestone={actions.removeMilestone}
              />

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Live Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Client:</span>
                    <span className="font-medium text-gray-800">{state.clientName || '---'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Scope Items:</span>
                    <span className="font-medium text-blue-600">{state.selectedScope.length}</span>
                  </div>
                  {!state.hideMilestones && (
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500">Milestones:</span>
                      <span className="font-medium text-gray-800">{state.paymentMilestones.length}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-500 font-medium">Total Cost:</span>
                    <span className="font-bold text-gray-900 text-lg">
                      {getCurrencySymbol(state.currency)}{state.totalPrice || '0'}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  {activeGenerator !== 'sidebar' ? (
                    <button
                      onClick={() => { saveState(); setActiveGenerator('sidebar'); }}
                      className={`inline-flex w-full justify-center items-center gap-2 px-5 py-3 ${activeGenerator === 'header' ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-gray-900 hover:bg-gray-800 text-white'} text-sm font-medium rounded-lg transition shadow-sm`}
                      disabled={activeGenerator === 'header'}
                    >
                      <FileDown size={18} />
                      Generate Document
                    </button>
                  ) : (
                    <PDFDownloadLink
                      document={pdfDocument}
                      fileName={`Proposal_${state.clientName.replace(/\s+/g, '_') || 'Client'}_${state.projectDate.replace(/\s+/g, '_') || 'Date'}.pdf`}
                      className="inline-flex w-full justify-center items-center gap-2 px-5 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition shadow-sm"
                    >
                      {({ loading, error }) => (
                        <>
                          <FileDown size={18} />
                          {error ? `Err: ${error.message || 'Failed'}` : loading ? 'Preparing Document...' : 'Download PDF Now'}
                        </>
                      )}
                    </PDFDownloadLink>
                  )}
                  <p className="text-xs text-gray-500 mt-3">
                    Your data is securely saved in your browser.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
