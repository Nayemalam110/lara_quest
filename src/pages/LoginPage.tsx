import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Sparkles, ArrowRight, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";
import { BackgroundFX } from "@/components/layout/BackgroundFX";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginAsDemoUser, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const res = await login(email, password);
    if (res.success) {
      navigate("/dashboard");
    }
  };

  const handleDemoLogin = () => {
    loginAsDemoUser();
    navigate("/dashboard");
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
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="relative mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-slate-700 bg-gradient-to-br from-sky-400/25 via-slate-800 to-rose-500/25 shadow-lg">
            <span className="text-2xl">⚡</span>
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Welcome to{" "}
            <span className="font-mono">
              <span className="text-rose-500">Lara</span>
              <span className="text-sky-400">Quest</span>
            </span>
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Master Laravel & backend architecture through the lens of Flutter.
          </p>
        </div>

        {/* 1-Click Demo Login Banner */}
        <div className="mb-6 rounded-2xl border border-sky-400/30 bg-sky-400/10 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-2.5">
            <Sparkles size={15} />
            <span>Instant Demo Explorer (1-Click)</span>
          </div>
          <p className="text-[11.5px] text-slate-300 mb-3 leading-relaxed">
            Jump in immediately with seeded progress and unlocked modules. No password needed.
          </p>
          <Button
            type="button"
            variant="flutter"
            size="sm"
            onClick={handleDemoLogin}
            className="w-full text-xs font-semibold"
          >
            Launch Demo Mode <ArrowRight size={13} />
          </Button>
        </div>

        {/* Divider */}
        <div className="relative mb-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative bg-slate-900 px-3 font-mono text-[10px] uppercase tracking-wider text-slate-400">
            or sign in with email
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            <ShieldAlert size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="password"
                required
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
            {isLoading ? "Signing in..." : "Sign In to LaraQuest"}
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-sky-400 hover:underline">
            Create an account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
