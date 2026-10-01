import React from "react";
import { Outlet } from "react-router-dom";
import { BackgroundFX } from "./BackgroundFX";
import { Sidebar } from "./Sidebar";
import { MobileTopBar, MobileBottomNav } from "./MobileNav";
import { Toast } from "../ui/Toast";

export function Layout() {
  return (
    <div className="relative min-h-screen font-display text-slate-100">
      {/* Dynamic atmospheric canvas */}
      <BackgroundFX />

      {/* Desktop fixed sidebar */}
      <Sidebar />

      {/* Mobile top bar */}
      <MobileTopBar />

      {/* Main app viewport */}
      <div className="relative z-10 lg:pl-[264px]">
        <main className="min-h-screen px-4 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10 pb-24 lg:pb-12 max-w-[1440px] mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation tabs */}
      <MobileBottomNav />

      {/* Floating level up & XP toasts */}
      <Toast />
    </div>
  );
}
