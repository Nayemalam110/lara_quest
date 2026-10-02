// ==============================================================================
// 🧪 LaraQuest Interactive Dio ↔ Laravel API Simulator Sandbox
// Simulates Flutter Dio client requests, Sanctum tokens, server SQL traces & envelopes
// ==============================================================================

import React, { useState } from 'react';
import {
  Send,
  Terminal,
  Database,
  Code2,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Button } from '@/components/ui/Button';

interface ApiPreset {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  requiresAuth: boolean;
  defaultBody?: string;
  responseStatus: number;
  responseStatusText: string;
  responseBody: any;
  sqlQueries: { sql: string; timeMs: number; indexed: boolean }[];
}

const PRESETS: ApiPreset[] = [
  {
    name: 'Get Posts (Eager Loaded)',
    method: 'GET',
    endpoint: '/api/v1/posts',
    requiresAuth: false,
    responseStatus: 200,
    responseStatusText: 'OK',
    responseBody: {
      data: [
        {
          id: 1,
          title: 'Bridging Flutter State to Laravel 11',
          author: { id: 10, name: 'Taylor Otwell', role: 'Architect' },
          tags: ['flutter', 'laravel', 'architecture'],
          likes_count: 142,
          created_at: '2026-10-02T08:30:00Z',
        },
        {
          id: 2,
          title: 'Zero N+1 Queries with Eloquent with()',
          author: { id: 14, name: 'Dash Artisan', role: 'Mobile Lead' },
          tags: ['performance', 'sql', 'database'],
          likes_count: 98,
          created_at: '2026-10-02T09:15:00Z',
        },
      ],
      meta: {
        current_page: 1,
        total: 24,
        per_page: 15,
      },
    },
    sqlQueries: [
      {
        sql: 'SELECT * FROM "posts" WHERE "deleted_at" IS NULL ORDER BY "created_at" DESC LIMIT 15',
        timeMs: 2.4,
        indexed: true,
      },
      {
        sql: 'SELECT * FROM "users" WHERE "id" IN (10, 14)',
        timeMs: 1.1,
        indexed: true,
      },
      {
        sql: 'SELECT "post_id", "tag_name" FROM "tags" WHERE "post_id" IN (1, 2)',
        timeMs: 1.8,
        indexed: true,
      },
    ],
  },
  {
    name: 'Create Post (Sanctum Protected)',
    method: 'POST',
    endpoint: '/api/v1/posts',
    requiresAuth: true,
    defaultBody: JSON.stringify(
      {
        title: 'High Availability Multi-Tenancy in PostgreSQL',
        content: 'Row-level security ensures complete tenant isolation.',
        category_id: 4,
      },
      null,
      2
    ),
    responseStatus: 201,
    responseStatusText: 'Created',
    responseBody: {
      message: 'Post successfully published.',
      data: {
        id: 42,
        title: 'High Availability Multi-Tenancy in PostgreSQL',
        content: 'Row-level security ensures complete tenant isolation.',
        author_id: 1,
        created_at: '2026-10-02T09:20:00Z',
      },
    },
    sqlQueries: [
      {
        sql: 'SELECT * FROM "personal_access_tokens" WHERE "token" = $1 LIMIT 1',
        timeMs: 0.9,
        indexed: true,
      },
      {
        sql: 'INSERT INTO "posts" ("title", "content", "user_id", "created_at") VALUES ($1, $2, $3, NOW()) RETURNING *',
        timeMs: 3.8,
        indexed: true,
      },
    ],
  },
  {
    name: 'Checkout Order (DB Transaction)',
    method: 'POST',
    endpoint: '/api/v1/orders/checkout',
    requiresAuth: true,
    defaultBody: JSON.stringify(
      {
        items: [
          { product_id: 101, quantity: 2 },
          { product_id: 205, quantity: 1 },
        ],
        payment_method: 'card_sanctum_vault',
      },
      null,
      2
    ),
    responseStatus: 200,
    responseStatusText: 'OK',
    responseBody: {
      status: 'success',
      order: {
        order_number: 'ORD-2026-9921',
        total_cents: 14900,
        currency: 'USD',
        status: 'paid',
        items_count: 3,
      },
    },
    sqlQueries: [
      { sql: 'BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ', timeMs: 0.2, indexed: true },
      { sql: 'SELECT * FROM "products" WHERE "id" IN (101, 205) FOR UPDATE', timeMs: 1.5, indexed: true },
      { sql: 'INSERT INTO "orders" ("total_cents", "status") VALUES (14900, \'paid\')', timeMs: 2.1, indexed: true },
      { sql: 'INSERT INTO "order_items" ("order_id", "product_id", "quantity") VALUES (9921, 101, 2)', timeMs: 1.2, indexed: true },
      { sql: 'COMMIT', timeMs: 0.4, indexed: true },
    ],
  },
  {
    name: 'Validation Error 422 (FormRequest)',
    method: 'POST',
    endpoint: '/api/v1/auth/register',
    requiresAuth: false,
    defaultBody: JSON.stringify(
      {
        email: 'invalid-email',
        password: '123',
      },
      null,
      2
    ),
    responseStatus: 422,
    responseStatusText: 'Unprocessable Content',
    responseBody: {
      message: 'The given data was invalid.',
      errors: {
        email: ['The email field must be a valid email address.'],
        password: ['The password must be at least 8 characters.'],
        name: ['The name field is required.'],
      },
    },
    sqlQueries: [],
  },
  {
    name: 'Model Not Found 404',
    method: 'GET',
    endpoint: '/api/v1/posts/99999',
    requiresAuth: false,
    responseStatus: 404,
    responseStatusText: 'Not Found',
    responseBody: {
      message: 'No query results for model [App\\Models\\Post] 99999',
    },
    sqlQueries: [
      {
        sql: 'SELECT * FROM "posts" WHERE "id" = 99999 AND "deleted_at" IS NULL LIMIT 1',
        timeMs: 1.2,
        indexed: true,
      },
    ],
  },
];

