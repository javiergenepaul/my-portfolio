import { create } from "zustand";
type SelectedNavLink = "services" | "projects" | "contacts";

interface NavLinkStoreInterface {
  selectedNav: SelectedNavLink;
  setSelectedNav: (selectedNav: SelectedNavLink) => void;
  setOnScrollNav: (selectedNav: SelectedNavLink) => void;
}

const useNavLinkStore = create<NavLinkStoreInterface>((set, get) => {
  return {
    selectedNav: "services",
    setSelectedNav: (value: SelectedNavLink) =>
      set(() => ({ selectedNav: value })),
    setOnScrollNav: (value: SelectedNavLink) => {
      if (get().selectedNav === value) {
        return;
      }
      set(() => ({ selectedNav: value }));
    },
  };
});

export { useNavLinkStore };
export type { NavLinkStoreInterface, SelectedNavLink };
