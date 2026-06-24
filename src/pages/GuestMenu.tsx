import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Receipt,
  Wine,
  Leaf,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  X,
  Check,
} from "lucide-react";
import { Brand } from "../components/Brand";
import { PageShell, TopBar } from "../components/PageShell";
import { useRestaurantStore } from "../store/useRestaurantStore";
import type { MenuItem } from "../store/useRestaurantStore";

const CATEGORY_META: Record<string, { icon: any; tagline: string }> = {
  Starters: { icon: Leaf, tagline: "Pour commencer" },
  Mains: { icon: Wine, tagline: "Le plat principal" },
  Desserts: { icon: Sparkles, tagline: "La finale sucrée" },
};

export default function GuestMenu() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const visibleMenu = useRestaurantStore((s) => s.visibleMenu());
  const callWaiter = useRestaurantStore((s) => s.callWaiter);
  const settleBill = useRestaurantStore((s) => s.settleBill);
  const orders = useRestaurantStore((s) => s.orders);
  const tableOrder = useMemo(
    () =>
      orders
        .filter((o) => o.tableId === tableId)
        .sort((a, b) => b.timestamp - a.timestamp)[0],
    [orders, tableId]
  );

  const categories = useMemo(() => {
    const set = new Set(visibleMenu.map((m) => m.category));
    return Array.from(set) as Array<MenuItem["category"]>;
  }, [visibleMenu]);

  const [activeCat, setActiveCat] = useState<MenuItem["category"]>(
    categories[0] ?? "Starters"
  );
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [calling, setCalling] = useState<null | "service" | "bill">(null);
  const [billDone, setBillDone] = useState(false);
  const [billTotal, setBillTotal] = useState(0);

  const items = visibleMenu.filter((m) => m.category === activeCat);

  const triggerCall = (reason: "service" | "bill") => {
    callWaiter(tableId!, reason);
    setCalling(reason);
    setTimeout(() => setCalling(null), 2200);
  };

  const askForBill = () => {
    const total = settleBill(tableId!);
    setBillTotal(total);
    setBillDone(true);
  };

  return (
    <PageShell tone="dark" className="velvet">
      <TopBar
        tone="dark"
        left={<Brand tone="dark" />}
        center={
          <div className="hidden items-center gap-2 rounded-full border border-[#c9a961]/30 bg-black/30 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-[#c9a961] sm:flex">
            <span>Table</span>
            <span className="font-serif text-base text-bone">{tableId}</span>
          </div>
        }
        right={
          <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-[#8a7340] sm:flex">
            <Link to="/" className="hover:text-[#c9a961]">
              Exit
            </Link>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        }
      />

      <main className="mx-auto max-w-6xl px-5 pb-32 pt-8 sm:px-10 sm:pt-14">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <div className="text-[10px] uppercase tracking-[0.45em] text-[#c9a961]">
            Bienvenue à Étoile
          </div>
          <h1 className="mt-3 font-serif text-5xl font-light leading-none text-bone sm:text-6xl">
            La Carte
          </h1>
          <div className="hairline mt-6 w-32" />
          <p className="mt-6 max-w-md text-sm leading-relaxed text-bone/60">
            Composed this morning by Chef Auguste Mercier. Each course a single,
            considered note.
          </p>
        </motion.div>

        {/* Table order status (subtle) */}
        {tableOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex items-center justify-center"
          >
            <div className="flex items-center gap-3 rounded-full border border-[#c9a961]/30 bg-black/40 px-5 py-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-[#ff8a3d] ember-pulse" />
              <span className="uppercase tracking-[0.3em] text-[#c9a961]">
                In service
              </span>
              <span className="text-bone/70">
                {tableOrder.items.length} course{tableOrder.items.length === 1 ? "" : "s"} ·
                status {tableOrder.status}
              </span>
            </div>
          </motion.div>
        )}

        {/* Category tabs */}
        <nav className="mt-14 flex items-center justify-center gap-2 overflow-x-auto pb-2 sm:gap-4">
          {categories.map((c) => {
            const Meta = CATEGORY_META[c];
            const Icon = Meta?.icon ?? Leaf;
            const active = c === activeCat;
            return (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`group relative flex shrink-0 items-center gap-3 rounded-full border px-5 py-2.5 text-sm transition ${
                  active
                    ? "border-[#c9a961] bg-[#c9a961]/10 text-bone"
                    : "border-[#c9a961]/20 text-bone/55 hover:border-[#c9a961]/50 hover:text-bone"
                }`}
              >
                <Icon className="h-4 w-4 text-[#c9a961]" strokeWidth={1.5} />
                <span className="font-serif text-base tracking-wide">{c}</span>
              </button>
            );
          })}
        </nav>

        {/* Tagline */}
        <div className="mt-6 text-center text-[10px] uppercase tracking-[0.4em] text-[#8a7340]">
          {CATEGORY_META[activeCat]?.tagline}
        </div>

        {/* Cards */}
        <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {items.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              onClick={() => setSelected(item)}
              className="group card-dark relative overflow-hidden rounded-3xl text-left transition hover:-translate-y-1 hover:border-[#c9a961]/50"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-[#e2c98a]/10 to-transparent blur-2xl" />
              <div className="relative grid grid-cols-[auto_1fr_auto] items-start gap-5 p-7">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#c9a961]/25 bg-[#1a1814] text-3xl">
                  <span>{item.emoji}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
                    <span>{item.course}</span>
                    <span className="h-1 w-1 rounded-full bg-[#c9a961]" />
                    <span>{item.origin}</span>
                  </div>
                  <h3 className="mt-2 font-serif text-2xl font-light leading-tight text-bone">
                    {item.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-bone/55">
                    {item.description}
                  </p>
                  {item.pairing && (
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-[#c9a961]/80">
                      <Wine className="h-3 w-3" />
                      <span className="italic">{item.pairing}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-serif text-2xl text-gold-gradient">
                    €{item.price}
                  </span>
                  <ChevronRight className="mt-2 h-5 w-5 text-[#c9a961] transition group-hover:translate-x-1" />
                </div>
              </div>
            </motion.button>
          ))}
        </section>

        {items.length === 0 && (
          <div className="mt-20 text-center text-bone/50">
            This section is currently being reimagined by the chef.
          </div>
        )}
      </main>

      {/* Bottom action bar — sticky */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#c9a961]/20 bg-[#0a0a0a]/90 px-5 py-4 backdrop-blur-md sm:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link
            to="/"
            className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#8a7340] hover:text-[#c9a961] sm:flex"
          >
            <ChevronLeft className="h-3 w-3" />
            Lobby
          </Link>
          <div className="flex flex-1 items-center justify-end gap-3">
            <button
              onClick={() => triggerCall("service")}
              className="btn-ghost-dark inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm"
            >
              <Bell className="h-4 w-4 text-[#c9a961]" />
              <span className="hidden sm:inline">Call Service</span>
              <span className="sm:hidden">Service</span>
            </button>
            <button
              onClick={askForBill}
              className="btn-gold inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium"
            >
              <Receipt className="h-4 w-4" />
              Request Bill
            </button>
          </div>
        </div>
      </div>

      {/* Toast confirmations */}
      <AnimatePresence>
        {calling && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-28 left-1/2 z-30 -translate-x-1/2 rounded-full border border-[#c9a961]/40 bg-[#161616] px-5 py-3 text-sm text-bone shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#c9a961]" />
              {calling === "service"
                ? "Votre sommelier approche."
                : "L'addition arrive."}
            </div>
          </motion.div>
        )}
        {billDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 px-6 backdrop-blur-md"
            onClick={() => {
              setBillDone(false);
              navigate("/");
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="card-dark relative max-w-md rounded-3xl p-10 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setBillDone(false);
                  navigate("/");
                }}
                className="absolute right-4 top-4 rounded-full border border-[#c9a961]/30 p-2 text-bone/60 hover:text-bone"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="text-[10px] uppercase tracking-[0.4em] text-[#c9a961]">
                Merci
              </div>
              <h3 className="mt-3 font-serif text-4xl font-light text-bone">
                Votre addition
              </h3>
              <div className="hairline my-6" />
              <div className="font-serif text-5xl text-gold-gradient tabular">
                €{billTotal}
              </div>
              <div className="mt-2 text-sm text-bone/55">
                Settled via your maître d'. Au plaisir de vous revoir.
              </div>
              <div className="hairline my-6" />
              <button
                onClick={() => {
                  setBillDone(false);
                  navigate("/");
                }}
                className="btn-ghost-dark w-full rounded-full px-6 py-3 text-sm"
              >
                Retour au lobby
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-8"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="card-dark relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 z-10 rounded-full border border-[#c9a961]/30 bg-black/40 p-2 text-bone/70 hover:text-bone"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-[#1a1814] to-[#0d0c0a] text-7xl">
                {selected.emoji}
              </div>
              <div className="p-7">
                <div className="text-[10px] uppercase tracking-[0.4em] text-[#c9a961]">
                  {selected.course} · {selected.origin}
                </div>
                <h3 className="mt-2 font-serif text-4xl font-light leading-tight text-bone">
                  {selected.name}
                </h3>
                <div className="hairline my-5" />
                <p className="text-base leading-relaxed text-bone/70">
                  {selected.description}
                </p>
                {selected.pairing && (
                  <div className="mt-6 rounded-2xl border border-[#c9a961]/20 bg-black/30 p-4">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-[#c9a961]">
                      <Wine className="h-3.5 w-3.5" />
                      Sommelier pairing
                    </div>
                    <div className="mt-1 font-serif text-xl italic text-bone">
                      {selected.pairing}
                    </div>
                  </div>
                )}
                <div className="mt-7 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
                      Price
                    </div>
                    <div className="font-serif text-3xl text-gold-gradient">
                      €{selected.price}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      triggerCall("service");
                      setSelected(null);
                    }}
                    className="btn-gold inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm"
                  >
                    <Bell className="h-4 w-4" />
                    Order via service
                  </button>
                </div>
                <p className="mt-4 text-center text-[10px] uppercase tracking-[0.3em] text-[#8a7340]">
                  No payment on this device — your maître will assist.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