export function ApiSimulatorSandbox() {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const activePreset = PRESETS[selectedPresetIndex];

  const [method, setMethod] = useState(activePreset.method);
  const [endpoint, setEndpoint] = useState(activePreset.endpoint);
  const [useToken, setUseToken] = useState(activePreset.requiresAuth);
  const [requestBody, setRequestBody] = useState(activePreset.defaultBody || '');
  const [loading, setLoading] = useState(false);
  const [outputTab, setOutputTab] = useState<'json' | 'sql' | 'dio' | 'headers'>('json');
  const [copiedDio, setCopiedDio] = useState(false);

  // Switch preset
  const handleSelectPreset = (index: number) => {
    const p = PRESETS[index];
    setSelectedPresetIndex(index);
    setMethod(p.method);
    setEndpoint(p.endpoint);
    setUseToken(p.requiresAuth);
    setRequestBody(p.defaultBody || '');
  };

  // Run simulated request
  const handleSendRequest = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 280);
  };

  // Determine actual response if unauthenticated
  const isAuthBlocked = activePreset.requiresAuth && !useToken;
  const currentStatusCode = isAuthBlocked ? 401 : activePreset.responseStatus;
  const currentStatusText = isAuthBlocked ? 'Unauthorized' : activePreset.responseStatusText;
  const currentResponseBody = isAuthBlocked
    ? { message: 'Unauthenticated. Bearer token missing in Authorization header.' }
    : activePreset.responseBody;
  const currentSqlQueries = isAuthBlocked ? [] : activePreset.sqlQueries;

  // Generated Flutter Dio code
  const generatedDioCode = `// lib/services/api_service.dart
import 'package:dio/dio.dart';

final dio = Dio(BaseOptions(
  baseUrl: 'https://api.laraquest.dev',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',${
      useToken ? "\n    'Authorization': 'Bearer \$sanctumToken'," : ''
    }
  },
));

Future<void> executeRequest() async {
  try {
    final response = await dio.${method.toLowerCase()}(
      '${endpoint}',${
    requestBody && method !== 'GET'
      ? `\n      data: ${requestBody},`
      : ''
  }
    );
    print('HTTP \${response.statusCode}: \${response.data}');
  } on DioException catch (e) {
    if (e.response?.statusCode == 401) {
      // Sanctum token expired or invalid
    } else if (e.response?.statusCode == 422) {
      // Validation error: e.response?.data['errors']
    }
  }
}`;

  const handleCopyDio = () => {
    navigator.clipboard.writeText(generatedDioCode);
    setCopiedDio(true);
    setTimeout(() => setCopiedDio(false), 2000);
  };

  const totalSqlDuration = currentSqlQueries.reduce((sum, q) => sum + q.timeMs, 0);

  return (
    <div className="space-y-6">
      {/* Sandbox Controls Bar */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827]/90 p-5 backdrop-blur-xl shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase font-bold text-sky-400">
              Preset Scenarios:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p, idx) => (
                <button
                  key={p.name}
                  onClick={() => handleSelectPreset(idx)}
                  className={`rounded-xl px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                    selectedPresetIndex === idx
                      ? 'border border-sky-500/50 bg-sky-500/20 text-sky-300 font-bold'
                      : 'border border-slate-700 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Token Switch */}
          <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={useToken}
              onChange={(e) => setUseToken(e.target.checked)}
              className="rounded border-slate-700 bg-slate-800 text-sky-500 focus:ring-0"
            />
            {useToken ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <ShieldCheck size={14} /> Bearer Token Attached
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-400">
                <ShieldAlert size={14} /> No Token (Public)
              </span>
            )}
          </label>
        </div>

        {/* HTTP URL Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* Method Badge */}
          <span
            className={`rounded-xl px-3 py-2 font-mono text-xs font-bold border ${
              method === 'GET'
                ? 'border-sky-500/40 bg-sky-500/15 text-sky-400'
                : method === 'POST'
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                : method === 'PUT'
                ? 'border-amber-500/40 bg-amber-500/15 text-amber-400'
                : 'border-rose-500/40 bg-rose-500/15 text-rose-400'
            }`}
          >
            {method}
          </span>

          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="flex-1 min-w-[220px] rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 font-mono text-xs text-white outline-none focus:border-sky-500"
          />

          <Button
            variant="brand"
            size="sm"
            onClick={handleSendRequest}
            disabled={loading}
            className="text-xs font-bold"
          >
            <Send size={13} className={loading ? 'animate-pulse' : ''} />
            <span>{loading ? 'Dispatching...' : 'Dispatch Request (Dio)'}</span>
          </Button>
        </div>

        {/* Body editor if POST / PUT */}
        {method !== 'GET' && (
          <div className="mt-4">
            <span className="font-mono text-[11px] text-slate-400 font-bold block mb-1">
              JSON Request Payload (Dio data):
            </span>
            <textarea
              rows={3}
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-200 outline-none focus:border-sky-500"
            />
          </div>
        )}
      </div>

      {/* Output Console Window */}
      <div className="rounded-2xl border border-slate-800 bg-[#0e1424] overflow-hidden shadow-2xl">
        {/* Console Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/90 px-4 py-2.5">
          <div className="flex items-center gap-3">
            {/* Status Code Pill */}
            <span
              className={`rounded-lg border px-2.5 py-0.5 font-mono text-xs font-bold ${
                currentStatusCode < 300
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                  : currentStatusCode < 500
                  ? 'border-amber-500/40 bg-amber-500/15 text-amber-400'
                  : 'border-rose-500/40 bg-rose-500/15 text-rose-400'
              }`}
            >
              {currentStatusCode} {currentStatusText}
            </span>

            <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
              <Clock size={12} className="text-sky-400" />
              <span>Response: ~34ms</span>
            </span>

            {currentSqlQueries.length > 0 && (
              <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                <Database size={12} className="text-amber-400" />
                <span>DB Execution: {totalSqlDuration.toFixed(1)}ms ({currentSqlQueries.length} queries)</span>
              </span>
            )}
          </div>

          {/* Output Mode Switcher */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setOutputTab('json')}
              className={`rounded-lg px-2.5 py-1 font-mono text-xs font-bold transition ${
                outputTab === 'json'
                  ? 'bg-sky-500/20 text-sky-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              JSON Envelope
            </button>
            <button
              onClick={() => setOutputTab('sql')}
              className={`rounded-lg px-2.5 py-1 font-mono text-xs font-bold transition ${
                outputTab === 'sql'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SQL Queries ({currentSqlQueries.length})
            </button>
            <button
              onClick={() => setOutputTab('dio')}
              className={`rounded-lg px-2.5 py-1 font-mono text-xs font-bold transition ${
                outputTab === 'dio'
                  ? 'bg-rose-500/20 text-rose-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Flutter Dio Code
            </button>
          </div>
        </div>

        {/* Tab 1: Response JSON Envelope */}
        {outputTab === 'json' && (
          <div className="p-4">
            <CodeBlock
              code={JSON.stringify(currentResponseBody, null, 2)}
              lang="json"
              className="text-xs"
            />
          </div>
        )}

        {/* Tab 2: Server SQL Query Trace */}
        {outputTab === 'sql' && (
          <div className="p-4 space-y-3">
            {currentSqlQueries.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 font-mono">
                No database queries were dispatched for this request.
              </div>
            ) : (
              currentSqlQueries.map((q, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5 text-[10.5px]">
                    <span className="text-amber-400 font-bold">Query #{idx + 1}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400">Index Hit: {q.indexed ? 'YES' : 'NO'}</span>
                      <span className="text-slate-400">{q.timeMs}ms</span>
                    </div>
                  </div>
                  <div className="text-slate-200 font-semibold">{q.sql}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Generated Flutter Dio Code */}
        {outputTab === 'dio' && (
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-sky-400 font-bold">
                Dart (Dio) Client Implementation:
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyDio}
                className="text-xs"
              >
                {copiedDio ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedDio ? 'Copied' : 'Copy Dart Code'}</span>
              </Button>
            </div>
            <CodeBlock code={generatedDioCode} lang="dart" className="text-xs" />
          </div>
        )}
      </div>
    </div>
  );
}
