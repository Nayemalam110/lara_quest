import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";
import { BackgroundFX } from "@/components/layout/BackgroundFX";

export function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const res = await register(email, password, displayName);
    if (res.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <BackgroundFX />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card-sheen relative z-10 w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="relative mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-slate-700 bg-gradient-to-br from-emerald-400/25 via-slate-800 to-sky-400/25 shadow-lg">
            <span className="text-2xl">🌱</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Start Your Backend Journey
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Level up from Flutter UI to full-stack Laravel engineering.
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            <ShieldAlert size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Your Name / Developer Handle
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Flutterer"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@flutter.dev"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password (min 6 characters)
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            variant="primary"
            className="w-full mt-2"
          >
            {isLoading ? "Creating Account..." : "Create LaraQuest Account"}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-sky-400 hover:underline">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
