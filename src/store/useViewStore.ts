import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ActiveView } from "@/types";

interface ViewState {
  view: ActiveView;
  go: (view: ActiveView) => void;
}

export const useViewStore = create<ViewState>()(
  persist(
    (set) => ({
      view: { name: "dashboard" },
      go: (view) => {
        set({ view });
        requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      },
    }),
    { name: "laraquest-active-view" }
  )
);
