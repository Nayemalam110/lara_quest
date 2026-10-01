import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  X,
  Code2,
  ExternalLink,
  Brain,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CONCEPT_FLASHCARDS } from "@/data/flashcardsData";
import { useProgressStore } from "@/store/useProgressStore";
import { popBurst } from "@/lib/fx";

interface ConceptFlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConceptFlashcardsModal({ isOpen, onClose }: ConceptFlashcardsModalProps) {
  const navigate = useNavigate();
  const [deck, setDeck] = useState(CONCEPT_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedDeck, setCompletedDeck] = useState(false);

  const { getStats, rateFlashcard } = useProgressStore();
  const { flashcardMastery } = getStats();

  const currentCard = deck[currentIndex];

  const masteredCount = Object.values(flashcardMastery || {}).filter(
    (v) => v === "mastered"
  ).length;

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompletedDeck(true);
      popBurst();
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setCompletedDeck(false);
  };

  const handleRate = (mastered: boolean) => {
    rateFlashcard(currentCard.id, mastered);
    if (mastered) {
      popBurst();
    }
    handleNext();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-indigo-500/30 bg-slate-900 shadow-2xl shadow-indigo-950/70 backdrop-blur-xl animate-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Brain className="h-4 w-4" />
            </span>
            <div>
              <span className="text-sm font-bold text-white">
                Dart ↔ Laravel Concept Flashcards
              </span>
              <span className="ml-2 text-xs text-slate-400">
                ({masteredCount}/{deck.length} Mastered)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShuffle}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
              title="Shuffle deck"
            >
              <Shuffle className="h-3.5 w-3.5" />
              Shuffle
            </button>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {completedDeck ? (
            /* Celebration Completion View */
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Review Session Complete! 🎉</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  You reviewed all {deck.length} concept flashcards. Spaced repetition solidifies
                  your server mental models for life.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleShuffle}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-950/50 hover:bg-indigo-500 transition"
                >
                  Shuffle & Review Again
                </button>
                <button
                  onClick={onClose}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                >
                  Back to Learning
                </button>
              </div>
            </div>
          ) : (
            /* Flashcard Deck View */
            <div className="space-y-4">
              {/* Progress Tracker */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">
                  Card {currentIndex + 1} of {deck.length}
                </span>
                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                  {currentCard.category}
                </span>
              </div>

              {/* Flippable 3D Card */}
              <div
                onClick={() => setIsFlipped((prev) => !prev)}
                className="group relative min-h-[300px] cursor-pointer rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-xl transition-all duration-300 hover:border-indigo-500/50"
              >
                {!isFlipped ? (
                  /* FRONT: Flutter / Dart */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-sky-500/20 px-2 py-0.5 text-[11px] font-bold text-sky-400">
                          📱 Flutter / Dart Concept
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {currentCard.flutterConcept}
                        </h4>
                      </div>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 group-hover:text-indigo-400 transition">
                        <RotateCw className="h-3 w-3" /> Flip Card
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 shadow-inner">
                      <pre className="font-mono text-xs text-sky-300 overflow-x-auto leading-relaxed">
                        <code>{currentCard.flutterSnippet}</code>
                      </pre>
                    </div>

                    <div className="pt-2 text-center text-xs text-slate-500">
                      💡 Click anywhere or press spacebar to see the Laravel counterpart
                    </div>
                  </div>
                ) : (
                  /* BACK: Laravel / PHP */
                  <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                          🐘 Laravel / PHP Counterpart
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {currentCard.laravelConcept}
                        </h4>
                      </div>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 group-hover:text-indigo-400 transition">
                        <RotateCw className="h-3 w-3" /> Flip Back
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 shadow-inner">
                      <pre className="font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                        <code>{currentCard.laravelSnippet}</code>
                      </pre>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-300 bg-slate-900/60 rounded-lg p-2.5 border border-slate-800">
                      <strong className="text-indigo-300">Mental Bridge: </strong>
                      {currentCard.explanation}
                    </p>

                    {currentCard.lessonId && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            navigate(`/lesson/${currentCard.lessonId}`);
                          }}
                          className="flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300 hover:underline"
                        >
                          Open Lesson
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Review & Mastery Rating Buttons */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition disabled:opacity-30"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Prev
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRate(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    Review Later
                  </button>
                  <button
                    onClick={() => handleRate(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 hover:from-emerald-500 hover:to-teal-500 transition"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Got It (+15 XP)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
