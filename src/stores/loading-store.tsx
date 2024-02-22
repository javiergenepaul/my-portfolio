import { create } from "zustand";

interface LoadingStoreInterface {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const DEFAULT_LOADING: boolean = false;

const useLoadingStore = create<LoadingStoreInterface>((set) => ({
  loading: DEFAULT_LOADING,
  setLoading: (loading: boolean) => set({ loading }),
}));

export { useLoadingStore };
export type {LoadingStoreInterface}