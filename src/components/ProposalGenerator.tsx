"use client";

import { useProposalState, getCurrencySymbol, getTodayDateString } from "@/hooks/useProposalState";
import { HeaderForm } from "./HeaderForm";
import { ScopeBuilder } from "./ScopeBuilder";
import { PricingPortfolio } from "./PricingPortfolio";
import { BudgetMilestones } from "./BudgetMilestones";
import { ProposalDocument } from "./ProposalPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileDown, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { AiSidebar } from "./AiSidebar";

export function ProposalGenerator() {
  const { state, isLoaded, saveState, ...actions } = useProposalState();
  const [isClient, setIsClient] = useState(false);
  const [activeGenerator, setActiveGenerator] = useState<'header' | 'sidebar' | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Invalidate the PDF if the user types anything
  useEffect(() => {
    setActiveGenerator(null);
  }, [state]);

  const pdfDocument = useMemo(() => (
    <ProposalDocument state={state} origin={typeof window !== 'undefined' ? window.location.origin : ''} />
  ), [state]);

  const documentFileName = useMemo(() => {
    const prefix = state.isPreliminaryQuote ? "Preliminary_Quotation" : "Final_Quotation";
    const client = state.clientName.replace(/\s+/g, '_') || 'Client';
    const date = (state.projectDate || getTodayDateString()).replace(/\s+/g, '_');
    return `${prefix}_${client}_${date}.pdf`;
  }, [state.isPreliminaryQuote, state.clientName, state.projectDate]);

  const isMilestonesExceeded = useMemo(() => {
    if (state.pricingType === 'hourly') return false;
    if (state.hideMilestones) return false;
    const currentTotalPercent = state.paymentMilestones.reduce((acc, ms) => acc + (parseFloat(ms.percentage) || 0), 0);
    return currentTotalPercent > 100;
  }, [state.pricingType, state.paymentMilestones, state.hideMilestones]);

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
            <p className="mt-2 text-sm text-gray-600 font-medium">
              {process.env.NEXT_PUBLIC_APP_VERSION || "V 1.0"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAiOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition shadow-sm"
            >
              <Sparkles size={18} />
              Use AI
            </button>

            {activeGenerator !== 'header' ? (
              <button
                onClick={() => { saveState(); setActiveGenerator('header'); }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 ${activeGenerator === 'sidebar' || isMilestonesExceeded ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'} text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition shadow-sm`}
                disabled={activeGenerator === 'sidebar' || isMilestonesExceeded}
                title={isMilestonesExceeded ? "Cannot generate PDF: Milestones percentage exceeds 100%" : ""}
              >
                <FileDown size={18} />
                Prepare PDF
              </button>
            ) : (
              isMilestonesExceeded ? (
                <button
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-300 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed transition shadow-sm"
                  disabled={true}
                  title="Cannot generate PDF: Milestones percentage exceeds 100%"
                >
                  <FileDown size={18} />
                  Download Now (Disabled)
                </button>
              ) : (
                <PDFDownloadLink
                  document={pdfDocument}
                  fileName={documentFileName}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition shadow-sm"
                >
                  {({ loading, error }) => (
                    <>
                      <FileDown size={18} />
                      {error ? `Error: ${error.message || 'Failed'}` : loading ? 'Preparing...' : 'Download Now'}
                    </>
                  )}
                </PDFDownloadLink>
              )
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
              updateField={actions.updateField}
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
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Pricing Model:</span>
                    <span className="font-medium text-gray-800">
                      {state.pricingType === 'hourly' ? 'Hourly Rate' : 'Fixed Price'}
                    </span>
                  </div>
                  {state.pricingType === 'hourly' ? (
                    <>
                      {state.estimatedHours && (
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-500">Est. Hours:</span>
                          <span className="font-medium text-gray-800">{state.estimatedHours}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2">
                        <span className="text-gray-500 font-medium">Hourly Rate:</span>
                        <span className="font-bold text-gray-900 text-lg">
                          {getCurrencySymbol(state.currency)}{state.hourlyRate || '0'}/hr
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Milestones:</span>
                        <span className="font-medium text-gray-800">
                          {state.hideMilestones ? 'Skipped (Fixed Quote)' : `${state.paymentMilestones.length} staged`}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="text-gray-500 font-medium">Total Fixed Cost:</span>
                        <span className="font-bold text-gray-900 text-lg">
                          {getCurrencySymbol(state.currency)}{state.totalPrice || '0'}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  {activeGenerator !== 'sidebar' ? (
                    <button
                      onClick={() => { saveState(); setActiveGenerator('sidebar'); }}
                      className={`inline-flex w-full justify-center items-center gap-2 px-5 py-3 ${activeGenerator === 'header' || isMilestonesExceeded ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800 text-white'} text-sm font-medium rounded-lg transition shadow-sm`}
                      disabled={activeGenerator === 'header' || isMilestonesExceeded}
                      title={isMilestonesExceeded ? "Cannot generate PDF: Milestones percentage exceeds 100%" : ""}
                    >
                      <FileDown size={18} />
                      Generate Document
                    </button>
                  ) : (
                    isMilestonesExceeded ? (
                      <button
                        className="inline-flex w-full justify-center items-center gap-2 px-5 py-3 bg-gray-300 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed transition shadow-sm"
                        disabled={true}
                        title="Cannot generate PDF: Milestones percentage exceeds 100%"
                      >
                        <FileDown size={18} />
                        Download PDF (Disabled)
                      </button>
                    ) : (
                      <PDFDownloadLink
                        document={pdfDocument}
                        fileName={documentFileName}
                        className="inline-flex w-full justify-center items-center gap-2 px-5 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition shadow-sm"
                      >
                        {({ loading, error }) => (
                          <>
                            <FileDown size={18} />
                            {error ? `Err: ${error.message || 'Failed'}` : loading ? 'Preparing Document...' : 'Download PDF Now'}
                          </>
                        )}
                      </PDFDownloadLink>
                    )
                  )}
                  {isMilestonesExceeded && (
                    <p className="text-xs text-red-500 mt-2 font-medium">
                      Milestones total percentage exceeds 100%. Please adjust before generating.
                    </p>
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

      <AiSidebar
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onApply={actions.importProposalData}
      />
    </div>
  );
}
