"use client";
import {
  Database, Server, GitBranch, Shield, Layers, Lock,
  CheckCircle, Lock as LockIcon, ChevronRight, Zap, BookOpen,
} from "lucide-react";
import { type Module } from "@/data/mockData";
import { useProgressStore } from "@/store/useProgressStore";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = {
  Database, Server, GitBranch, Shield, Layers, Lock,
};

interface ModuleCardProps {
  module: Module;
  index: number;
  isUnlocked: boolean;
  onSelectLesson: (lessonId: string) => void;
}

export function ModuleCard({ module, index, isUnlocked, onSelectLesson }: ModuleCardProps) {
  const { completedLessons, isLessonCompleted } = useProgressStore();
  const lessonIds = module.lessons.map((l) => l.id);
  const completedCount = lessonIds.filter((id) => completedLessons.includes(id)).length;
  const progress = lessonIds.length > 0 ? Math.round((completedCount / lessonIds.length) * 100) : 0;
  const isModuleComplete = completedCount === lessonIds.length && lessonIds.length > 0;

  const Icon = ICONS[module.icon] ?? Database;

  return (
    <div
      className={cn(
        "rounded-2xl border overflow-hidden transition-all duration-300",
        isUnlocked
          ? "border-white/10 bg-slate-800/50 hover:border-white/20 hover:bg-slate-800/70"
          : "border-white/5 bg-slate-900/30 opacity-60"
      )}
    >
      {/* Module Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Module number + icon */}
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shrink-0",
              isUnlocked ? module.color : "from-slate-700 to-slate-800"
            )}>
              {isUnlocked ? (
                <Icon size={22} className="text-white" />
              ) : (
                <LockIcon size={22} className="text-slate-500" />
              )}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-0.5">Module {index + 1}</p>
              <h3 className={cn(
                "font-bold text-sm leading-tight",
                isUnlocked ? "text-white" : "text-slate-500"
              )}>
                {module.title}
              </h3>
            </div>
          </div>

          {/* Status badge */}
          <div className="shrink-0">
            {isModuleComplete ? (
              <span className="flex items-center gap-1 text-[10px] px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-medium">
                <CheckCircle size={10} /> Done
              </span>
            ) : isUnlocked ? (
              <span className="flex items-center gap-1 text-[10px] px-2 py-1 bg-violet-500/20 text-violet-400 border border-violet-500/30 rounded-full font-medium">
                Active
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] px-2 py-1 bg-slate-700/50 text-slate-500 border border-slate-600/30 rounded-full font-medium">
                <LockIcon size={10} /> Locked
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
          {module.description}
        </p>

        {/* XP & lesson count */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1 text-xs text-amber-400">
            <Zap size={11} />
            <span className="font-bold">{module.totalXp} XP</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <BookOpen size={11} />
            <span>{module.lessons.length} lessons</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <CheckCircle size={11} />
            <span>{completedCount}/{module.lessons.length} done</span>
          </div>
        </div>

        {/* Progress bar */}
        <ProgressBar
          value={progress}
          size="sm"
          gradient={isModuleComplete ? "from-emerald-500 to-teal-500" : "from-violet-500 to-purple-500"}
        />
      </div>

      {/* Lessons List */}
      {isUnlocked && (
        <div className="border-t border-white/5">
          {module.lessons.map((lesson, lessonIdx) => {
            const completed = isLessonCompleted(lesson.id);
            return (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-5 py-3 text-left transition-all",
                  "border-b border-white/5 last:border-b-0",
                  "hover:bg-white/5 group"
                )}
              >
                {/* Lesson number/check */}
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all",
                  completed
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-700/80 text-slate-400 border border-slate-600/50 group-hover:border-violet-500/50 group-hover:text-violet-400"
                )}>
                  {completed ? <CheckCircle size={13} /> : lessonIdx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-xs font-medium truncate",
                    completed ? "text-emerald-400" : "text-slate-300 group-hover:text-white"
                  )}>
                    {lesson.title}
                  </p>
                  <p className="text-[10px] text-slate-500">{lesson.readTime} • {lesson.xp} XP</p>
                </div>

                <ChevronRight
                  size={14}
                  className={cn(
                    "shrink-0 transition-transform",
                    "text-slate-500 group-hover:text-violet-400 group-hover:translate-x-0.5"
                  )}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
