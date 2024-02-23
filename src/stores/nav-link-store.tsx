import { create } from "zustand";
type SelectedNavLink = "services" | "projects" | "contacts";

interface NavLinkStoreInterface {
  selectedNav: SelectedNavLink;
  setSelectedNav: (selectedNav: SelectedNavLink) => void;
}

const useNavLinkStore = create<NavLinkStoreInterface>((set) => {
  return {
    selectedNav: "services",
    setSelectedNav: (value: SelectedNavLink) =>
      set(() => ({ selectedNav: value })),
  };
});

export { useNavLinkStore };
export type { NavLinkStoreInterface, SelectedNavLink };
