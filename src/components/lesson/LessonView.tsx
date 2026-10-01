import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  Zap,
  Target,
  ChevronRight,
  Trophy,
  CheckCircle2,
  Sparkles,
  Star,
  FileText,
} from "lucide-react";
import type { Lesson, Module } from "@/types";
import { lessonVisuals, nextLessonOf } from "@/data/mockData";
import { useProgressStore } from "@/store/useProgressStore";
import { useStudyToolsStore } from "@/store/useStudyToolsStore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CodeComparison } from "./CodeComparison";
import { ChallengeRunner } from "./ChallengeRunner";
import { LessonCompleteModal } from "./LessonCompleteModal";
import { LessonVisualView } from "@/components/visualizers/visualizers";
import { cn } from "@/lib/utils";

export interface LessonViewProps {
  lesson: Lesson;
  module: Module;
}

export type LessonTab = "learn" | "code" | "challenge";

export function LessonView({ lesson, module }: LessonViewProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LessonTab>("learn");
  const [showModal, setShowModal] = useState(false);

  const { completeLesson, getStats, toggleBookmark } = useProgressStore();
  const { openNotes } = useStudyToolsStore();
  const stats = getStats();
  const isCompleted = (stats.completedLessonIds || []).map(String).includes(lesson.id);
  const isBookmarked = (stats.bookmarkedLessonIds || []).includes(lesson.id);
  const hasNote = Boolean((stats.lessonNotes || {})[lesson.id]);

  const nextLesson = nextLessonOf(lesson.id);
  const visual = lessonVisuals[lesson.id];

  const handleMarkComplete = useCallback(() => {
    completeLesson(module.id, lesson.id, lesson.xp);
    setShowModal(true);
  }, [completeLesson, module.id, lesson.id, lesson.xp]);

  const handleNext = useCallback(() => {
    setShowModal(false);
    if (nextLesson) {
      navigate(`/lesson/${nextLesson.id}`);
      setActiveTab("learn");
    } else {
      navigate("/dashboard");
    }
  }, [nextLesson, navigate]);

  const tabs: { id: LessonTab; label: string; icon: React.ElementType }[] = [
    { id: "learn", label: "Lesson Content", icon: BookOpen },
    { id: "code", label: "Dart ↔ PHP Bridge", icon: Target },
    { id: "challenge", label: "Interactive Task", icon: Trophy },
  ];

  return (
    <div className="space-y-6">
      {/* Sticky Top Breadcrumb & Control Bar */}
      <div className="sticky top-0 z-30 -mx-4 -mt-6 sm:-mx-8 lg:-mx-10 border-b border-slate-800/80 bg-[#0e1424]/95 px-4 py-3 backdrop-blur-xl sm:px-8 lg:px-10 shadow-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <ChevronRight size={13} className="text-slate-600 shrink-0" />
            <span className="truncate text-xs font-mono text-slate-400 hidden sm:block">
              {module.title}
            </span>
            <ChevronRight size={13} className="text-slate-600 shrink-0 hidden sm:block" />
            <span className="truncate text-xs font-semibold text-white">
              {lesson.title}
            </span>
          </div>

          {/* Quick Stats & Badges */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden sm:flex items-center gap-1 text-xs font-mono text-slate-300">
              <Clock size={12} className="text-sky-400" /> {lesson.readTime}
            </span>
            <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 font-mono text-xs font-bold text-amber-400">
              <Zap size={11} className="fill-current" /> +{lesson.xp} XP
            </span>
            {isCompleted && (
              <span className="hidden sm:flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-400">
                <CheckCircle2 size={12} /> Done
              </span>
            )}

            {/* Bookmark Star Toggle */}
            <button
              onClick={() => toggleBookmark(lesson.id)}
              className={cn(
                "flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition cursor-pointer",
                isBookmarked
                  ? "border-amber-500/40 bg-amber-500/15 text-amber-300 shadow-sm"
                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              )}
              title={isBookmarked ? "Remove bookmark" : "Bookmark this lesson"}
            >
              <Star size={12} className={cn(isBookmarked && "fill-current text-amber-400")} />
              <span className="hidden sm:inline">{isBookmarked ? "Starred" : "Star"}</span>
            </button>

            {/* Notes Button */}
            <button
              onClick={() => openNotes(lesson.id)}
              className={cn(
                "flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition cursor-pointer",
                hasNote
                  ? "border-sky-500/40 bg-sky-500/15 text-sky-300 shadow-sm"
                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              )}
              title="Open personal study notes for this lesson"
            >
              <FileText size={12} className={cn(hasNote && "text-sky-400")} />
              <span className="hidden sm:inline">Notes</span>
              {hasNote && <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6">
        {/* Tab Selector */}
        <div className="flex rounded-2xl border border-slate-800 bg-[#111827]/90 p-1.5 shadow-md">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                  active
                    ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                )}
              >
                <Icon
                  size={15}
                  className={active ? "text-sky-400" : "text-slate-400"}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: LEARN (LESSON CONTENT) */}
        {activeTab === "learn" && (
          <div className="space-y-6 animate-fade-up">
            {/* Lesson Hero Header */}
            <div className="card-sheen relative overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]/90 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="flutter">Module {String(module.index || 1).padStart(2, "0")}</Badge>
                <Badge variant="gold">+{lesson.xp} XP</Badge>
                <span className="ml-auto font-mono text-xs text-slate-400">
                  ~{lesson.readTime} read
                </span>
              </div>

              <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                {lesson.title}
              </h1>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300 max-w-3xl">
                {lesson.summary}
              </p>
            </div>

            {/* Visualizer (if lesson provides one) */}
            {visual && (
              <div className="card-sheen overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]/90 p-6 backdrop-blur-xl shadow-xl">
                <LessonVisualView visual={visual} />
              </div>
            )}

            {/* Key Concepts (Numbered points) */}
            <div className="rounded-3xl border border-slate-800 bg-[#111827]/90 p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-sky-400 font-semibold">
                <Sparkles size={14} /> Key Architectural Concepts
              </div>

              <div className="space-y-3">
                {lesson.content.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 transition-colors hover:border-slate-700 hover:bg-slate-900/90"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-sky-500/30 bg-sky-500/10 font-mono text-xs font-bold text-sky-400">
                      {idx + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-slate-200 pt-0.5">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-6">
              <Button
                variant="outline"
                onClick={() => setActiveTab("code")}
                className="text-xs"
              >
                <Target size={14} className="text-sky-400" />
                <span>View Code Bridge</span>
              </Button>

              <div className="flex items-center gap-2.5 ml-auto">
                <Button
                  variant="primary"
                  onClick={() => setActiveTab("challenge")}
                  className="text-xs"
                >
                  <Trophy size={14} className="text-amber-400" />
                  <span>Go to Challenge</span>
                  <ArrowRight size={13} />
                </Button>

                {!isCompleted && (
                  <Button
                    variant="success"
                    onClick={handleMarkComplete}
                    className="text-xs font-semibold"
                  >
                    <CheckCircle2 size={14} />
                    <span>Mark Done</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CODE BRIDGE */}
        {activeTab === "code" && (
          <div className="space-y-6 animate-fade-up">
            <div className="card-sheen relative overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]/90 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <CodeComparison data={lesson.flutterParallel} />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("learn")}
                className="text-xs"
              >
                <ArrowLeft size={13} /> Back to Lesson
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveTab("challenge")}
                className="text-xs"
              >
                <span>Take the Challenge</span>
                <ArrowRight size={13} />
              </Button>
            </div>
          </div>
        )}

        {/* TAB 3: CHALLENGE */}
        {activeTab === "challenge" && (
          <div className="space-y-6 animate-fade-up">
            <ChallengeRunner
              lesson={lesson}
              onSuccess={() => setShowModal(true)}
            />

            {/* Bottom Actions */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("learn")}
                className="text-xs"
              >
                <ArrowLeft size={13} /> Back to Lesson
              </Button>

              {nextLesson && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/lesson/${nextLesson.id}`)}
                  className="text-xs"
                >
                  <span>Next Lesson: {nextLesson.title}</span>
                  <ArrowRight size={13} />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Completion Modal */}
      <LessonCompleteModal
        lesson={lesson}
        module={module}
        open={showModal}
        onOpenChange={setShowModal}
        onNext={handleNext}
        isLastLesson={!nextLesson}
      />
    </div>
  );
}
