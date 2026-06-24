import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ChefHat, Utensils, ClipboardList, Shield } from "lucide-react";
import { Brand } from "../components/Brand";
import { TABLES } from "../store/useRestaurantStore";

const SECTIONS = [
  {
    to: `/menu/${TABLES[0]}`,
    eyebrow: "01 · Guest",
    title: "Carte & Service",
    sub: "Table-side dining interface",
    icon: Utensils,
    tone: "dark" as const,
  },
  {
    to: "/waiter",
    eyebrow: "02 · Service",
    title: "Maître d' Waiter",
    sub: "Floor & order management",
    icon: ClipboardList,
    tone: "light" as const,
  },
  {
    to: "/kitchen",
    eyebrow: "03 · Cuisine",
    title: "Kitchen Display",
    sub: "Brigade pass · KDS",
    icon: ChefHat,
    tone: "dark" as const,
  },
  {
    to: "/admin",
    eyebrow: "04 · Direction",
    title: "Administration",
    sub: "Revenue & stop-list",
    icon: Shield,
    tone: "light" as const,
  },
];

export default function Home() {
  return (
    <div className="paper min-h-screen text-ink">
      <header className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 sm:px-12 sm:py-10">
        <Brand tone="light" />
        <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-[#8a7340] sm:flex">
          <span className="h-px w-8 bg-[#c9a961]" />
          Restaurant Operating System
          <span className="h-px w-8 bg-[#c9a961]" />
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 pb-24 sm:px-12">
        {/* Hero */}
        <section className="grid gap-10 pb-16 pt-8 sm:pt-16 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[#8a7340]"
            >
              <span className="h-px w-6 bg-[#c9a961]" />
              Trois étoiles · Michelin · 2026
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-4 font-serif text-[44px] font-light leading-[1.02] tracking-tight text-ink sm:text-[72px] lg:text-[88px]"
            >
              Étoile,
              <br />
              <span className="italic text-[#8a7340]">l'art de la table.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-[#5a544a] sm:text-lg"
            >
              A unified operating system for our maison — from the carte at the
              table to the brigade in the kitchen. Four interfaces, one
              choreography, one real-time pulse.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                to={`/menu/${TABLES[0]}`}
                className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide"
              >
                Open Guest Experience
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/kitchen"
                className="inline-flex items-center gap-2 rounded-full border border-[#c9a961]/40 bg-white px-6 py-3 text-sm font-medium tracking-wide text-ink transition hover:border-[#c9a961] hover:shadow-lg"
              >
                Open Kitchen Display
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="card-light relative overflow-hidden rounded-[28px] p-10">
              <div className="hairline absolute inset-x-10 top-10" />
              <div className="grid grid-cols-3 gap-3 pt-4">
                {[
                  { k: "Service", v: "20:00" },
                  { k: "Tables", v: "10" },
                  { k: "Stars", v: "★★★" },
                ].map((s) => (
                  <div key={s.k} className="rounded-xl border border-[#c9a961]/20 bg-[#faf7f1] p-4">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-[#8a7340]">
                      {s.k}
                    </div>
                    <div className="mt-2 font-serif text-2xl text-ink">{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#8a7340]">
                  Signature Course
                </div>
                <div className="mt-2 font-serif text-3xl leading-tight">
                  A5 Wagyu, Miyazaki
                </div>
                <div className="mt-1 text-sm text-[#6b655c]">
                  Périgord black truffle · jus corsé
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-medium">245€</span>
                  <span className="text-xs text-[#8a7340]">par couvert</span>
                </div>
              </div>
              <div className="hairline absolute inset-x-10 bottom-10" />
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-[#e2c98a] to-[#c9a961] opacity-20 blur-2xl" />
            </div>
          </motion.div>
        </section>

        <div className="hairline mb-12" />

        {/* Section grid */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.to}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
              >
                <Link
                  to={s.to}
                  className="group block h-full"
                >
                  <div
                    className={`relative h-full overflow-hidden rounded-2xl border p-7 transition-all duration-300 ${
                      s.tone === "dark"
                        ? "border-[#c9a961]/25 bg-ink text-bone hover:-translate-y-1 hover:border-[#c9a961]/55 hover:shadow-[0_30px_60px_-30px_rgba(201,169,97,0.45)]"
                        : "border-[#c9a961]/25 bg-white text-ink hover:-translate-y-1 hover:border-[#c9a961]/55 hover:shadow-[0_30px_60px_-30px_rgba(20,18,12,0.25)]"
                    }`}
                  >
                    <div className="absolute inset-0 velvet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.32em] text-[#c9a961]">
                          {s.eyebrow}
                        </span>
                        <Icon className="h-5 w-5 text-[#c9a961]" strokeWidth={1.4} />
                      </div>
                      <h3 className="mt-10 font-serif text-3xl font-light leading-tight">
                        {s.title}
                      </h3>
                      <p
                        className={`mt-2 text-sm ${
                          s.tone === "dark" ? "text-bone/60" : "text-[#6b655c]"
                        }`}
                      >
                        {s.sub}
                      </p>
                      <div className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-[#c9a961]">
                        Enter
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </section>

        <footer className="mt-24 flex flex-col items-center justify-between gap-3 border-t border-[#c9a961]/20 pt-8 text-[10px] uppercase tracking-[0.32em] text-[#8a7340] sm:flex-row">
          <span>© Maison Étoile · 2026</span>
          <span>Realtime · Zustand · PWA</span>
        </footer>
      </main>
    </div>
  );
}
