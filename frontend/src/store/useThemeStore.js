import { create } from "zustand";

// for maintaining the global state

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("streamifytheme") || "forest",
  setTheme: (theme) => {
    localStorage.setItem("streamifytheme", theme);
    set({ theme });
  },
}));
