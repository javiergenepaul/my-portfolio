import { create } from "zustand";

interface MobileAppState {
  isAppOpen: boolean;
  setIsAppOpen: (isOpen: boolean) => void;
}

export const useMobileAppStore = create<MobileAppState>()((set) => ({
  isAppOpen: false,
  setIsAppOpen: (isOpen) => set({ isAppOpen: isOpen }),
}));
