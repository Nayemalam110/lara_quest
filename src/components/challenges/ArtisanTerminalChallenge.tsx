import React, { useState, useRef, useEffect } from "react";
import {
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Command,
  ChevronRight,
  Info,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types";
import { useProgressStore } from "@/store/useProgressStore";
import { popBurst } from "@/lib/fx";

interface ArtisanTerminalChallengeProps {
  lesson: Lesson;
  solved: boolean;
  onSuccess?: () => void;
}

interface HistoryItem {
  id: string;
  command: string;
  output: string[];
  isError?: boolean;
}

// Built-in standard Laravel Artisan output simulators
const DEFAULT_ARTISAN_OUTPUTS: Record<string, string[]> = {
  "php artisan": [
    "Laravel Framework \x1b[32m11.23.0\x1b[0m",
    "",
    "Usage:",
    "  command [options] [arguments]",
    "",
    "Available commands:",
    "  \x1b[33mmake:model\x1b[0m         Create a new Eloquent model class",
    "  \x1b[33mmake:controller\x1b[0m    Create a new controller class",
    "  \x1b[33mmake:migration\x1b[0m     Create a new migration file",
    "  \x1b[33mmake:request\x1b[0m       Create a new form request class",
    "  \x1b[33mmigrate\x1b[0m            Run the database migrations",
    "  \x1b[33mroute:list\x1b[0m         List all registered routes",
    "  \x1b[33mtinker\x1b[0m             Interact with your application",
  ],
  "php artisan route:list": [
    "+--------+----------+-------------------+------------------+-----------------------------+------------+",
    "| Domain | Method   | URI               | Name             | Action                      | Middleware |",
    "+--------+----------+-------------------+------------------+-----------------------------+------------+",
    "|        | GET|HEAD | /                 |                  | Closure                     | web        |",
    "|        | GET|HEAD | api/v1/posts      | posts.index      | PostController@index        | api        |",
    "|        | POST     | api/v1/posts      | posts.store      | PostController@store        | api,auth   |",
    "|        | GET|HEAD | api/v1/posts/{id} | posts.show       | PostController@show         | api        |",
    "|        | PUT      | api/v1/posts/{id} | posts.update      | PostController@update       | api,auth   |",
    "|        | DELETE   | api/v1/posts/{id} | posts.destroy    | PostController@destroy      | api,auth   |",
    "+--------+----------+-------------------+------------------+-----------------------------+------------+",
  ],
  "php artisan migrate:status": [
    "+------+-------------------------------------------------------+-------+",
    "| Ran? | Migration                                             | Batch |",
    "+------+-------------------------------------------------------+-------+",
    "| Yes  | 2024_01_01_000000_create_users_table                  | 1     |",
    "| Yes  | 2024_01_01_000001_create_password_reset_tokens_table  | 1     |",
    "| Yes  | 2024_01_01_000002_create_failed_jobs_table            | 1     |",
    "| Yes  | 2024_01_01_000003_create_personal_access_tokens_table | 1     |",
    "+------+-------------------------------------------------------+-------+",
  ],
};

export function ArtisanTerminalChallenge({
  lesson,
  solved,
  onSuccess,
}: ArtisanTerminalChallengeProps) {
  const c = lesson.challenge;
  const target = c.artisanTarget;
  const { completeLesson } = useProgressStore();
  const xp = c.xp ?? lesson.xp ?? 30;

  const initialCmd = target?.initialCommand ?? "";
  const [currentInput, setCurrentInput] = useState(initialCmd);
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: "boot",
      command: "",
      output: [
        "Welcome to LaraQuest Artisan Terminal — PHP 8.3 (cli)",
        "Type 'php artisan' or a specific command to execute.",
      ],
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [submittedCommands, setSubmittedCommands] = useState<string[]>([]);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const targetCmdClean = (target?.targetCommand ?? "").trim().toLowerCase();
  const acceptable = (target?.acceptableCommands ?? [target?.targetCommand ?? ""]).map((s) =>
    s.trim().toLowerCase()
  );

  const executeCommand = (cmdToRun: string) => {
    const rawCmd = cmdToRun.trim();
    if (!rawCmd) return;

    const normalized = rawCmd.toLowerCase();
    setSubmittedCommands((prev) => [...prev, rawCmd]);
    setHistoryIndex(-1);

    // Determine output
    let outputLines: string[] = [];
    let isError = false;
    let isGoalMet = false;

    // Check custom lesson outputs
    if (target?.customOutputs && target.customOutputs[rawCmd]) {
      const custom = target.customOutputs[rawCmd];
      outputLines = Array.isArray(custom) ? custom : [custom];
    } else if (target?.customOutputs && target.customOutputs[normalized]) {
      const custom = target.customOutputs[normalized];
      outputLines = Array.isArray(custom) ? custom : [custom];
    } else if (DEFAULT_ARTISAN_OUTPUTS[normalized]) {
      outputLines = DEFAULT_ARTISAN_OUTPUTS[normalized];
    } else if (acceptable.includes(normalized) || normalized === targetCmdClean) {
      // Default success template for make:model / make:* commands
      if (normalized.includes("make:model")) {
        outputLines = [
          "",
          "   INFO  Model [app/Models/Post.php] created successfully.",
          "   INFO  Migration [database/migrations/2026_10_01_000001_create_posts_table.php] created successfully.",
          "   INFO  Controller [app/Http/Controllers/PostController.php] created successfully.",
          "   INFO  Resource [app/Http/Resources/PostResource.php] created successfully.",
        ];
      } else if (normalized.includes("migrate")) {
        outputLines = [
          "",
          "   INFO  Running migrations.",
          "",
          "  2026_10_01_000001_create_posts_table ......... 14.20ms DONE",
          "  2026_10_01_000002_create_comments_table ...... 8.65ms DONE",
          "",
          "   INFO  Database migrations completed successfully.",
        ];
      } else if (normalized.includes("make:request")) {
        outputLines = [
          "",
          "   INFO  Request [app/Http/Requests/StorePostRequest.php] created successfully.",
        ];
      } else {
        outputLines = [
          "",
          `   INFO  Command '${rawCmd}' completed successfully.`,
        ];
      }
    } else if (normalized.startsWith("clear")) {
      setHistory([]);
      setCurrentInput("");
      return;
    } else {
      isError = true;
      outputLines = [
        "",
        `   ERROR  Command "${rawCmd}" is not recognized or not applicable here.`,
        "   Tip: Try clicking one of the suggested command pills below.",
      ];
    }

    // Check if this command meets the challenge target
    if (acceptable.includes(normalized) || normalized === targetCmdClean) {
      isGoalMet = true;
      if (!solved) {
        completeLesson(lesson.id, xp);
        popBurst();
        onSuccess?.();
      }
    }

    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        command: rawCmd,
        output: outputLines,
        isError,
      },
    ]);

    setCurrentInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(currentInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (submittedCommands.length === 0) return;
      const nextIndex =
        historyIndex === -1 ? submittedCommands.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setCurrentInput(submittedCommands[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex < submittedCommands.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setCurrentInput(submittedCommands[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setCurrentInput("");
      }
    }
  };

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  const clearTerminal = () => {
    setHistory([
      {
        id: "boot-reset",
        command: "",
        output: ["Terminal buffer cleared. Ready for next Artisan command."],
      },
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Target Mission Card */}
      <div className="rounded-xl border border-sky-500/20 bg-gradient-to-r from-sky-950/30 to-indigo-950/20 p-4 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-sky-500/20 text-sky-400">
                <Command className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                Artisan CLI Mission
              </span>
            </div>
            <p className="text-sm font-medium text-slate-200">{c.question}</p>
          </div>
          {solved && (
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed (+{xp} XP)
            </div>
          )}
        </div>

        {target?.hints && target.hints.length > 0 && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-slate-900/60 p-2.5 text-xs text-slate-400">
            <Info className="h-4 w-4 shrink-0 text-sky-400/80 mt-0.5" />
            <div className="space-y-1">
              {target.hints.map((hint, idx) => (
                <p key={idx}>{hint}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Terminal Window */}
      <div className="overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950 shadow-2xl">
        {/* macOS Style Window Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="ml-3 font-mono text-xs text-slate-400">
              artisan@laraquest: ~/workspace
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearTerminal}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
              title="Clear terminal"
            >
              <RotateCcw className="h-3 w-3" />
              Clear
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="h-80 overflow-y-auto p-4 font-mono text-xs leading-relaxed text-slate-200 select-text cursor-text"
        >
          {history.map((item) => (
            <div key={item.id} className="mb-3 space-y-1">
              {item.command && (
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-emerald-400 font-bold">$</span>
                  <span className="text-slate-100 font-semibold">{item.command}</span>
                </div>
              )}
              {item.output.map((line, lIdx) => (
                <div
                  key={lIdx}
                  className={cn(
                    "whitespace-pre-wrap",
                    line.includes("INFO")
                      ? "text-emerald-400 font-semibold"
                      : line.includes("ERROR")
                      ? "text-rose-400 font-semibold"
                      : line.includes("WARNING")
                      ? "text-amber-400"
                      : item.isError
                      ? "text-rose-300"
                      : "text-slate-300"
                  )}
                >
                  {line}
                </div>
              ))}
            </div>
          ))}

          {/* Active Prompt Line */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-emerald-400 font-bold">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="php artisan ..."
              className="flex-1 bg-transparent font-mono text-xs text-slate-100 outline-none placeholder:text-slate-600 caret-emerald-400"
              autoFocus
            />
          </div>

          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Footer Controls & Quick Pills */}
        <div className="border-t border-slate-800/80 bg-slate-900/60 p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-400 mr-1">
                Suggested Commands:
              </span>
              {(
                target?.availableCommands ?? [
                  target?.targetCommand ?? "php artisan make:model Post -mcr",
                  "php artisan route:list",
                  "php artisan migrate:status",
                ]
              ).map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    setCurrentInput(cmd);
                    inputRef.current?.focus();
                  }}
                  className="group flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/80 px-2 py-1 font-mono text-[11px] text-slate-300 transition hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-300"
                >
                  <span>{cmd}</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(cmd);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-white"
                  >
                    {copiedCmd === cmd ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => executeCommand(currentInput)}
              disabled={!currentInput.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md transition hover:bg-sky-500 disabled:opacity-40"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Execute
            </button>
          </div>
        </div>
      </div>

      {/* Success banner */}
      {solved && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-emerald-300 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-emerald-200">Excellent CLI Execution! </span>
            {c.explanation}
          </div>
        </div>
      )}
    </div>
  );
}
