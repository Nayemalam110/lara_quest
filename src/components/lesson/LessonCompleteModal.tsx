import React, { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Trophy, Zap, GraduationCap, Sparkles, ArrowRight, X } from "lucide-react";
import type { Lesson, Module } from "@/types";
import { moduleFanfare } from "@/lib/fx";

export interface LessonCompleteModalProps {
  lesson: Lesson;
  module?: Module;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNext: () => void;
  isLastLesson?: boolean;
}

export function LessonCompleteModal({
  lesson,
  module,
  open,
  onOpenChange,
  onNext,
  isLastLesson,
}: LessonCompleteModalProps) {
  useEffect(() => {
    if (open) {
      const t = setTimeout(moduleFanfare, 150);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay-anim fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md" />
        <Dialog.Content className="dialog-content-anim fixed left-1/2 top-1/2 z-50 w-[min(440px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900 shadow-2xl">
          <div
            className="h-1.5 w-full"
            style={{
              background: `linear-gradient(90deg, #38bdf8, #a78bfa, ${
                module?.color || "#f43f5e"
              })`,
            }}
          />
          <div className="p-7">
            <Dialog.Close className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
              <X size={16} />
            </Dialog.Close>

            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-amber-400/30 bg-amber-400/10 shadow-[0_0_40px_rgba(251,191,36,0.25)]">
              <Trophy size={28} className="text-amber-400" />
            </div>

            <Dialog.Title className="text-center font-display text-2xl font-bold tracking-tight text-white">
              {isLastLesson ? "Module Completed!" : "Lesson Mastered!"}
            </Dialog.Title>

            <Dialog.Description className="mt-2 text-center text-sm leading-relaxed text-slate-300">
              {isLastLesson
                ? `You finished all lessons in ${module?.title || "this module"}. The next chapter awaits!`
                : `Awesome job! You conquered "${lesson.title}". Your server-side intuition is growing.`}
            </Dialog.Description>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-3 text-center">
                <div className="flex items-center justify-center gap-1 font-mono text-lg font-bold text-amber-400">
                  <Zap size={14} /> +{lesson.xp} XP
                </div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Awarded
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-3 text-center">
                <div className="flex items-center justify-center gap-1 font-mono text-lg font-bold text-emerald-400">
                  <GraduationCap size={15} /> Verified
                </div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Challenge Done
                </div>
              </div>
            </div>

            <button
              onClick={onNext}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-bold text-slate-950 transition-all hover:-translate-y-px hover:shadow-[0_10px_30px_-8px_rgba(255,255,255,0.4)] active:scale-[0.98] cursor-pointer"
            >
              {isLastLesson ? (
                <>
                  <Sparkles size={15} /> Return to Roadmap
                </>
              ) : (
                <>
                  Continue Next Lesson <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
