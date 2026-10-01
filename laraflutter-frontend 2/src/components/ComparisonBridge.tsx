import * as Tabs from "@radix-ui/react-tabs";
import { ArrowLeftRight, Lightbulb, Smartphone, Server } from "lucide-react";
import type { Lesson } from "@/data/mockData";
import { CodeBlock } from "./CodeBlock";

export function ComparisonBridge({ lesson }: { lesson: Lesson }) {
  const p = lesson.flutterParallel;

  const flutterBlock = (
    <CodeBlock
      code={p.flutterCode}
      lang="dart"
      accent="flutter"
      title={p.flutterFile ?? "app.dart"}
    />
  );
  const laravelBlock = (
    <CodeBlock
      code={p.laravelCode}
      lang="php"
      accent="laravel"
      title={p.laravelFile ?? "app.php"}
    />
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-mut">
          {p.concept}
        </span>
      </div>

      {/* desktop: side by side */}
      <div className="relative hidden gap-4 lg:grid lg:grid-cols-2">
        <div>
          <PlatformLabel icon="flutter" label="Flutter · client side" />
          {flutterBlock}
        </div>
        <div>
          <PlatformLabel icon="laravel" label="Laravel · server side" />
          {laravelBlock}
        </div>
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-[#0b0d14] shadow-[0_0_30px_rgba(84,197,248,0.25)]">
            <ArrowLeftRight size={16} className="text-gradient-brand" />
          </div>
        </div>
      </div>

      {/* mobile / tablet: radix tabs */}
      <Tabs.Root defaultValue="flutter" className="lg:hidden">
        <Tabs.List className="mb-3 grid grid-cols-2 gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
          {[
            { v: "flutter", label: "Flutter", icon: Smartphone, color: "#54c5f8" },
            { v: "laravel", label: "Laravel", icon: Server, color: "#ff4438" },
          ].map((t) => (
            <Tabs.Trigger
              key={t.v}
              value={t.v}
              className="tab-trigger flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-mut transition-colors data-[state=active]:bg-white/[0.06]"
            >
              <t.icon size={14} style={{ color: t.color }} />
              {t.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value="flutter">{flutterBlock}</Tabs.Content>
        <Tabs.Content value="laravel">{laravelBlock}</Tabs.Content>
      </Tabs.Root>

      <div className="mt-4 flex gap-3 rounded-xl border border-gold/15 bg-gold/[0.05] p-4">
        <Lightbulb size={16} className="mt-0.5 shrink-0 text-gold" />
        <p className="text-[13.5px] leading-relaxed text-ink/90">{p.explanation}</p>
      </div>
    </div>
  );
}

function PlatformLabel({ icon, label }: { icon: "flutter" | "laravel"; label: string }) {
  const color = icon === "flutter" ? "#54c5f8" : "#ff4438";
  const Icon = icon === "flutter" ? Smartphone : Server;
  return (
    <div className="mb-2 flex items-center gap-2 pl-1">
      <Icon size={13} style={{ color }} />
      <span className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
