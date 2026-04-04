import { create } from "zustand";

export type SelectedNavLink = "services" | "projects" | "contacts";

interface NavLinkState {
  selectedNav: SelectedNavLink;
  setSelectedNav: (nav: SelectedNavLink) => void;
  setOnScrollNav: (nav: SelectedNavLink) => void;
}

export const useNavLinkStore = create<NavLinkState>()((set) => ({
  selectedNav: "services",
  setSelectedNav: (selectedNav) => set({ selectedNav }),
  // Same setter — separated so callers can distinguish intent
  setOnScrollNav: (selectedNav) => set({ selectedNav }),
}));
