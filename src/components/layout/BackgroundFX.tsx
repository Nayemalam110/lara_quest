import React from "react";

export function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Deep Canvas Background */}
      <div className="absolute inset-0 bg-[#0b0f19]" />

      {/* Atmospheric Soft Gradient Radiance */}
      <div className="absolute -top-32 left-[18%] h-[400px] w-[500px] rounded-full bg-[#38bdf8]/[0.05] blur-[120px]" />
      <div className="absolute top-[20%] right-[10%] h-[350px] w-[420px] rounded-full bg-[#8b5cf6]/[0.04] blur-[120px]" />
      <div className="absolute bottom-[5%] left-[25%] h-[360px] w-[450px] rounded-full bg-[#f43f5e]/[0.035] blur-[130px]" />

      {/* Fine Background Grid */}
      <div className="bg-grid absolute inset-0 opacity-40" />

      {/* Subtle Terminal Watermark */}
      <div className="absolute bottom-6 right-8 hidden select-none font-mono text-[10px] tracking-[0.25em] text-slate-700 xl:block">
        php artisan serve — port 8000 · OK
      </div>
    </div>
  );
}
