import { Star } from "lucide-react";
import { Link } from "react-router-dom";

export function Brand({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const isDark = tone === "dark";
  return (
    <Link
      to="/"
      className="group flex items-center gap-3 select-none"
      aria-label="Étoile — Home"
    >
      <div className="relative">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full border ${
            isDark
              ? "border-[#c9a961]/40 bg-[#111]"
              : "border-[#c9a961]/40 bg-white"
          }`}
        >
          <span
            className={`font-serif text-2xl ${
              isDark ? "text-gold-gradient" : "text-[#8a7340]"
            }`}
          >
            É
          </span>
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a961] ring-2 ring-[#0a0a0a]">
          <span className="text-[8px] font-bold text-black">★</span>
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={`font-serif text-2xl tracking-tight ${
            isDark ? "text-bone" : "text-ink"
          }`}
        >
          Étoile
        </span>
        <span className="mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-[0.25em] text-[#c9a961]">
          <span>Maison · Paris</span>
        </span>
      </div>
      <div className="ml-2 hidden items-center gap-0.5 sm:flex">
        {[0, 1, 2].map((i) => (
          <Star
            key={i}
            className="h-3.5 w-3.5 fill-[#c9a961] text-[#c9a961]"
            strokeWidth={1}
          />
        ))}
      </div>
    </Link>
  );
}
