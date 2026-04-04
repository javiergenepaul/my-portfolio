import { create } from "zustand";

interface SiderState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useSiderStore = create<SiderState>()((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
