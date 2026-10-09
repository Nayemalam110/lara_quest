import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white px-4 py-2.5 shadow-xl text-center text-xs font-medium"
        >
          <div className="flex items-center justify-center gap-2 max-w-4xl mx-auto">
            <WifiOff size={15} className="shrink-0 text-amber-200 animate-pulse" />
            <span>
              <strong>Offline Mode Active:</strong> You're currently disconnected from the internet. All 24 curriculum modules, flashcards, and notes remain 100% accessible locally.
            </span>
            <span className="hidden sm:inline-block rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-mono font-semibold">
              IndexedDB / Cache
            </span>
          </div>
        </motion.div>
      )}

      {showReconnected && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 py-2 shadow-xl text-center text-xs font-medium"
        >
          <div className="flex items-center justify-center gap-2 max-w-4xl mx-auto">
            <Wifi size={14} className="shrink-0 text-emerald-200" />
            <span>
              <strong>Back Online!</strong> Connection re-established. Local progress automatically synced.
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OfflineBanner;
