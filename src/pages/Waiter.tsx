import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  Send,
  CheckCircle2,
  CircleDashed,
  Flame,
  Bell,
  Euro,
  Search,
  Users,
} from "lucide-react";
import { Brand } from "../components/Brand";
import { PageShell, TopBar } from "../components/PageShell";
import {
  useRestaurantStore,
  TABLES,
  type MenuItem,
} from "../store/useRestaurantStore";

type Draft = Record<string, number>; // menuItemId -> qty

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

export default function Waiter() {
  useTicker(1000);
  const menu = useRestaurantStore((s) => s.menuItems);
  const orders = useRestaurantStore((s) => s.orders);
  const waiterCalls = useRestaurantStore((s) => s.waiterCalls);
  const addOrder = useRestaurantStore((s) => s.addOrder);
  const settleBill = useRestaurantStore((s) => s.settleBill);
  const updateOrderStatus = useRestaurantStore((s) => s.updateOrderStatus);
  const clearWaiterCall = useRestaurantStore((s) => s.clearWaiterCall);

  const [activeTable, setActiveTable] = useState<string>(TABLES[0]);
  const [draft, setDraft] = useState<Draft>({});
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<"All" | MenuItem["category"]>(
    "All"
  );
  const [toast, setToast] = useState<string | null>(null);

  const tableOrders = useMemo(
    () => orders.filter((o) => o.tableId === activeTable),
    [orders, activeTable]
  );

  const activeOrders = tableOrders.filter((o) => o.status !== "ready");
  const readyOrders = tableOrders.filter((o) => o.status === "ready");

  const draftItems = Object.entries(draft)
    .filter(([, q]) => q > 0)
    .map(([mid, qty]) => {
      const m = menu.find((x) => x.id === mid)!;
      return { menuItemId: m.id, name: m.name, price: m.price, qty };
    });
  const draftTotal = draftItems.reduce((s, it) => s + it.price * it.qty, 0);

  const filteredMenu = menu.filter((m) => {
    if (filterCat !== "All" && m.category !== filterCat) return false;
    if (
      search &&
      !`${m.name} ${m.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const sendToKitchen = () => {
    if (!draftItems.length) return;
    addOrder(activeTable, draftItems);
    setDraft({});
    setToast(`Sent to kitchen · Table ${activeTable}`);
    setTimeout(() => setToast(null), 2200);
  };

  const markServed = (id: string) => {
    updateOrderStatus(id, "ready");
  };

  const settleTable = () => {
    const t = settleBill(activeTable);
    if (t > 0) {
      setToast(`Bill closed · €${t} for Table ${activeTable}`);
      setTimeout(() => setToast(null), 2200);
    }
  };

  return (
    <PageShell tone="light">
      <TopBar
        tone="light"
        left={<Brand tone="light" />}
        center={
          <div className="hidden items-center gap-2 rounded-full border border-[#c9a961]/35 bg-white px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-[#8a7340] sm:flex">
            <Users className="h-3.5 w-3.5 text-[#c9a961]" />
            Service · Floor 1
          </div>
        }
        right={
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#8a7340]">
            <Link to="/" className="hover:text-[#8a7340]">
              ← Lobby
            </Link>
          </div>
        }
      />

      <main className="mx-auto max-w-[1700px] px-4 pb-24 pt-4 sm:px-8 sm:pt-8">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr_380px]">
          {/* Tables sidebar */}
          <aside className="card-light rounded-2xl p-5 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
                  Floor plan
                </div>
                <h2 className="mt-1 font-serif text-2xl text-ink">Tables</h2>
              </div>
              <span className="rounded-full bg-[#c9a961]/15 px-2.5 py-0.5 text-xs text-[#8a7340]">
                {TABLES.length}
              </span>
            </div>
            <div className="hairline mb-4" />
            <div className="grid grid-cols-2 gap-2.5">
              {TABLES.map((t) => {
                const tOrders = orders.filter((o) => o.tableId === t);
                const hasActive = tOrders.some((o) => o.status !== "ready");
                const hasReady = tOrders.some((o) => o.status === "ready");
                const call = waiterCalls.find((c) => c.tableId === t);
                const active = t === activeTable;
                return (
                  <button
                    key={t}
                    onClick={() => setActiveTable(t)}
                    className={`relative rounded-xl border p-3 text-left transition ${
                      active
                        ? "border-[#c9a961] bg-[#c9a961]/10 shadow-sm"
                        : "border-[#c9a961]/15 bg-white hover:border-[#c9a961]/45"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-serif text-xl ${
                          active ? "text-ink" : "text-ink"
                        }`}
                      >
                        {t}
                      </span>
                      <div className="flex gap-1">
                        {call && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff8a3d] text-white">
                            <Bell className="h-3 w-3" />
                          </span>
                        )}
                        {hasActive && !call && (
                          <span className="h-2 w-2 rounded-full bg-[#ff8a3d] ember-pulse" />
                        )}
                        {hasReady && !hasActive && (
                          <span className="h-2 w-2 rounded-full bg-[#c9a961]" />
                        )}
                      </div>
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#8a7340]">
                      {tOrders.length} order{tOrders.length === 1 ? "" : "s"}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Center — Menu composer */}
          <section>
            <div className="card-light mb-5 rounded-2xl p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
                    Composing for
                  </div>
                  <h1 className="mt-1 font-serif text-3xl text-ink">
                    Table {activeTable}
                  </h1>
                </div>
                <div className="relative w-full sm:max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7340]" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search the carte…"
                    className="w-full rounded-full border border-[#c9a961]/25 bg-[#faf7f1] py-2.5 pl-9 pr-4 text-sm placeholder:text-[#9a958c] focus:border-[#c9a961] focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(["All", "Starters", "Mains", "Desserts"] as const).map(
                  (c) => (
                    <button
                      key={c}
                      onClick={() => setFilterCat(c as any)}
                      className={`rounded-full border px-3.5 py-1.5 text-xs uppercase tracking-[0.18em] transition ${
                        filterCat === c
                          ? "border-[#c9a961] bg-[#c9a961]/15 text-ink"
                          : "border-[#c9a961]/20 text-[#5a544a] hover:border-[#c9a961]/50"
                      }`}
                    >
                      {c}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredMenu.map((m) => {
                const q = draft[m.id] ?? 0;
                return (
                  <div
                    key={m.id}
                    className="card-light relative overflow-hidden rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.3em] text-[#8a7340]">
                          {m.category} · {m.course}
                        </div>
                        <h3 className="mt-1 font-serif text-xl leading-tight text-ink">
                          {m.name}
                        </h3>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f1] text-xl">
                        {m.emoji}
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#6b655c]">
                      {m.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-[#c9a961]/15 pt-3">
                      <span className="font-serif text-lg text-[#8a7340] tabular">
                        €{m.price}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            setDraft((d) => ({ ...d, [m.id]: Math.max(0, q - 1) }))
                          }
                          disabled={q === 0}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#c9a961]/30 text-[#8a7340] transition hover:border-[#c9a961] disabled:opacity-30"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center font-mono text-sm tabular">
                          {q}
                        </span>
                        <button
                          onClick={() => setDraft((d) => ({ ...d, [m.id]: q + 1 }))}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#c9a961] bg-[#c9a961] text-black transition hover:brightness-110"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    {q > 0 && (
                      <motion.div
                        layout
                        className="absolute right-3 top-3 rounded-full bg-[#c9a961] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black"
                      >
                        in cart
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Right — Order panel */}
          <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
            <div className="card-light flex h-full flex-col overflow-hidden rounded-2xl">
              <div className="border-b border-[#c9a961]/15 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
                      Table {activeTable}
                    </div>
                    <h2 className="font-serif text-2xl text-ink">The Ticket</h2>
                  </div>
                  <span className="rounded-full border border-[#c9a961]/30 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.25em] text-[#8a7340]">
                    {draftItems.length + activeOrders.length + readyOrders.length} items
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {/* Existing orders */}
                {tableOrders.length === 0 && draftItems.length === 0 && (
                  <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                    <div className="font-serif text-5xl text-[#c9a961]/30">
                      Ticket
                    </div>
                    <p className="mt-3 max-w-[16ch] text-sm text-[#6b655c]">
                      Choose courses from the carte to begin the order.
                    </p>
                  </div>
                )}

                {/* Active orders */}
                {activeOrders.length > 0 && (
                  <div className="mb-5">
                    <div className="mb-2 text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
                      In the kitchen
                    </div>
                    <div className="space-y-2.5">
                      {activeOrders.map((o) => {
                        const cooking = o.status === "cooking";
                        return (
                          <motion.div
                            layout
                            key={o.id}
                            className={`relative overflow-hidden rounded-xl border p-3.5 ${
                              cooking
                                ? "border-[#ff8a3d]/45 bg-white"
                                : "border-[#c9a961]/15 bg-[#faf7f1]"
                            }`}
                          >
                            {cooking && (
                              <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff8a3d]/15">
                                <span className="pulse-ring h-2.5 w-2.5 rounded-full bg-[#ff8a3d]" />
                              </span>
                            )}
                            <div className="flex items-center justify-between">
                              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8a7340]">
                                {o.id}
                              </div>
                              <div
                                className={`rounded-full px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] ${
                                  cooking
                                    ? "bg-[#ff8a3d]/15 text-[#c75a23]"
                                    : "bg-[#9a958c]/15 text-[#6b655c]"
                                }`}
                              >
                                {cooking ? (
                                  <span className="inline-flex items-center gap-1">
                                    <Flame className="h-2.5 w-2.5" />
                                    Cooking
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1">
                                    <CircleDashed className="h-2.5 w-2.5" />
                                    Pending
                                  </span>
                                )}
                              </div>
                            </div>
                            <ul className="mt-2.5 space-y-1">
                              {o.items.map((it) => (
                                <li
                                  key={it.id}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span className="text-ink">
                                    <span className="font-mono text-[#8a7340]">
                                      ×{it.qty}
                                    </span>{" "}
                                    {it.name}
                                  </span>
                                  <span className="font-mono text-xs text-[#8a7340] tabular">
                                    €{it.price * it.qty}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-2 flex items-center justify-between text-[10px] text-[#8a7340]">
                              <span className="font-mono tabular">
                                {formatTimer(o.timestamp)}
                              </span>
                              <span>{o.items.length} course(s)</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Ready orders — orange background per spec */}
                {readyOrders.length > 0 && (
                  <div className="mb-5">
                    <div className="mb-2 text-[10px] uppercase tracking-[0.32em] text-[#c75a23]">
                      Ready to serve
                    </div>
                    <div className="space-y-2.5">
                      {readyOrders.map((o) => (
                        <motion.div
                          layout
                          key={o.id}
                          className="relative overflow-hidden rounded-xl border-2 border-[#c75a23]/35 bg-gradient-to-br from-[#ff8a3d] to-[#d97742] p-4 text-white"
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/85">
                              {o.id}
                            </div>
                            <span className="rounded-full bg-white/25 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em]">
                              Ready
                            </span>
                          </div>
                          <ul className="mt-2 space-y-1 text-sm">
                            {o.items.map((it) => (
                              <li
                                key={it.id}
                                className="flex items-center justify-between"
                              >
                                <span>
                                  <span className="font-mono text-white/80">
                                    ×{it.qty}
                                  </span>{" "}
                                  {it.name}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => markServed(o.id)}
                            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-[#c75a23] transition hover:bg-bone"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Mark served
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New draft */}
                {draftItems.length > 0 && (
                  <div className="mb-2">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
                        New order
                      </div>
                      <button
                        onClick={() => setDraft({})}
                        className="text-[10px] uppercase tracking-[0.2em] text-[#8a7340] hover:text-[#c75a23]"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="rounded-xl border border-[#c9a961]/30 bg-white p-3.5">
                      <ul className="space-y-1.5">
                        {draftItems.map((it) => (
                          <li
                            key={it.menuItemId}
                            className="flex items-center justify-between text-sm"
                          >
                            <span>
                              <span className="font-mono text-[#8a7340]">
                                ×{it.qty}
                              </span>{" "}
                              {it.name}
                            </span>
                            <span className="font-mono text-xs text-[#8a7340] tabular">
                              €{it.price * it.qty}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 flex items-center justify-between border-t border-[#c9a961]/20 pt-3">
                        <span className="text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
                          Subtotal
                        </span>
                        <span className="font-serif text-xl text-ink tabular">
                          €{draftTotal}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom actions */}
              <div className="border-t border-[#c9a961]/20 p-5">
                <button
                  disabled={draftItems.length === 0}
                  onClick={sendToKitchen}
                  className="btn-ember inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                  Send to kitchen
                </button>
                {readyOrders.length > 0 && (
                  <button
                    onClick={settleTable}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#c9a961]/35 bg-white px-5 py-3 text-sm font-medium text-ink transition hover:border-[#c9a961]"
                  >
                    <Euro className="h-4 w-4 text-[#8a7340]" />
                    Close bill · €
                    {readyOrders.reduce(
                      (s, o) => s + o.items.reduce((x, it) => x + it.price * it.qty, 0),
                      0
                    )}
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Waiter calls floating panel */}
      <div className="fixed bottom-4 left-4 z-30 hidden max-w-sm lg:block">
        <AnimatePresence>
          {waiterCalls.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="card-light overflow-hidden rounded-2xl"
            >
              <div className="border-b border-[#c9a961]/20 bg-[#faf7f1] p-3">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
                  <Bell className="h-3.5 w-3.5 text-[#c75a23]" />
                  Guest requests · {waiterCalls.length}
                </div>
              </div>
              <ul className="max-h-64 overflow-y-auto">
                {waiterCalls.slice(0, 6).map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between border-b border-[#c9a961]/10 px-4 py-2.5 text-sm last:border-b-0"
                  >
                    <div>
                      <div className="font-serif text-base">
                        Table {c.tableId}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-[#8a7340]">
                        {c.reason === "service" ? "Service" : "Bill"}
                      </div>
                    </div>
                    <button
                      onClick={() => clearWaiterCall(c.id)}
                      className="rounded-full border border-[#c9a961]/30 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[#8a7340] hover:border-[#c9a961]"
                    >
                      Clear
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[#c9a961]/40 bg-ink px-5 py-3 text-sm text-bone shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#c9a961]" />
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
