import { AnimatePresence, motion } from "framer-motion";
import { useView } from "@/store/viewStore";
import { Sidebar, MobileTopBar, BottomNav } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { LessonView } from "@/components/LessonView";
import { Playground } from "@/components/Playground";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-bg" />
      <div className="absolute -top-40 left-[15%] h-[420px] w-[520px] rounded-full bg-flutter/[0.05] blur-[130px]" />
      <div className="absolute right-[8%] top-[30%] h-[380px] w-[420px] rounded-full bg-viol/[0.045] blur-[130px]" />
      <div className="absolute bottom-[-10%] left-[35%] h-[360px] w-[440px] rounded-full bg-laravel/[0.04] blur-[130px]" />
      <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: NOISE }} />
      {/* script-like watermarks */}
      <div className="absolute bottom-8 right-8 hidden select-none font-mono text-[10px] tracking-[0.3em] text-white/[0.05] xl:block">
        php artisan serve — OK · port 8000
      </div>
    </div>
  );
}

export default function App() {
  const view = useView((s) => s.view);
  const key = view.name === "lesson" ? `lesson-${view.lessonId}` : view.name;

  return (
    <div className="relative min-h-screen font-display text-ink">
      <BackgroundFX />
      <Sidebar />
      <MobileTopBar />

      <div className="relative z-10 lg:pl-[264px]">
        <AnimatePresence mode="wait">
          <motion.main
            key={key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen pb-24 lg:pb-0"
          >
            {view.name === "dashboard" && <Dashboard />}
            {view.name === "lesson" && <LessonView lessonId={view.lessonId} />}
            {view.name === "playground" && <Playground />}
          </motion.main>
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
