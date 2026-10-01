import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, GraduationCap, Sparkles, Trophy, X, Zap } from "lucide-react";
import type { Module } from "@/data/mockData";
import { moduleFanfare } from "@/lib/fx";

interface Props {
  module: Module | null;
  isLastModule: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export function CompletionModal({ module, isLastModule, open, onOpenChange, onContinue }: Props) {
  useEffect(() => {
    if (open) {
      const t = setTimeout(moduleFanfare, 150);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!module) return null;
  const moduleXp = module.lessons.reduce((s, l) => s + l.xp + (l.challenge.xp ?? 25), 0);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay-anim fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="dialog-content-anim fixed left-1/2 top-1/2 z-50 w-[min(440px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/10 bg-panel shadow-2xl">
          <div
            className="h-1.5 w-full"
            style={{ background: `linear-gradient(90deg, #54c5f8, #a78bfa, ${module.color})` }}
          />
          <div className="p-7">
            <Dialog.Close className="absolute right-4 top-4 rounded-full p-1.5 text-mut transition-colors hover:bg-white/[0.06] hover:text-ink">
              <X size={16} />
            </Dialog.Close>

            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-gold/30 bg-gold/10 shadow-[0_0_40px_rgba(251,191,36,0.25)]">
              <Trophy size={28} className="text-gold" />
            </div>

            <Dialog.Title className="text-center font-display text-[22px] font-bold tracking-tight text-ink">
              {isLastModule ? "Track complete." : "Module cleared."}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-center text-[13.5px] leading-relaxed text-mut">
              {isLastModule
                ? "Every concept from schema design to token auth — done. Your Flutter apps now have a backend brain."
                : `You finished ${module.title}. The next module is now unlocked on your roadmap.`}
            </Dialog.Description>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-center">
                <div className="flex items-center justify-center gap-1 font-mono text-lg font-bold text-gold">
                  <Zap size={14} /> +{moduleXp}
                </div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-dim">module xp</div>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-center">
                <div className="flex items-center justify-center gap-1 font-mono text-lg font-bold text-flutter">
                  <GraduationCap size={15} /> {module.lessons.length}/{module.lessons.length}
                </div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-dim">lessons done</div>
              </div>
            </div>

            <button
              onClick={onContinue}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-[14px] font-semibold text-bg transition-all hover:-translate-y-px hover:shadow-[0_10px_30px_-8px_rgba(255,255,255,0.4)] active:scale-[0.98]"
            >
              {isLastModule ? (
                <>
                  <Sparkles size={15} /> Back to roadmap
                </>
              ) : (
                <>
                  Start next lesson <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
