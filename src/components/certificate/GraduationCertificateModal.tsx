import React, { useRef, useState } from "react";
import {
  Award,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Printer,
  Share2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useProgressStore } from "@/store/useProgressStore";
import { totalLessons, modules } from "@/data/mockData";
import { Button } from "@/components/ui/Button";

interface GraduationCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GraduationCertificateModal({
  isOpen,
  onClose,
}: GraduationCertificateModalProps) {
  const { profile } = useAuthStore();
  const { getStats } = useProgressStore();
  const stats = getStats();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const learnerName = profile?.displayName || "Full-Stack Engineer";
  const completedCount = (stats.completedLessonIds || []).length;
  const isMastered = completedCount >= totalLessons;

  // Generate deterministic verification hash
  const rawId = (profile?.id || "student-01").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);
  const certHash = `LQ-2026-${rawId.toUpperCase()}-${stats.xp.toString(16).toUpperCase().padStart(4, "0")}`;
  const graduationDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const certUrl = `https://laraquest.dev/verify/${certHash}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(certUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `🎓 I just graduated from LaraQuest: Mastered all 24 Laravel REST API modules, Eloquent ORM & Relational DB architecture from a Flutter background!\n\nVerify credential: ${certUrl}\n#Laravel #Flutter #Dart #FullStack`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(certUrl);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-800 bg-[#0d1322] p-6 sm:p-8 shadow-2xl print:border-none print:bg-white print:p-0 print:shadow-none">
        {/* Modal Header Controls (Hidden during print) */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 print:hidden">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <Award size={22} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <span>Official LaraQuest Certificate of Completion</span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                  Verified
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Credential ID: <span className="font-mono text-slate-300 font-semibold">{certHash}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* 🎓 The Diploma Certificate Canvas */}
        <div
          id="certificate-print-area"
          className="relative mt-6 overflow-hidden rounded-2xl border-4 border-double border-amber-500/60 bg-gradient-to-br from-[#0a0f1d] via-[#111827] to-[#0a0f1d] p-8 sm:p-12 text-center shadow-inner print:border-8 print:border-black print:bg-white print:p-12 print:text-black"
        >
          {/* Subtle Security Guilloche Background Effect */}
          <div className="pointer-events-none absolute inset-0 opacity-5 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px] print:hidden" />

          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 left-3 text-amber-500/50 font-serif text-2xl print:text-black">❖</div>
          <div className="absolute top-3 right-3 text-amber-500/50 font-serif text-2xl print:text-black">❖</div>
          <div className="absolute bottom-3 left-3 text-amber-500/50 font-serif text-2xl print:text-black">❖</div>
          <div className="absolute bottom-3 right-3 text-amber-500/50 font-serif text-2xl print:text-black">❖</div>

          {/* Academy Header */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400 print:text-amber-700">
              <Sparkles size={13} /> LaraQuest Engineering Academy <Sparkles size={13} />
            </div>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-normal tracking-wide text-white print:text-black">
              Certificate of Full-Stack Mastery
            </h1>
            <p className="mt-2 font-mono text-[11.5px] text-slate-400 print:text-gray-600">
              THIS IS PROUDLY CONFERRED UPON
            </p>

            {/* Recipient Display Name */}
            <div className="my-5 border-b-2 border-amber-500/40 pb-2 px-8 min-w-[280px]">
              <span className="font-serif italic text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300 print:text-black">
                {learnerName}
              </span>
            </div>

            {/* Citation Statement */}
            <p className="max-w-2xl text-[13.5px] leading-relaxed text-slate-300 print:text-gray-800">
              for successfully mastering all <strong className="text-white print:text-black">24 architectural modules</strong> across
              relational database schema modeling, Eloquent ORM, RESTful API controllers, Sanctum mobile authentication,
              caching, background queues, multi-tenancy, and zero-downtime database migrations.
            </p>

            {/* Dual Academy Seals & Signatures */}
            <div className="mt-10 grid grid-cols-3 items-end gap-6 w-full max-w-2xl pt-6 border-t border-slate-800/80 print:border-gray-400">
              {/* Signature 1: Taylor Otwell */}
              <div className="text-center">
                <div className="font-serif italic text-lg sm:text-xl text-rose-400/90 print:text-black">
                  Taylor Otwell
                </div>
                <div className="mt-1 h-px bg-slate-700 print:bg-black w-28 mx-auto" />
                <span className="mt-1 block font-mono text-[10px] text-slate-400 print:text-gray-600">
                  Laravel Creator & Lead
                </span>
              </div>

              {/* Center Seal */}
              <div className="flex flex-col items-center">
                <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-amber-500/60 bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] print:border-black print:text-black">
                  <ShieldCheck size={32} />
                </div>
                <span className="mt-2 font-mono text-[9.5px] text-amber-400/90 font-bold uppercase tracking-widest print:text-black">
                  SEAL OF MASTERY
                </span>
              </div>

              {/* Signature 2: Dash (Flutter Mascot) */}
              <div className="text-center">
                <div className="font-serif italic text-lg sm:text-xl text-sky-400/90 print:text-black">
                  Dash & The Flutter Guild
                </div>
                <div className="mt-1 h-px bg-slate-700 print:bg-black w-28 mx-auto" />
                <span className="mt-1 block font-mono text-[10px] text-slate-400 print:text-gray-600">
                  Mobile Architecture Bridge
                </span>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 w-full pt-4 font-mono text-[10.5px] text-slate-400 border-t border-slate-800/40 print:text-gray-600">
              <span>Date of Issue: <strong className="text-slate-300 print:text-black">{graduationDate}</strong></span>
              <span>Verification Hash: <strong className="text-amber-400/90 print:text-black">{certHash}</strong></span>
              <span>Status: <strong className="text-emerald-400 print:text-black">Accredited & Active</strong></span>
            </div>
          </div>
        </div>

        {/* Modal Actions & Social Share (Hidden during print) */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 print:hidden">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="text-xs"
            >
              <Copy size={13} />
              <span>{copied ? "Link Copied!" : "Copy Verification Link"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs"
            >
              <Printer size={13} />
              <span>Print / Save as PDF</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareTwitter}
              className="text-xs hover:text-sky-400"
            >
              <Share2 size={13} />
              <span>Share on X</span>
            </Button>
            <Button
              variant="brand"
              size="sm"
              onClick={handleShareLinkedIn}
              className="text-xs shadow-[0_0_15px_rgba(244,63,94,0.3)]"
            >
              <ExternalLink size={13} />
              <span>Add to LinkedIn</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default GraduationCertificateModal;
