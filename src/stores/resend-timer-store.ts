import { create } from "zustand";

interface ResendTimerState {
  timer: number;
  setTimer: (seconds: number) => void;
  decrementTimer: () => void;
}

export const useResendTimerStore = create<ResendTimerState>()((set) => ({
  timer: 0,
  setTimer: (timer) => set({ timer }),
  decrementTimer: () => set((state) => ({ timer: Math.max(0, state.timer - 1) })),
}));
