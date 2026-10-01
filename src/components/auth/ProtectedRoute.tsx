import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b0f19] gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-400/20 border-t-sky-400" />
        <span className="text-sm font-medium text-slate-300">
          Loading LaraQuest...
        </span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
