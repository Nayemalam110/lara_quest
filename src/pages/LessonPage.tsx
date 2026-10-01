import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { lessonById, moduleOfLesson } from "@/data/mockData";
import { LessonView } from "@/components/lesson/LessonView";
import { Button } from "@/components/ui/Button";

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();

  if (!lessonId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Lesson Not Found</h2>
        <Link to="/dashboard">
          <Button variant="secondary" size="sm">
            <ArrowLeft size={14} /> Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const lesson = lessonById(lessonId);
  const module = moduleOfLesson(lessonId);

  if (!lesson || !module) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen size={36} className="text-slate-500 mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Lesson Not Found</h2>
        <p className="text-xs text-slate-400 mb-4 max-w-sm">
          The requested lesson (&quot;{lessonId}&quot;) does not exist in the curriculum or has moved.
        </p>
        <Link to="/dashboard">
          <Button variant="secondary" size="sm">
            <ArrowLeft size={14} /> Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return <LessonView lesson={lesson} module={module} />;
}
