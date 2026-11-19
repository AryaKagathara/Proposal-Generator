"use client";

import { useState, useEffect } from "react";

export type PaymentMilestone = {
  id: string;
  name: string;
  percentage: string;
};

export const getCurrencySymbol = (currency: string, forPdf = false) => {
  switch (currency) {
    case 'EURO': return 'EURO ';
    case 'GBP': return 'GBP ';
    case 'RUPEE': return 'INR ';
    case 'AUD': return 'AUD ';
    case 'CAD': return 'CAD ';
    case 'SGD': return 'SGD ';
    case 'AED': return 'AED ';
    case 'SAR': return 'SAR ';
    case 'USD':
    default: return 'USD ';
  }
};

export const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export type PortfolioLink = {
  id: string;
  name: string;
  url: string;
};

export type PhaseDeliverable = {
  id: string;
  label: string;
  description: string;
};

export type Phase = {
  id: string;
  name: string;
  duration: string;
  deliverables: PhaseDeliverable[];
};

export type SelectedScopeItem = {
  categoryId: string;
  subServiceId: string;
  label: string;
  description: string;
};

export type ProposalState = {
  clientName: string;
  clientEmail: string;
  projectDate: string;
  agencyLogoOverride: string;
  projectDetails: string;
  selectedScope: SelectedScopeItem[];
  categoryTimelines: Record<string, string>; // e.g. { "logo-identity": "2 Weeks" }
  pricingType?: 'fixed' | 'hourly';
  hourlyRate?: string;
  estimatedHours?: string;
  paymentMilestones: PaymentMilestone[];
  portfolioLinks: PortfolioLink[];
  portfolioRawText: string;
  totalPrice: string;
  currency: string;
  customScopeContent: string;
  hideContactDetails?: boolean;
  hideAboutAndLogo?: boolean;
  hideMilestones?: boolean;
  hideScopeTimeline?: boolean;
  isPreliminaryQuote?: boolean;
  isFinalQuotation?: boolean;
  phases: Phase[];
};

const defaultState: ProposalState = {
  clientName: "",
  clientEmail: "",
  projectDate: getTodayDateString(),
  agencyLogoOverride: "",
  projectDetails: "",
  selectedScope: [],
  categoryTimelines: {},
  pricingType: "fixed",
  hourlyRate: "",
  estimatedHours: "",
  paymentMilestones: [
    { id: "ms-1", name: "Advance", percentage: "50" },
    { id: "ms-final", name: "Final Delivery", percentage: "50" }
  ],
  portfolioLinks: [],
  portfolioRawText: "",
  totalPrice: "",
  currency: "USD",
  customScopeContent: "",
  hideContactDetails: false,
  hideAboutAndLogo: false,
  hideMilestones: false,
  hideScopeTimeline: false,
  isPreliminaryQuote: false,
  isFinalQuotation: false,
  phases: [
    {
      id: "phase-1",
      name: "Discovery & Design",
      duration: "2 Weeks",
      deliverables: [
        { id: "del-1-1", label: "Wireframes & Mockups", description: "Design layouts and interactive prototype of the key screens." }
      ]
    }
  ]
};

