import { create } from "zustand";

interface SiderStoreInterface {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const DEFAULT_LOADING: boolean = false;

const useSiderStore = create<SiderStoreInterface>((set) => ({
  isOpen: DEFAULT_LOADING,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));

export { useSiderStore };
export type { SiderStoreInterface };
