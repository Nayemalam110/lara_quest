import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowLeftRight,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  CirclePlay,
  Clock,
  Eye,
  Home,
  ListChecks,
  Lock,
  Zap,
} from "lucide-react";
import { cn } from "@/utils/cn";
import {
  isLessonUnlocked,
  lessonById,
  lessonVisuals,
  moduleOfLesson,
  nextLessonOf,
} from "@/data/mockData";
import { useProgress } from "@/store/progressStore";
import { useView } from "@/store/viewStore";
import { ComparisonBridge } from "./ComparisonBridge";
import { Challenge } from "./Challenge";
import { CompletionModal } from "./CompletionModal";
import { LessonVisualView } from "./visualizers";
import type { Module } from "@/data/mockData";

function SectionHead({
  icon: Icon,
  color,
  kicker,
  title,
}: {
  icon: typeof Eye;
  color: string;
  kicker: string;
  title: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border" style={{ color, borderColor: `${color}44`, background: `${color}14` }}>
        <Icon size={16} />
      </span>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">{kicker}</div>
        <h2 className="font-display text-[17px] font-bold tracking-tight text-ink">{title}</h2>
      </div>
    </div>
  );
}

export function LessonView({ lessonId }: { lessonId: string }) {
  const lesson = lessonById(lessonId);
  const completed = useProgress((s) => s.completedLessons);
  const challengeDone = useProgress((s) => s.completedChallenges.includes(lessonId));
  const completeLesson = useProgress((s) => s.completeLesson);
  const go = useView((s) => s.go);
  const [doneModule, setDoneModule] = useState<Module | null>(null);

  if (!lesson) {
    return (
      <div className="grid min-h-[60vh] place-items-center p-8 text-center text-mut">
        Lesson not found.
      </div>
    );
  }

  const module = moduleOfLesson(lessonId)!;
  const unlocked = isLessonUnlocked(lessonId, completed);
  const lessonDone = completed.includes(lessonId);
  const idx = module.lessons.findIndex((l) => l.id === lessonId);
  const next = nextLessonOf(lessonId);
  const visual = lessonVisuals[lessonId];

  if (!unlocked) {
    return (
      <div className="grid min-h-[70vh] place-items-center p-8">
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-panel">
            <Lock size={20} className="text-dim" />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold text-ink">This lesson is still locked</h2>
          <p className="mt-1.5 max-w-[36ch] text-sm text-mut">
            Finish the previous lesson in the track to unlock it.
          </p>
          <button
            onClick={() => go({ name: "dashboard" })}
            className="mt-5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-bg"
          >
            Back to roadmap
          </button>
        </div>
      </div>
    );
  }

  const handleMarkComplete = () => {
    if (!challengeDone || lessonDone) return;
    completeLesson(lesson.id, lesson.xp);
    const allDone = module.lessons.every((l) => l.id === lesson.id || completed.includes(l.id));
    if (allDone) setDoneModule(module);
  };

  const handleModalContinue = () => {
    setDoneModule(null);
    if (next) go({ name: "lesson", lessonId: next.id });
    else go({ name: "dashboard" });
  };

  return (
    <div className="relative px-5 pb-36 pt-8 sm:px-8 lg:px-12 lg:pt-10">
      <div className="pointer-events-none absolute -top-20 right-[20%] h-56 w-56 rounded-full blur-[100px]" style={{ background: `${module.color}1f` }} />

      <div className="mx-auto flex max-w-6xl gap-10">
        {/* --------------------------- main column --------------------------- */}
        <div className="min-w-0 flex-1">
          {/* breadcrumb */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">
            <button onClick={() => go({ name: "dashboard" })} className="flex items-center gap-1 transition-colors hover:text-ink">
              <Home size={11} /> Track
            </button>
            <ChevronRight size={11} />
            <span style={{ color: module.color }}>Module {String(module.index).padStart(2, "0")}</span>
            <ChevronRight size={11} />
            <span className="text-mut">Lesson {idx + 1} of {module.lessons.length}</span>
          </div>

          {/* header */}
          <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mt-5">
            <h1 className="max-w-[20ch] font-display text-[30px] font-bold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[38px]">
              {lesson.title}
            </h1>
            <p className="mt-3 max-w-[62ch] font-serif text-[16.5px] italic leading-relaxed text-mut">
              {lesson.summary}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] text-mut">
                <Clock size={12} /> {lesson.readTime}
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[12px] font-semibold text-gold">
                <Zap size={12} /> {lesson.xp} XP
              </span>
              <span
                className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium"
                style={{ color: module.color, borderColor: `${module.color}3a`, background: `${module.color}0f` }}
              >
                {module.tagline}
              </span>
              {lessonDone && (
                <span className="flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-[12px] font-semibold text-mint">
                  <CheckCircle2 size={12} /> Completed
                </span>
              )}
            </div>
          </motion.header>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }} className="mt-10 flex flex-col gap-12">
            {/* mental model bridge */}
            <section>
              <SectionHead icon={ArrowLeftRight} color="#54c5f8" kicker="Mental model bridge" title="You already know this — in Dart" />
              <ComparisonBridge lesson={lesson} />
            </section>

            {/* concept visualizer */}
            {visual && (
              <section>
                <SectionHead icon={Eye} color="#a78bfa" kicker="Concept visualizer" title="See it, don't just read it" />
                <div className="rounded-2xl border border-white/[0.08] bg-panel p-5">
                  <LessonVisualView visual={visual} />
                </div>
              </section>
            )}

            {/* key breakdown */}
            <section>
              <SectionHead icon={BookOpenCheck} color={module.color} kicker="Key breakdown" title="The parts that matter" />
              <div className="flex flex-col gap-3">
                {lesson.content.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.45, delay: i * 0.06 }}
                    className="flex gap-4 rounded-xl border border-white/[0.07] bg-panel p-4 transition-colors hover:border-white/[0.13]"
                  >
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg font-mono text-[12px] font-bold"
                      style={{ color: module.color, background: `${module.color}14` }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[14px] leading-relaxed text-ink/90">{point}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* challenge */}
            <section>
              <SectionHead icon={ListChecks} color="#fbbf24" kicker="Prove it" title="End-of-lesson challenge" />
              <Challenge lesson={lesson} />
            </section>
          </motion.div>
        </div>

        {/* --------------------------- right rail ---------------------------- */}
        <aside className="hidden w-[280px] shrink-0 xl:block">
          <div className="sticky top-10">
            <button
              onClick={() => go({ name: "dashboard" })}
              className="mb-4 flex items-center gap-1.5 text-[13px] font-medium text-mut transition-colors hover:text-ink"
            >
              <ArrowLeft size={14} /> Back to roadmap
            </button>
            <div className="rounded-2xl border border-white/[0.08] bg-panel p-4">
              <div className="px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">In this module</div>
              <div className="mt-3 flex flex-col gap-1">
                {module.lessons.map((l, i) => {
                  const lDone = completed.includes(l.id);
                  const lOpen = isLessonUnlocked(l.id, completed);
                  const isCurrent = l.id === lesson.id;
                  return (
                    <button
                      key={l.id}
                      disabled={!lOpen}
                      onClick={() => go({ name: "lesson", lessonId: l.id })}
                      className={cn(
                        "flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all",
                        isCurrent
                          ? "border-white/[0.14] bg-white/[0.05]"
                          : lOpen
                            ? "border-transparent hover:bg-white/[0.03]"
                            : "border-transparent opacity-45"
                      )}
                    >
                      <span className="mt-0.5 shrink-0">
                        {lDone ? (
                          <CheckCircle2 size={15} className="text-mint" />
                        ) : lOpen ? (
                          <CirclePlay size={15} style={{ color: isCurrent ? module.color : "#8f94a8" }} />
                        ) : (
                          <Lock size={13} className="text-dim" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className={cn("block truncate text-[12.5px] font-medium", isCurrent ? "text-ink" : "text-mut")}>
                          {i + 1}. {l.title}
                        </span>
                        <span className="font-mono text-[10px] text-dim">{l.readTime} · {l.xp} XP</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* --------------------------- action bar ---------------------------- */}
      <div className="fixed bottom-[64px] left-0 right-0 z-30 px-4 lg:bottom-5 lg:left-[264px]">
        <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-white/[0.1] bg-[#0b0d14]/92 p-3 pl-5 shadow-[0_16px_50px_-12px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <div className="min-w-0 flex-1">
            {lessonDone ? (
              <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-mint">
                <CheckCircle2 size={14} /> Lesson complete — nicely done.
              </span>
            ) : challengeDone ? (
              <span className="text-[12.5px] font-medium text-ink">Challenge solved. Lock in your XP.</span>
            ) : (
              <span className="text-[12.5px] text-mut">Solve the challenge above to mark this lesson complete.</span>
            )}
          </div>
          <button
            onClick={handleMarkComplete}
            disabled={!challengeDone || lessonDone}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-all",
              lessonDone
                ? "cursor-default border border-mint/30 bg-mint/10 text-mint"
                : challengeDone
                  ? "bg-ink text-bg hover:-translate-y-px hover:shadow-[0_8px_24px_-6px_rgba(255,255,255,0.5)] active:scale-95"
                  : "cursor-not-allowed border border-white/10 text-dim"
            )}
          >
            {lessonDone ? <CheckCircle2 size={14} /> : <Zap size={14} />}
            {lessonDone ? `+${lesson.xp} XP earned` : "Mark complete"}
          </button>
          {lessonDone && next && (
            <button
              onClick={() => go({ name: "lesson", lessonId: next.id })}
              className="flex shrink-0 items-center gap-1 rounded-full border border-flutter/40 bg-flutter/10 px-4 py-2.5 text-[13px] font-semibold text-flutter transition-all hover:-translate-y-px hover:bg-flutter/20 active:scale-95"
            >
              Next lesson <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      <CompletionModal
        module={doneModule}
        isLastModule={!next}
        open={doneModule !== null}
        onOpenChange={(o) => !o && setDoneModule(null)}
        onContinue={handleModalContinue}
      />
    </div>
  );
}
