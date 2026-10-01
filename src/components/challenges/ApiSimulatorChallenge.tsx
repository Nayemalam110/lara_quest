import React, { useState } from "react";
import {
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Globe,
  Clock,
  Sparkles,
  Layers,
  FileJson,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types";
import { useProgressStore } from "@/store/useProgressStore";
import { popBurst } from "@/lib/fx";

interface ApiSimulatorChallengeProps {
  lesson: Lesson;
  solved: boolean;
  onSuccess?: () => void;
}

export function ApiSimulatorChallenge({
  lesson,
  solved,
  onSuccess,
}: ApiSimulatorChallengeProps) {
  const c = lesson.challenge;
  const target = c.apiTarget ?? {
    expectedMethod: "GET",
    expectedEndpoint: "/api/v1/posts",
    expectedHeaders: { Accept: "application/json" },
    response: {
      status: 200,
      statusText: "OK",
      timeMs: 42,
      body: { data: [{ id: 1, title: "Simulated Post" }] },
    },
  };

  const { completeLesson } = useProgressStore();
  const xp = c.xp ?? lesson.xp ?? 35;

  const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "DELETE">(
    target.defaultMethod ?? "GET"
  );
  const [endpoint, setEndpoint] = useState(
    target.defaultEndpoint ?? "/api/v1/"
  );
  const [activeTab, setActiveTab] = useState<"body" | "headers">("body");
  const [headerAuth, setHeaderAuth] = useState(
    target.defaultHeaders?.["Authorization"] ? true : false
  );
  const [bodyText, setBodyText] = useState(
    target.defaultBody ?? '{\n  "title": "My Post",\n  "content": "Hello World"\n}'
  );

  const [loading, setLoading] = useState(false);
  const [simulatedResponse, setSimulatedResponse] = useState<any | null>(
    solved ? target.response : null
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [justSolved, setJustSolved] = useState(false);

  const handleReset = () => {
    setMethod(target.defaultMethod ?? "GET");
    setEndpoint(target.defaultEndpoint ?? "/api/v1/");
    setHeaderAuth(false);
    setBodyText(target.defaultBody ?? "{\n\n}");
    setSimulatedResponse(null);
    setValidationError(null);
  };

  const handleSend = () => {
    if (solved) return;
    setLoading(true);
    setValidationError(null);

    setTimeout(() => {
      setLoading(false);

      // Validation logic against target requirements
      const methodMatches =
        method.toUpperCase() === target.expectedMethod.toUpperCase();
      const endpointMatches =
        endpoint.trim().toLowerCase() === target.expectedEndpoint.trim().toLowerCase();

      let headersOk = true;
      if (target.expectedHeaders?.["Authorization"]) {
        if (!headerAuth) headersOk = false;
      }

      let bodyOk = true;
      if (target.requiredBodyKeys && target.requiredBodyKeys.length > 0) {
        try {
          const parsed = JSON.parse(bodyText);
          for (const k of target.requiredBodyKeys) {
            if (!(k in parsed) || parsed[k] === "") {
              bodyOk = false;
              break;
            }
          }
        } catch {
          bodyOk = false;
        }
      }

      if (methodMatches && endpointMatches && headersOk && bodyOk) {
        setSimulatedResponse(target.response);
        setJustSolved(true);
        completeLesson(lesson.moduleId, lesson.id, xp);
        popBurst();
        if (onSuccess) setTimeout(onSuccess, 600);
      } else {
        // Construct realistic simulation error
        if (!endpointMatches) {
          setValidationError(
            `Target endpoint mismatch. Expected: ${target.expectedEndpoint}, got: ${endpoint}`
          );
          setSimulatedResponse({
            status: 404,
            statusText: "Not Found",
            timeMs: 18,
            body: { message: `Route [${endpoint}] could not be found on server.` },
          });
        } else if (!methodMatches) {
          setValidationError(
            `HTTP Method not allowed. Expected ${target.expectedMethod}, sent ${method}.`
          );
          setSimulatedResponse({
            status: 405,
            statusText: "Method Not Allowed",
            timeMs: 14,
            body: { message: `The ${method} method is not supported for this route.` },
          });
        } else if (!headersOk) {
          setValidationError(
            "Missing Authorization Bearer token header. Check the Headers tab."
          );
          setSimulatedResponse({
            status: 401,
            statusText: "Unauthorized",
            timeMs: 22,
            body: { message: "Unauthenticated. Missing or invalid Bearer token." },
          });
        } else {
          setValidationError(
            "Request payload missing required keys or contains malformed JSON."
          );
          setSimulatedResponse({
            status: 422,
            statusText: "Unprocessable Content",
            timeMs: 28,
            body: {
              message: "The given data was invalid.",
              errors: {
                payload: ["Required attributes are missing in JSON payload."],
              },
            },
          });
        }
      }
    }, 400);
  };

  const getStatusColor = (st: number) => {
    if (st >= 200 && st < 300) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (st >= 400 && st < 500) return "text-rose-400 border-rose-500/30 bg-rose-500/10";
    return "text-amber-400 border-amber-500/30 bg-amber-500/10";
  };

  return (
    <div className="space-y-4">
      {/* Target Mission Brief */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/5 px-3.5 py-2.5 text-[13px] text-violet-200">
        <Globe size={15} className="shrink-0 text-violet-400" />
        <span className="font-semibold text-white">Target Endpoint:</span>
        <span className="rounded bg-violet-500/20 px-1.5 py-0.5 font-mono text-xs font-bold text-violet-300">
          {target.expectedMethod}
        </span>
        <code className="font-mono text-xs text-white">{target.expectedEndpoint}</code>
        {target.expectedHeaders?.["Authorization"] && (
          <span className="ml-auto rounded-full border border-violet-400/30 bg-violet-400/10 px-2 py-0.5 font-mono text-[10px] text-violet-300">
            Requires Bearer Token
          </span>
        )}
      </div>

      {/* Mini Request Composer */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        {/* Method & URL Input Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-900/80 p-3">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            disabled={solved}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-mono text-xs font-bold text-sky-400 outline-none transition-colors focus:border-sky-500"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              disabled={solved}
              placeholder="/api/v1/resource"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-[13px] text-slate-200 outline-none transition-colors focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20"
            />
          </div>

          <button
            onClick={handleReset}
            disabled={solved}
            className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-40"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800/80 bg-slate-900/40 px-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("body")}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3 py-2 transition-colors cursor-pointer",
              activeTab === "body"
                ? "border-sky-400 text-sky-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            <FileJson size={13} /> Body (JSON)
          </button>
          <button
            onClick={() => setActiveTab("headers")}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3 py-2 transition-colors cursor-pointer",
              activeTab === "headers"
                ? "border-sky-400 text-sky-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            <Layers size={13} /> Headers {headerAuth && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-3">
          {activeTab === "body" ? (
            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              disabled={solved || method === "GET" || method === "DELETE"}
              rows={4}
              spellCheck={false}
              className="w-full resize-none rounded-lg border border-slate-800/80 bg-slate-900/60 p-3 font-mono text-[12.5px] leading-relaxed text-slate-300 outline-none transition-all placeholder:text-slate-600 focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 disabled:opacity-60"
              placeholder={
                method === "GET" || method === "DELETE"
                  ? "(GET/DELETE requests do not take a JSON body)"
                  : '{\n  "key": "value"\n}'
              }
            />
          ) : (
            <div className="space-y-2 py-1">
              <label className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-900/50 p-2.5 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={headerAuth}
                  onChange={(e) => setHeaderAuth(e.target.checked)}
                  disabled={solved}
                  className="rounded border-slate-700 text-sky-500 focus:ring-sky-500/20"
                />
                <span className="font-mono text-xs text-slate-300">
                  <span className="font-bold text-sky-400">Authorization:</span> Bearer 1|sanctum_session_token_xyz987
                </span>
              </label>

              <div className="flex items-center gap-2.5 rounded-lg border border-slate-800/60 bg-slate-900/30 p-2.5 opacity-60">
                <input type="checkbox" checked readOnly className="rounded border-slate-700 text-sky-500" />
                <span className="font-mono text-xs text-slate-400">
                  <span className="font-bold">Accept:</span> application/json
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Send Button */}
      {!solved && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleSend}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-sky-500/20 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Send size={13} className={cn(loading && "animate-spin")} />
            {loading ? "Transmitting..." : "Send Request"}
          </button>
          <span className="text-xs text-slate-400">
            Simulate real HTTP round-trip
          </span>
        </div>
      )}

      {/* Validation Error Toast */}
      {validationError && (
        <div className="animate-shake flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-[13px] text-rose-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-400" />
          <p>{validationError}</p>
        </div>
      )}

      {/* Simulated Response Inspector */}
      {simulatedResponse && (
        <div className="animate-fade-up overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold uppercase",
                  getStatusColor(simulatedResponse.status)
                )}
              >
                {simulatedResponse.status} {simulatedResponse.statusText}
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                <Clock size={11} /> {simulatedResponse.timeMs ?? 34} ms
              </span>
            </div>
            <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
              <Sparkles size={11} className="text-sky-400" /> Server Response
            </span>
          </div>

          <pre className="max-h-56 overflow-auto p-3.5 font-mono text-[12px] leading-relaxed text-emerald-300">
            <code>{JSON.stringify(simulatedResponse.body, null, 2)}</code>
          </pre>
        </div>
      )}

      {/* Solved Explanation Banner */}
      {(simulatedResponse?.status === target.response.status || solved) && (
        <div className="animate-fade-up rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="mb-1.5 flex items-center gap-2 font-semibold text-emerald-400 text-[13px]">
            <CheckCircle2 size={15} />
            <span>
              {justSolved
                ? `Contract Fulfilled! +${xp} XP Awarded 🎉`
                : "Challenge Solved"}
            </span>
          </div>
          <p className="text-[13.5px] leading-relaxed text-slate-200">
            {c.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
