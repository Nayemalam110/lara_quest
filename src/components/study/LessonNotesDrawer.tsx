import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  FileText,
  X,
  ExternalLink,
  Trash2,
  Save,
  BookOpen,
  Sparkles,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { INITIAL_MODULES } from "@/lib/constants";
import { useProgressStore } from "@/store/useProgressStore";

interface LessonNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeLessonId?: string;
}

export function LessonNotesDrawer({
  isOpen,
  onClose,
  activeLessonId,
}: LessonNotesDrawerProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"bookmarks" | "notes">("bookmarks");
  const { getStats, toggleBookmark, saveLessonNote } = useProgressStore();
  const { bookmarkedLessonIds, lessonNotes } = getStats();

  const [currentEditId, setCurrentEditId] = useState<string>(activeLessonId || "m1l1");
  const [currentText, setCurrentText] = useState<string>(
    lessonNotes[activeLessonId || "m1l1"] || ""
  );

  // Map bookmarked IDs to actual lesson objects
  const bookmarkedLessons = INITIAL_MODULES.flatMap((m) =>
    (m.lessons || []).filter((l) => bookmarkedLessonIds.includes(l.id))
  );

  const allNotesList = Object.entries(lessonNotes || {}).map(([lessonId, text]) => {
    const lesson = INITIAL_MODULES.flatMap((m) => m.lessons || []).find(
      (l) => l.id === lessonId
    );
    return {
      lessonId,
      title: lesson?.title || `Lesson ${lessonId}`,
      text,
    };
  });

  const handleSelectNote = (lessonId: string) => {
    setCurrentEditId(lessonId);
    setCurrentText(lessonNotes[lessonId] || "");
  };

  const handleSaveNote = () => {
    saveLessonNote(currentEditId, currentText);
  };

  const handleExport = () => {
    const lines = ["# 📓 My LaraQuest Study Notes\n"];
    allNotesList.forEach((n) => {
      lines.push(`## ${n.title} (${n.lessonId})`);
      lines.push(`${n.text}\n`);
    });
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "laraquest_study_notes.md";
    a.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 p-4 bg-slate-900/90">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                <Bookmark className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-bold text-white">Study Notebook</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-800 bg-slate-950/50 p-1">
            <button
              onClick={() => setActiveTab("bookmarks")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition",
                activeTab === "bookmarks"
                  ? "bg-slate-800 text-amber-300 shadow"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              <Bookmark className="h-3.5 w-3.5" />
              Starred ({bookmarkedLessonIds.length})
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition",
                activeTab === "notes"
                  ? "bg-slate-800 text-sky-300 shadow"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              <FileText className="h-3.5 w-3.5" />
              Notes ({allNotesList.length})
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === "bookmarks" ? (
              /* Bookmarks Tab */
              <div className="space-y-3">
                {bookmarkedLessons.length === 0 ? (
                  <div className="py-16 text-center text-xs text-slate-500 space-y-2">
                    <Bookmark className="mx-auto h-8 w-8 text-slate-700" />
                    <p className="font-medium text-slate-400">No starred lessons yet</p>
                    <p>Click the ⭐️ bookmark button inside any lesson header to pin it here.</p>
                  </div>
                ) : (
                  bookmarkedLessons.map((l) => (
                    <div
                      key={l.id}
                      className="group flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 transition hover:border-slate-700 hover:bg-slate-950"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">
                            {l.id}
                          </span>
                          <h4 className="text-xs font-semibold text-slate-200 truncate">
                            {l.title}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{l.summary}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            onClose();
                            navigate(`/lesson/${l.id}`);
                          }}
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-sky-400 transition"
                          title="Open lesson"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => toggleBookmark(l.id)}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-800 hover:text-rose-400 transition"
                          title="Remove bookmark"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* Notes Tab */
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Personal Note for:
                    </label>
                    <span className="font-mono text-[11px] text-sky-400">{currentEditId}</span>
                  </div>

                  <textarea
                    rows={6}
                    value={currentText}
                    onChange={(e) => setCurrentText(e.target.value)}
                    placeholder="Write key takeaways, mental models, or code reminders..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:border-sky-500 focus:outline-none"
                  />

                  <div className="flex justify-between items-center">
                    {allNotesList.length > 0 && (
                      <button
                        onClick={handleExport}
                        className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition"
                      >
                        <Download className="h-3 w-3" />
                        Export All
                      </button>
                    )}
                    <button
                      onClick={handleSaveNote}
                      className="ml-auto flex items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-sky-500 transition"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Save Note
                    </button>
                  </div>
                </div>

                {/* All Saved Notes List */}
                {allNotesList.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <span className="text-xs font-semibold text-slate-400 block">
                      Saved Notes ({allNotesList.length})
                    </span>
                    {allNotesList.map((n) => (
                      <div
                        key={n.lessonId}
                        onClick={() => handleSelectNote(n.lessonId)}
                        className={cn(
                          "rounded-lg border p-2.5 text-xs transition cursor-pointer",
                          currentEditId === n.lessonId
                            ? "border-sky-500/50 bg-sky-500/10 text-slate-200"
                            : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                        )}
                      >
                        <div className="flex items-center justify-between font-semibold text-slate-200 mb-1">
                          <span className="truncate">{n.title}</span>
                          <span className="font-mono text-[10px] text-slate-500">
                            {n.lessonId}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-[11px] text-slate-400 font-mono">
                          {n.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
