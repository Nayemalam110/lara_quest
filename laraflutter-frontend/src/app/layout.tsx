import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaraFlutter — Interactive Backend Learning for Mobile Devs",
  description:
    "Learn Laravel backend engineering through Flutter parallels. Gamified lessons, interactive schema design, and code comparisons for mobile developers.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-200 antialiased">{children}</body>
    </html>
  );
}
