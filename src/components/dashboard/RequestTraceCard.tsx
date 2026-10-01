import React from "react";
import { motion } from "framer-motion";

export function RequestTraceCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26, rotate: 5 }}
      animate={{ opacity: 1, y: 0, rotate: 3.5 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none absolute right-4 top-14 hidden w-[340px] animate-float xl:block z-10 select-none"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-700/80 bg-[#0f172a]/95 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/80 px-4 py-2.5">
          <span className="flex gap-1.5">
            <i className="h-2.5 w-2.5 rounded-full bg-rose-500/90" />
            <i className="h-2.5 w-2.5 rounded-full bg-amber-500/90" />
            <i className="h-2.5 w-2.5 rounded-full bg-emerald-500/90" />
          </span>
          <span className="font-mono text-[11px] text-slate-400 font-medium">request_trace.log</span>
          <span className="ml-auto h-2 w-2 animate-pulse-glow rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
        </div>
        <div className="space-y-2.5 px-4 py-4 font-mono text-[12px] leading-relaxed">
          <div className="text-sky-400 font-semibold">→ GET /api/posts/42</div>
          <div className="text-slate-400 text-[11px]">
            middleware: <span className="text-slate-300">auth:sanctum</span> <span className="text-emerald-400 font-bold">pass</span>
          </div>
          <div className="text-violet-400 font-medium">Post::with(&apos;user&apos;)-&gt;find(42)</div>
          <div className="text-slate-400 text-[11px]">
            select * from posts where id = 42 <span className="text-amber-400 font-semibold">(1 query)</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="rounded-md bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10.5px] font-bold text-emerald-300">
              200 OK
            </span>
            <span className="text-slate-400 text-[11px]">14ms · application/json</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-[11px] text-slate-300 shadow-inner">
            {'{ "id": 42, "title": "Production Ready",'}
            <br />
            {'  "author": { "name": "Flutter Artisan" } }'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
