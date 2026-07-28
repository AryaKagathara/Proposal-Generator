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
    case 'USD':
    default: return 'USD ';
  }
};

export type PortfolioLink = {
  id: string;
  name: string;
  url: string;
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
  paymentMilestones: PaymentMilestone[];
  portfolioLinks: PortfolioLink[];
  totalPrice: string;
  currency: string;
  customScopeContent: string;
  hideContactDetails?: boolean;
  hideAboutAndLogo?: boolean;
  hideMilestones?: boolean;
};

const defaultState: ProposalState = {
  clientName: "",
  clientEmail: "",
  projectDate: new Date().toISOString().split('T')[0],
  agencyLogoOverride: "",
  projectDetails: "",
  selectedScope: [],
  categoryTimelines: {},
  paymentMilestones: [
    { id: "ms-1", name: "Advance", percentage: "50" },
    { id: "ms-final", name: "Final Delivery", percentage: "50" }
  ],
  portfolioLinks: [],
  totalPrice: "",
  currency: "USD",
  customScopeContent: "",
  hideContactDetails: false,
  hideAboutAndLogo: false,
  hideMilestones: false,
};

export function useProposalState() {
  const [state, setState] = useState<ProposalState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("proposalGenState_v2");
    if (stored) {
      try {
        setState(JSON.parse(stored));
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
    setState((prev) => ({ ...prev, [key]: value }));
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
    removePortfolioLink
  };
}
