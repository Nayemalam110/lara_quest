"use client";
import { useEffect } from "react";
import { Trophy, Zap, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useConfetti } from "@/hooks/useConfetti";

interface LessonCompleteModalProps {
  lessonTitle: string;
  xp: number;
  isLastLesson: boolean;
  isModuleComplete: boolean;
  onNext: () => void;
  onClose: () => void;
}

export function LessonCompleteModal({
  lessonTitle,
  xp,
  isLastLesson,
  isModuleComplete,
  onNext,
  onClose,
}: LessonCompleteModalProps) {
  const { fire } = useConfetti();

  useEffect(() => {
    fire();
  }, [fire]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-800 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* Top gradient */}
          <div className="h-2 bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500" />

          <div className="p-8 text-center">
            {/* Trophy */}
            <div className="relative inline-flex mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/40">
                <Trophy size={36} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-violet-600 border-2 border-slate-800 flex items-center justify-center">
                <Star size={14} className="text-white fill-white" />
              </div>
            </div>

            {isModuleComplete ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">Module Complete! 🎉</h2>
                <p className="text-slate-400 text-sm mb-1">You've finished all lessons in</p>
                <p className="text-violet-300 font-semibold mb-6 text-sm">"{lessonTitle}"</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">Lesson Complete! 🎉</h2>
                <p className="text-slate-400 text-sm mb-6">
                  Excellent work on <span className="text-slate-200">"{lessonTitle}"</span>
                </p>
              </>
            )}

            {/* XP Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl mb-8">
              <Zap size={20} className="text-amber-400" />
              <span className="text-2xl font-bold text-amber-400">+{xp} XP</span>
              <span className="text-amber-500/60 text-sm">earned</span>
            </div>

            {/* Streak reminder */}
            <div className="flex items-center gap-2 justify-center mb-8 px-4 py-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl">
              <span className="text-xl">🔥</span>
              <span className="text-sm text-orange-300 font-medium">Streak extended! Keep it up tomorrow.</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {!isLastLesson && (
                <Button onClick={onNext} size="lg" className="w-full">
                  Next Lesson <ArrowRight size={16} />
                </Button>
              )}
              <Button onClick={onClose} variant="secondary" size="lg" className="w-full">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
