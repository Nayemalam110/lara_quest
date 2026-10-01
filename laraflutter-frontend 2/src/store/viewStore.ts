import { create } from "zustand";
import { persist } from "zustand/middleware";

export type View =
  | { name: "dashboard" }
  | { name: "lesson"; lessonId: string }
  | { name: "playground" };

interface ViewState {
  view: View;
  go: (view: View) => void;
}

export const useView = create<ViewState>()(
  persist(
    (set) => ({
      view: { name: "dashboard" },
      go: (view) => {
        set({ view });
        requestAnimationFrame(() => window.scrollTo({ top: 0 }));
      },
    }),
    { name: "laraflutter-view" }
  )
);
