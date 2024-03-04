import { create } from "zustand";

interface ColorPaletteState {
  isEnchantedEmerald: boolean;
  toggleTheme: () => void;
}

export const useColorPaletteStore = create<ColorPaletteState>((set) => ({
  isEnchantedEmerald: true,

  toggleTheme: () =>
    set((state) => ({ isEnchantedEmerald: !state.isEnchantedEmerald })),
}));

export default useColorPaletteStore;
