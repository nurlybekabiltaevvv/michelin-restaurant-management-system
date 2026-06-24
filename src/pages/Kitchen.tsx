import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat,
  CheckCircle2,
  Clock,
  Flame,
  Bell,
  Hash,
  ArrowUpRight,
} from "lucide-react";
import { Brand } from "../components/Brand";
import { PageShell, TopBar } from "../components/PageShell";
import { useRestaurantStore } from "../store/useRestaurantStore";

function useTicker(intervalMs = 1000) {
  const [, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}

function formatTimer(ts: number) {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function statusColor(timerSec: number) {
  if (timerSec > 60 * 12) return "red";
  if (timerSec > 60 * 8) return "amber";
  return "ok";
}

export default function Kitchen() {
  useTicker(1000);
  const orders = useRestaurantStore((s) => s.orders);
  const updateOrderStatus = useRestaurantStore((s) => s.updateOrderStatus);
  const waiterCalls = useRestaurantStore((s) => s.waiterCalls);

  const cooking = useMemo(
    () =>
      orders
        .filter((o) => o.status !== "ready")
        .sort((a, b) => a.timestamp - b.timestamp),
    [orders]
  );

  const totalActive = cooking.length;
  const avgWait = useMemo(() => {
    if (!cooking.length) return 0;
    const now = Date.now();
    return Math.round(
      cooking.reduce((s, o) => s + (now - o.timestamp) / 1000, 0) /
        cooking.length
    );
  }, [cooking]);

  const markReady = (id: string) => {
    updateOrderStatus(id, "ready");
  };

  return (
    <PageShell tone="dark" className="velvet">
      <TopBar
        tone="dark"
        left={<Brand tone="dark" />}
        center={
          <div className="hidden items-center gap-4 rounded-full border border-[#c9a961]/30 bg-black/40 px-5 py-1.5 text-[10px] uppercase tracking-[0.32em] text-[#c9a961] sm:flex">
            <ChefHat className="h-3.5 w-3.5" />
            Kitchen Display · Service
          </div>
        }
        right={
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em]">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-[#8a7340]">Avg</span>
              <span className="font-mono text-base text-bone tabular">
                {Math.floor(avgWait / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(avgWait % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <Link
              to="/"
              className="flex items-center gap-1 text-[#8a7340] hover:text-[#c9a961]"
            >
              Lobby <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        }
      />

      <main className="mx-auto max-w-[1700px] px-4 pb-20 pt-4 sm:px-8 sm:pt-8">
        {/* KDS status row */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="card-dark rounded-2xl p-4">
            <div className="text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
              Active tickets
            </div>
            <div className="mt-1 font-serif text-4xl text-bone tabular">
              {totalActive}
            </div>
          </div>
          <div className="card-dark rounded-2xl p-4">
            <div className="text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
              Avg wait
            </div>
            <div className="mt-1 font-serif text-4xl text-gold-gradient tabular">
              {Math.floor(avgWait / 60)
                .toString()
                .padStart(2, "0")}
              :{(avgWait % 60).toString().padStart(2, "0")}
            </div>
          </div>
          <div className="card-dark rounded-2xl p-4">
            <div className="text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
              Brigade
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#c9a961]" />
              <span className="font-serif text-xl text-bone">Online</span>
            </div>
          </div>
          <div className="card-dark relative overflow-hidden rounded-2xl p-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#ff8a3d]/20 blur-2xl" />
            <div className="relative text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
              Calls
            </div>
            <div className="relative mt-1 flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#ff8a3d]" />
              <span className="font-serif text-3xl text-bone tabular">
                {waiterCalls.length}
              </span>
            </div>
          </div>
        </div>

        {/* Orders grid */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-[#c9a961]">
              Pass · Live
            </div>
            <h1 className="mt-1 font-serif text-4xl font-light text-bone sm:text-5xl">
              À la carte
            </h1>
          </div>
          <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-[#8a7340] sm:flex">
            <Clock className="h-3.5 w-3.5" />
            {new Date().toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <div className="hairline mb-6" />

        {cooking.length === 0 ? (
          <div className="card-dark mt-10 rounded-3xl p-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#c9a961]/30 bg-black/40">
              <ChefHat className="h-8 w-8 text-[#c9a961]" />
            </div>
            <h2 className="mt-6 font-serif text-3xl text-bone">Pass is clear</h2>
            <p className="mt-2 text-sm text-bone/55">
              Awaiting the next ticket from the floor.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {cooking.map((o) => {
                const elapsed = Math.floor((Date.now() - o.timestamp) / 1000);
                const color = statusColor(elapsed);
                return (
                  <motion.article
                    key={o.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.3 }}
                    className="card-dark relative flex flex-col overflow-hidden rounded-3xl"
                  >
                    {/* Header strip */}
                    <div
                      className={`flex items-center justify-between border-b px-5 py-3 ${
                        color === "red"
                          ? "border-red-400/40 bg-red-500/15"
                          : color === "amber"
                          ? "border-amber-300/40 bg-amber-300/10"
                          : "border-[#c9a961]/30 bg-black/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#c9a961]/40 bg-black/40 font-serif text-lg text-bone">
                          {o.tableId}
                        </span>
                        <div>
                          <div className="text-[9px] uppercase tracking-[0.32em] text-[#8a7340]">
                            Table
                          </div>
                          <div className="-mt-0.5 font-serif text-sm text-bone">
                            {o.tableId}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#8a7340]">
                          {o.id.slice(-6)}
                        </div>
                        <div
                          className={`mt-0.5 font-mono text-lg tabular ${
                            color === "red"
                              ? "text-red-300"
                              : color === "amber"
                              ? "text-amber-300"
                              : "text-bone"
                          }`}
                        >
                          {formatTimer(o.timestamp)}
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <ul className="flex-1 space-y-2 p-5">
                      {o.items.map((it) => (
                        <li
                          key={it.id}
                          className="flex items-baseline justify-between gap-3 border-b border-[#c9a961]/10 pb-2 last:border-b-0 last:pb-0"
                        >
                          <div className="flex items-baseline gap-3">
                            <span className="font-mono text-xl text-[#c9a961] tabular">
                              ×{it.qty}
                            </span>
                            <span className="font-serif text-2xl font-light leading-tight text-bone">
                              {it.name}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Footer — large DONE button */}
                    <div className="border-t border-[#c9a961]/20 p-4">
                      <button
                        onClick={() => markReady(o.id)}
                        className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#ff8a3d] via-[#ff7a26] to-[#d97742] px-5 py-5 text-2xl font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_40px_-12px_rgba(255,138,61,0.6)] transition active:scale-[0.98]"
                      >
                        <span className="absolute inset-0 bg-white opacity-0 transition group-hover:opacity-10" />
                        <CheckCircle2 className="mr-3 h-7 w-7" strokeWidth={2.5} />
                        Готово
                      </button>
                      <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
                        <span className="flex items-center gap-1.5">
                          <Flame className="h-3 w-3 text-[#ff8a3d]" />
                          Cooking
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Hash className="h-3 w-3" />
                          {o.items.length} course(s)
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Waiter calls strip (bottom) */}
        <AnimatePresence>
          {waiterCalls.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="fixed bottom-4 left-4 right-4 z-30 sm:left-auto sm:right-4 sm:max-w-sm"
            >
              <div className="card-dark rounded-2xl p-4">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-[#ff8a3d]">
                  <Bell className="h-3.5 w-3.5" />
                  Floor requests · {waiterCalls.length}
                </div>
                <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto">
                  {waiterCalls.slice(0, 5).map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center justify-between rounded-lg bg-black/40 px-3 py-1.5 text-sm text-bone"
                    >
                      <span className="font-serif text-base">
                        Table {c.tableId}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a7340]">
                        {c.reason}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </PageShell>
  );
}
