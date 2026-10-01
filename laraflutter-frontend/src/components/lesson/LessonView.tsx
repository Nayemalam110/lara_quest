"use client";
import { useState, useCallback } from "react";
import {
  ArrowLeft, CheckCircle, ArrowRight, BookOpen, Clock, Zap,
  Target, ChevronRight, Trophy,
} from "lucide-react";
import { type Lesson, type Module, modules } from "@/data/mockData";
import { useProgressStore } from "@/store/useProgressStore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CodeComparison } from "./CodeComparison";
import { SchemaVisualizer } from "./SchemaVisualizer";
import { ChallengeRunner } from "./ChallengeRunner";
import { LessonCompleteModal } from "./LessonCompleteModal";
import { cn } from "@/lib/utils";

interface LessonViewProps {
  lesson: Lesson;
  module: Module;
  onBack: () => void;
  onNavigate: (lessonId: string) => void;
}

type Tab = "learn" | "code" | "challenge";

export function LessonView({ lesson, module, onBack, onNavigate }: LessonViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("learn");
  const [showModal, setShowModal] = useState(false);
  const { completeLesson, isLessonCompleted } = useProgressStore();

  const completed = isLessonCompleted(lesson.id);

  const currentIdx = module.lessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = module.lessons[currentIdx + 1];
  const isLastLesson = !nextLesson;

  // Check if all lessons in this module are done (after this one)
  const allLessonIds = module.lessons.map((l) => l.id);
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const isModuleComplete =
    allLessonIds.every((id) => id === lesson.id || completedLessons.includes(id));

  const handleChallengeComplete = useCallback(() => {
    if (!completed) {
      completeLesson(lesson.id, lesson.xp);
      setShowModal(true);
    }
  }, [completed, completeLesson, lesson.id, lesson.xp]);

  const handleMarkComplete = useCallback(() => {
    if (!completed) {
      completeLesson(lesson.id, lesson.xp);
      setShowModal(true);
    }
  }, [completed, completeLesson, lesson.id, lesson.xp]);

  const handleNext = useCallback(() => {
    setShowModal(false);
    if (nextLesson) {
      onNavigate(nextLesson.id);
    } else {
      onBack();
    }
  }, [nextLesson, onBack, onNavigate]);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "learn", label: "Lesson", icon: BookOpen },
    { id: "code", label: "Code Bridge", icon: Target },
    { id: "challenge", label: "Challenge", icon: Trophy },
  ];

  return (
    <div className="min-h-screen">
      {/* Top navigation bar */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-slate-900/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Back + breadcrumb */}
            <div className="flex items-center gap-2 min-w-0">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft size={14} />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
              <ChevronRight size={14} className="text-slate-600 shrink-0" />
              <span className="text-xs text-slate-400 truncate hidden sm:block">{module.title}</span>
              <ChevronRight size={14} className="text-slate-600 shrink-0 hidden sm:block" />
              <span className="text-xs text-white font-medium truncate">{lesson.title}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock size={12} />
                <span>{lesson.readTime}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-400">
                <Zap size={12} />
                <span className="font-bold">{lesson.xp} XP</span>
              </div>
              {completed && (
                <Badge variant="success">
                  <CheckCircle size={10} /> Completed
                </Badge>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-3 border-t border-white/5 pt-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  )}
                >
                  <Icon size={13} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Lesson title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className={cn("w-2 h-2 rounded-full bg-gradient-to-r", module.color)} />
            <span className="text-xs text-slate-400 font-medium">{module.title}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
            {lesson.title}
          </h1>
          <p className="text-slate-400 leading-relaxed max-w-3xl">{lesson.summary}</p>
        </div>

        {/* --- LEARN TAB --- */}
        {activeTab === "learn" && (
          <div className="space-y-6">
            {/* Schema Visualizer (if lesson has schema) */}
            {lesson.schema && lesson.schema.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-5 h-0.5 bg-violet-500 rounded-full" />
                  Schema Diagram
                </h2>
                <SchemaVisualizer tables={lesson.schema} />
              </div>
            )}

            {/* Key Concepts */}
            <div>
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-5 h-0.5 bg-violet-500 rounded-full" />
                Key Concepts
              </h2>
              <div className="space-y-3">
                {lesson.content.map((point, idx) => {
                  const parts = point.split(/\*\*(.*?)\*\*/g);
                  return (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 rounded-xl border border-white/5 bg-slate-800/40 hover:border-white/10 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-400 shrink-0 mt-0.5 group-hover:bg-violet-600/30 transition-colors">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {parts.map((part, i) =>
                          i % 2 === 1 ? (
                            <strong key={i} className="text-white font-semibold">
                              {part}
                            </strong>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
              <Button
                onClick={() => setActiveTab("code")}
                variant="secondary"
                size="lg"
              >
                <Target size={16} />
                View Code Bridge
              </Button>
              <Button
                onClick={() => setActiveTab("challenge")}
                size="lg"
              >
                <Trophy size={16} />
                Go to Challenge
                <ArrowRight size={16} />
              </Button>
              {!completed && (
                <Button onClick={handleMarkComplete} variant="success" size="lg">
                  <CheckCircle size={16} />
                  Mark as Complete
                </Button>
              )}
            </div>
          </div>
        )}

        {/* --- CODE BRIDGE TAB --- */}
        {activeTab === "code" && (
          <div className="space-y-6">
            <CodeComparison data={lesson.flutterParallel} />

            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
              <Button onClick={() => setActiveTab("learn")} variant="secondary" size="lg">
                <ArrowLeft size={16} /> Back to Lesson
              </Button>
              <Button onClick={() => setActiveTab("challenge")} size="lg">
                <Trophy size={16} />
                Take the Challenge
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* --- CHALLENGE TAB --- */}
        {activeTab === "challenge" && (
          <div className="space-y-6 max-w-2xl">
            <ChallengeRunner
              challenge={lesson.challenge}
              xp={lesson.xp}
              onComplete={handleChallengeComplete}
              isCompleted={completed}
            />

            {/* Navigation */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
              <Button onClick={() => setActiveTab("learn")} variant="secondary" size="lg">
                <ArrowLeft size={16} /> Back to Lesson
              </Button>
              {nextLesson && completed && (
                <Button onClick={() => onNavigate(nextLesson.id)} size="lg">
                  Next: {nextLesson.title.slice(0, 25)}...
                  <ArrowRight size={16} />
                </Button>
              )}
              {isLastLesson && completed && (
                <Button onClick={onBack} variant="success" size="lg">
                  <CheckCircle size={16} />
                  Back to Dashboard
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Completion Modal */}
      {showModal && (
        <LessonCompleteModal
          lessonTitle={lesson.title}
          xp={lesson.xp}
          isLastLesson={isLastLesson}
          isModuleComplete={isModuleComplete}
          onNext={handleNext}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
