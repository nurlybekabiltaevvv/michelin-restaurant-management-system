import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function PageShell({
  tone = "light",
  children,
  className = "",
}: {
  tone?: "light" | "dark";
  children: ReactNode;
  className?: string;
}) {
  const bg =
    tone === "dark" ? "velvet text-bone" : "paper text-ink";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`min-h-screen w-full ${bg} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function TopBar({
  tone = "light",
  left,
  center,
  right,
}: {
  tone?: "light" | "dark";
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}) {
  const isDark = tone === "dark";
  return (
    <header
      className={`sticky top-0 z-30 w-full backdrop-blur-md ${
        isDark
          ? "border-b border-[#c9a961]/15 bg-[#0a0a0a]/80"
          : "border-b border-[#c9a961]/20 bg-[#faf7f1]/85"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-8 sm:py-4">
        <div className="flex items-center gap-3">{left}</div>
        <div className="flex items-center gap-2">{center}</div>
        <div className="flex items-center gap-2">{right}</div>
      </div>
    </header>
  );
}
