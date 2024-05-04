import { create } from "zustand";

interface ResendTimerStoreInterface {
  timer: number;
  setTimer: (timer: number) => void;
}

const TIMER_LOCAL: string = "vite-feat-timer";

const useResendTimerStore = create<ResendTimerStoreInterface>((set) => ({
  timer: parseInt(localStorage.getItem(TIMER_LOCAL) as string) || 0,
  setTimer: (timer: number) => {
    localStorage.setItem(TIMER_LOCAL, timer.toString());
    set({ timer });
  },
}));

export { useResendTimerStore };
export type { ResendTimerStoreInterface };