export function useProposalState() {
  const [state, setState] = useState<ProposalState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("proposalGenState_v2");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const mergedState: ProposalState = {
          ...defaultState,
          ...parsed,
          projectDate: getTodayDateString(),
        };
        if (mergedState.portfolioLinks && mergedState.portfolioLinks.length > 0 && !mergedState.portfolioRawText) {
          mergedState.portfolioRawText = mergedState.portfolioLinks.map((link: any) => `${link.name}\n${link.url}`).join("\n\n");
        }
        if (!mergedState.phases || mergedState.phases.length === 0) {
          mergedState.phases = defaultState.phases;
        }
        setState(mergedState);
      } catch (e) {
        console.error("Failed to parse stored state.");
      }
    }
    setIsLoaded(true);
  }, []);

  const saveState = () => {
    localStorage.setItem("proposalGenState_v2", JSON.stringify(state));
  };

  const updateField = <K extends keyof ProposalState>(key: K, value: ProposalState[K]) => {
    setState((prev) => {
      const nextState = { ...prev, [key]: value };
      if (key === "portfolioRawText") {
        const text = value as string;
        const blocks = text.split(/\n\s*\n/);
        const newLinks = blocks
          .map((block) => {
            const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
            if (lines.length >= 2) {
              return {
                id: Math.random().toString(36).substr(2, 9),
                name: lines[0],
                url: lines[1]
              };
            } else if (lines.length === 1) {
              return {
                id: Math.random().toString(36).substr(2, 9),
                name: lines[0],
                url: ""
              };
            }
            return null;
          })
          .filter((link): link is PortfolioLink => link !== null);
        nextState.portfolioLinks = newLinks;
      }
      return nextState;
    });
  };

  const addScopeItem = (item: SelectedScopeItem) => {
    setState((prev) => ({
      ...prev,
      selectedScope: [...prev.selectedScope, item]
    }));
  };

  const removeScopeItem = (subServiceId: string) => {
    setState((prev) => ({
      ...prev,
      selectedScope: prev.selectedScope.filter((i) => i.subServiceId !== subServiceId)
    }));
  };

  const updateScopeItemDescription = (subServiceId: string, description: string) => {
    setState((prev) => ({
      ...prev,
      selectedScope: prev.selectedScope.map((i) =>
        i.subServiceId === subServiceId ? { ...i, description } : i
      )
    }));
  };

  const updateCategoryTimeline = (categoryId: string, timeframe: string) => {
    setState((prev) => ({
      ...prev,
      categoryTimelines: {
        ...prev.categoryTimelines,
        [categoryId]: timeframe
      }
    }));
  };

  const toggleCategoryScope = (categoryId: string, items: { id: string, label: string, defaultDescription: string }[], selectAll: boolean) => {
    setState((prev) => {
      let newScope = prev.selectedScope.filter(i => i.categoryId !== categoryId);
      if (selectAll) {
        newScope = [
          ...newScope,
          ...items.map(sub => ({
            categoryId,
            subServiceId: sub.id,
            label: sub.label,
            description: sub.defaultDescription
          }))
        ];
      }
      return { ...prev, selectedScope: newScope };
    });
  };

  const addMilestone = () => {
    const newMilestone: PaymentMilestone = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      percentage: ""
    };
    setState((prev) => {
      // Insert new milestone before the last item (which is always the Final Delivery)
      const milestones = [...prev.paymentMilestones];

      // If there are no milestones, just add it. Otherwise, insert before the last one.
      if (milestones.length === 0) {
        milestones.push(newMilestone);
      } else {
        const lastMilestone = milestones.pop()!;
        milestones.push(newMilestone, lastMilestone);
      }

      return { ...prev, paymentMilestones: milestones };
    });
  };

  const updateMilestone = (id: string, field: keyof PaymentMilestone, value: string) => {
    setState((prev) => ({
      ...prev,
      paymentMilestones: prev.paymentMilestones.map((m) => m.id === id ? { ...m, [field]: value } : m)
    }));
  };

  const removeMilestone = (id: string) => {
    setState((prev) => ({
      ...prev,
      paymentMilestones: prev.paymentMilestones.filter((m) => m.id !== id)
    }));
  };

  const addPortfolioLink = () => {
    const newLink: PortfolioLink = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      url: ""
    };
    setState((prev) => ({ ...prev, portfolioLinks: [...prev.portfolioLinks, newLink] }));
  };

  const updatePortfolioLink = (id: string, field: keyof PortfolioLink, value: string) => {
    setState((prev) => ({
      ...prev,
      portfolioLinks: prev.portfolioLinks.map((p) => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const removePortfolioLink = (id: string) => {
    setState((prev) => ({
      ...prev,
      portfolioLinks: prev.portfolioLinks.filter((p) => p.id !== id)
    }));
  };

  const addPhase = () => {
    setState((prev) => {
      const nextIndex = prev.phases.length + 1;
      const newPhase: Phase = {
        id: `phase-${Math.random().toString(36).substr(2, 9)}`,
        name: `Phase ${nextIndex}: New Phase`,
        duration: "",
        deliverables: []
      };
      return { ...prev, phases: [...prev.phases, newPhase] };
    });
  };

  const updatePhase = (id: string, field: 'name' | 'duration', value: string) => {
    setState((prev) => ({
      ...prev,
      phases: prev.phases.map((p) => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const removePhase = (id: string) => {
    setState((prev) => ({
      ...prev,
      phases: prev.phases.filter((p) => p.id !== id)
    }));
  };

  const addDeliverable = (phaseId: string) => {
    setState((prev) => ({
      ...prev,
      phases: prev.phases.map((p) => {
        if (p.id !== phaseId) return p;
        const newDel: PhaseDeliverable = {
          id: `del-${Math.random().toString(36).substr(2, 9)}`,
          label: "",
          description: ""
        };
        return { ...p, deliverables: [...p.deliverables, newDel] };
      })
    }));
  };

  const updateDeliverable = (phaseId: string, deliverableId: string, field: 'label' | 'description', value: string) => {
    setState((prev) => ({
      ...prev,
      phases: prev.phases.map((p) => {
        if (p.id !== phaseId) return p;
        return {
          ...p,
          deliverables: p.deliverables.map((d) => d.id === deliverableId ? { ...d, [field]: value } : d)
        };
      })
    }));
  };

  const removeDeliverable = (phaseId: string, deliverableId: string) => {
    setState((prev) => ({
      ...prev,
      phases: prev.phases.map((p) => {
        if (p.id !== phaseId) return p;
        return {
          ...p,
          deliverables: p.deliverables.filter((d) => d.id !== deliverableId)
        };
      })
    }));
  };

  const importProposalData = (data: Partial<ProposalState>) => {
    setState((prev) => {
      const next = { ...prev };
      if (data.clientName !== undefined) next.clientName = data.clientName;
      if (data.projectDetails !== undefined) next.projectDetails = data.projectDetails;
      if (data.totalPrice !== undefined) next.totalPrice = data.totalPrice;
      if (data.pricingType !== undefined) next.pricingType = data.pricingType;
      if (data.hourlyRate !== undefined) next.hourlyRate = data.hourlyRate;
      if (data.estimatedHours !== undefined) next.estimatedHours = data.estimatedHours;
      if (data.hideMilestones !== undefined) next.hideMilestones = data.hideMilestones;
      if (data.customScopeContent !== undefined) next.customScopeContent = data.customScopeContent;
      if (data.phases !== undefined) {
        next.phases = data.phases.map((p) => ({
          id: p.id || `phase-${Math.random().toString(36).substr(2, 9)}`,
          name: p.name,
          duration: p.duration,
          deliverables: (p.deliverables || []).map((d) => ({
            id: d.id || `del-${Math.random().toString(36).substr(2, 9)}`,
            label: d.label,
            description: d.description,
          })),
        }));
      }
      if (data.paymentMilestones !== undefined) {
        next.paymentMilestones = data.paymentMilestones.map((m) => ({
          id: m.id || `ms-${Math.random().toString(36).substr(2, 9)}`,
          name: m.name,
          percentage: m.percentage,
        }));
      }
      if (data.portfolioLinks !== undefined) {
        next.portfolioLinks = data.portfolioLinks.map((pl) => ({
          id: pl.id || `pl-${Math.random().toString(36).substr(2, 9)}`,
          name: pl.name,
          url: pl.url,
        }));
        next.portfolioRawText = data.portfolioLinks.map((pl) => `${pl.name}\n${pl.url}`).join("\n\n");
      }
      return next;
    });
  };

  return {
    state,
    isLoaded,
    saveState,
    updateField,
    addScopeItem,
    removeScopeItem,
    updateScopeItemDescription,
    updateCategoryTimeline,
    toggleCategoryScope,
    addMilestone,
    updateMilestone,
    removeMilestone,
    addPortfolioLink,
    updatePortfolioLink,
    removePortfolioLink,
    addPhase,
    updatePhase,
    removePhase,
    addDeliverable,
    updateDeliverable,
    removeDeliverable,
    importProposalData
  };
}
