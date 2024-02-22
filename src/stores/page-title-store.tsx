import { create } from "zustand";

interface PageTitleInterface {
  title: string;
  setTitle: (title: string) => void;
}

const DEFAULT_PAGE_TITLE: string = "";

const usePageTitleStore = create<PageTitleInterface>((set) => ({
  title: DEFAULT_PAGE_TITLE,
  setTitle: (title: string) => set({ title }),
}));

export { usePageTitleStore };
export type { PageTitleInterface };