import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Zap, X } from "lucide-react";
import { useProgressStore } from "@/store/useProgressStore";

export function Toast() {
  const { recentNotification, clearNotification } = useProgressStore();

  return (
    <AnimatePresence>
      {recentNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-3.5 rounded-2xl border border-slate-700 bg-slate-900/95 p-4 text-white shadow-2xl backdrop-blur-xl ring-1 ring-slate-800"
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              recentNotification.type === "level_up"
                ? "bg-pink-500/20 text-pink-400"
                : "bg-sky-400/20 text-sky-400"
            }`}
          >
            {recentNotification.type === "level_up" ? (
              <Trophy size={20} />
            ) : (
              <Zap size={20} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white truncate">
              {recentNotification.title}
            </div>
            <div className="text-xs text-slate-300 mt-0.5 truncate">
              {recentNotification.message}
            </div>
          </div>

          <button
            onClick={clearNotification}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
