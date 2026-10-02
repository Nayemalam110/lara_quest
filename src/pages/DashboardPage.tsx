import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Flame,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  Boxes,
  Award,
} from "lucide-react";
import { modules, totalLessons, totalXp } from "@/data/mockData";
import { useProgressStore } from "@/store/useProgressStore";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { RequestTraceCard } from "@/components/dashboard/RequestTraceCard";
import { StreakBanner } from "@/components/dashboard/StreakBanner";
import { DailyQuestCard } from "@/components/dashboard/DailyQuestCard";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { GraduationCertificateModal } from "@/components/certificate/GraduationCertificateModal";
import { Button } from "@/components/ui/Button";

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return value;
}

export function DashboardPage() {
  const { getStats } = useProgressStore();
  const stats = getStats();
  const [isCertOpen, setIsCertOpen] = useState(false);
  const completedLessonIds = (stats.completedLessonIds || []).map(String);

  const pct = Math.round((completedLessonIds.length / (totalLessons || 1)) * 100);

  const xpAnim = useCountUp(stats.xp);
  const streakAnim = useCountUp(stats.streak, 600);
  const doneAnim = useCountUp(completedLessonIds.length, 600);

  const allMinutesRemaining = modules
    .flatMap((m) => m.lessons)
    .filter((l) => !completedLessonIds.includes(l.id))
    .reduce((s, l) => s + parseInt(l.readTime || "5"), 0);

  return (
    <div className="relative">
      <div className="relative pb-20 pt-4 lg:pt-6">
        <div className="mx-auto max-w-5xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-400">
                Backend Track
              </span>
              <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-400">
                Laravel for Flutter Devs
              </span>
            </div>

            <h1 className="mt-5 max-w-[17ch] font-display text-[36px] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[52px]">
              Learn the{" "}
              <span className="font-serif font-normal italic text-gradient-brand">
                other half
              </span>{" "}
              of your app.
            </h1>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-slate-300">
              You already build beautiful clients. LaraQuest teaches you the server side —
              databases, routing, ORM, validation, and auth — by mapping every Laravel concept
              onto the Dart you already think in.
            </p>
          </motion.div>

          {/* Floating Request Trace Card */}
          <RequestTraceCard />

          {/* Top Quick Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid grid-cols-2 gap-3.5 lg:grid-cols-4"
          >
            {/* Streak Card */}
            <div className="rounded-2xl border border-slate-800 bg-[#111827]/90 p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <Flame size={18} className="text-rose-500 fill-current" />
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-slate-400 font-semibold">
                  Streak
                </span>
              </div>
              <div className="mt-2.5 font-display text-[30px] font-bold leading-none text-white">
                {streakAnim}
                <span className="ml-1 text-[13px] font-medium text-slate-400">days</span>
              </div>
            </div>

            {/* Total XP Card */}
            <div className="rounded-2xl border border-slate-800 bg-[#111827]/90 p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <Zap size={18} className="text-amber-400 fill-current" />
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-slate-400 font-semibold">
                  Total XP
                </span>
              </div>
              <div className="mt-2.5 font-display text-[30px] font-bold leading-none text-amber-400">
                {xpAnim.toLocaleString()}
              </div>
              <div className="mt-1 font-mono text-[10.5px] text-slate-400">
                of {totalXp.toLocaleString()} possible
              </div>
            </div>

            {/* Completed Lessons Card */}
            <div className="rounded-2xl border border-slate-800 bg-[#111827]/90 p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-slate-400 font-semibold">
                  Lessons
                </span>
              </div>
              <div className="mt-2.5 font-display text-[30px] font-bold leading-none text-white">
                {doneAnim}
                <span className="text-[15px] font-medium text-slate-400">/{totalLessons}</span>
              </div>
            </div>

            {/* Track Progress Ring Card */}
            <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-[#111827]/90 p-4 shadow-lg backdrop-blur-sm">
              <div className="relative">
                <ProgressRing pct={pct} />
                <span className="absolute inset-0 grid place-items-center font-mono text-[14px] font-bold text-white">
                  {pct}%
                </span>
              </div>
              <div>
                <div className="font-mono text-[10.5px] uppercase tracking-wider text-slate-400 font-semibold">
                  Progress
                </div>
                <div className="mt-1 flex items-center gap-1 text-[12px] text-slate-300">
                  <Clock size={12} className="text-sky-400" /> ~{allMinutesRemaining}m left
                </div>
              </div>
            </div>
          </motion.div>

          {/* Streak Banner & Daily Quest Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 flex flex-col gap-3.5"
          >
            <StreakBanner />
            <DailyQuestCard />

            {pct === 100 ? (
              <div className="flex flex-wrap items-center justify-between gap-3.5 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/20 via-slate-900 to-sky-500/10 p-4.5 text-emerald-300 shadow-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
                  <div>
                    <h4 className="font-serif italic font-bold text-white text-base">
                      Curriculum Mastered! (24 of 24 Modules)
                    </h4>
                    <p className="text-xs text-slate-300">
                      You hold the complete backend engineering mental model. Your verified graduation certificate is ready.
                    </p>
                  </div>
                </div>
                <Button
                  variant="brand"
                  size="sm"
                  onClick={() => setIsCertOpen(true)}
                  className="text-xs font-bold shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                >
                  <Award size={14} />
                  <span>Claim Graduation Certificate 🎓</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-[#111827]/80 px-4 py-3 text-xs text-slate-400 shadow-sm">
                <div className="flex items-center gap-2">
                  <Award size={15} className="text-amber-400 shrink-0" />
                  <span>
                    Official <strong className="text-slate-200">Certificate of Completion</strong> unlocks upon mastering all 24 modules.
                  </span>
                </div>
                <button
                  onClick={() => setIsCertOpen(true)}
                  className="font-mono text-sky-400 hover:text-sky-300 transition underline underline-offset-2 cursor-pointer font-semibold"
                >
                  Preview Certificate 🔍
                </button>
              </div>
            )}
          </motion.div>

          {/* Roadmap Section */}
          <div className="mt-14">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-sky-400 font-semibold">
                  <Sparkles size={13} /> Structured Roadmap
                </div>
                <h2 className="mt-1 font-display text-[26px] font-bold tracking-tight text-white">
                  Step-by-step. Zero backend fear.
                </h2>
              </div>
              <Link
                to="/playground"
                className="hidden items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-4 py-2 text-[12.5px] font-semibold text-slate-200 transition-all hover:border-sky-400 hover:text-white hover:bg-sky-500/10 shadow-sm sm:flex"
              >
                <Boxes size={15} className="text-sky-400" />
                <span>Open Schema Playground</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>

            {/* Vertical Spine */}
            <div className="relative">
              <div className="absolute bottom-10 left-[17.5px] top-8 w-px bg-gradient-to-b from-sky-500/50 via-slate-700 to-rose-500/50 sm:left-[21.5px]" />
              <div className="flex flex-col gap-5">
                {modules.map((m, i) => (
                  <ModuleCard key={m.id} module={m} idx={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graduation Certificate Modal */}
      <GraduationCertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
      />
    </div>
  );
}
