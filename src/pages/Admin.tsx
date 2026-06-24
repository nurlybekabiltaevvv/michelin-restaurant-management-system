import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp,
  CheckSquare,
  Square,
  Lock,
  Unlock,
  Euro,
  ShoppingBag,
  Coffee,
  Activity,
  Crown,
  ArrowUpRight,
} from "lucide-react";
import { Brand } from "../components/Brand";
import { PageShell, TopBar } from "../components/PageShell";
import {
  useRestaurantStore,
  type MenuItem,
} from "../store/useRestaurantStore";

export default function Admin() {
  const menu = useRestaurantStore((s) => s.menuItems);
  const stopList = useRestaurantStore((s) => s.stopList);
  const revenue = useRestaurantStore((s) => s.revenue);
  const orders = useRestaurantStore((s) => s.orders);
  const toggleStopList = useRestaurantStore((s) => s.toggleStopList);

  const [filterCat, setFilterCat] = useState<"All" | MenuItem["category"]>(
    "All"
  );

  const today = useMemo(() => {
    const list = orders;
    const ordersToday = list.length;
    const coursesToday = list.reduce((s, o) => s + o.items.length, 0);
    return {
      orders: ordersToday,
      courses: coursesToday,
    };
  }, [orders]);

  const stopCount = Object.values(stopList).filter(Boolean).length;

  const grossRevenue = useMemo(() => {
    return orders.reduce(
      (s, o) => s + o.items.reduce((x, it) => x + it.price * it.qty, 0),
      0
    );
  }, [orders]);

  const byCategory = useMemo(() => {
    const cats: Record<string, number> = { Starters: 0, Mains: 0, Desserts: 0 };
    menu.forEach((m) => {
      cats[m.category] = (cats[m.category] ?? 0) + m.price;
    });
    return cats;
  }, [menu]);

  const filteredMenu =
    filterCat === "All" ? menu : menu.filter((m) => m.category === filterCat);

  const trend = [
    { h: "18h", v: 320 },
    { h: "19h", v: 540 },
    { h: "20h", v: 980 },
    { h: "21h", v: 1240 },
    { h: "22h", v: 1620 },
    { h: "23h", v: 1480 },
  ];
  const maxV = Math.max(...trend.map((t) => t.v));

  return (
    <PageShell tone="light">
      <TopBar
        tone="light"
        left={<Brand tone="light" />}
        center={
          <div className="hidden items-center gap-2 rounded-full border border-[#c9a961]/35 bg-white px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-[#8a7340] sm:flex">
            <Crown className="h-3.5 w-3.5 text-[#c9a961]" />
            Direction · Back-office
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

      <main className="mx-auto max-w-[1700px] px-4 pb-24 pt-4 sm:px-8 sm:pt-10">
        <div className="flex flex-col gap-3 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-[#8a7340]">
              Direction générale
            </div>
            <h1 className="mt-2 font-serif text-5xl font-light leading-none text-ink sm:text-6xl">
              Administration
            </h1>
            <p className="mt-3 text-sm text-[#6b655c]">
              Mock revenue, stop-list and live snapshot of tonight's service.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#c9a961]/30 bg-white px-4 py-2 text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
            <Activity className="h-3.5 w-3.5 text-[#c9a961]" />
            Live ·{" "}
            <span className="text-ink">
              {new Date().toLocaleString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Top stats */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            tone="gold"
            label="Revenue (mock)"
            value={`€${revenue.toLocaleString("fr-FR")}`}
            sub="Across all settled bills"
            icon={Euro}
          />
          <StatCard
            label="In-flight tickets"
            value={orders.filter((o) => o.status !== "ready").length.toString()}
            sub={`${orders.length} total tonight`}
            icon={ShoppingBag}
          />
          <StatCard
            label="Courses ordered"
            value={today.courses.toString()}
            sub={`${today.orders} ticket(s)`}
            icon={Coffee}
          />
          <StatCard
            tone="ember"
            label="Stop-list items"
            value={stopCount.toString()}
            sub={stopCount > 0 ? "Hidden from carte" : "Carte in full"}
            icon={stopCount > 0 ? Lock : Unlock}
          />
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Revenue trend */}
          <section className="card-light rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
                  Tonight's revenue
                </div>
                <h2 className="mt-1 font-serif text-3xl text-ink">
                  €{revenue.toLocaleString("fr-FR")}
                </h2>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-700">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +18% vs. last service
                </div>
              </div>
              <div className="hidden text-right sm:block">
                <div className="text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
                  Open tabs
                </div>
                <div className="font-serif text-3xl text-ink tabular">
                  €{grossRevenue.toLocaleString("fr-FR")}
                </div>
              </div>
            </div>

            <div className="hairline my-5" />

            {/* Mock chart */}
            <div className="flex h-48 items-end gap-3 sm:gap-5">
              {trend.map((t, i) => (
                <div key={t.h} className="flex flex-1 flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(t.v / maxV) * 100}%` }}
                    transition={{ duration: 0.7, delay: 0.05 * i, ease: "easeOut" }}
                    className="relative w-full overflow-hidden rounded-t-md"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#c9a961] via-[#e2c98a] to-[#faf7f1]" />
                    <div className="shimmer absolute inset-0" />
                  </motion.div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#8a7340]">
                    {t.h}
                  </div>
                  <div className="font-mono text-[11px] text-ink tabular">
                    €{t.v}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Category mix */}
          <section className="card-light rounded-2xl p-6">
            <div className="text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
              Carte average · per course
            </div>
            <h2 className="mt-1 font-serif text-3xl text-ink">Mix</h2>
            <div className="hairline my-5" />
            <div className="space-y-4">
              {(Object.keys(byCategory) as Array<keyof typeof byCategory>).map(
                (c) => {
                  const v = byCategory[c];
                  const max = Math.max(...Object.values(byCategory));
                  return (
                    <div key={c}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-serif text-lg">{c}</span>
                        <span className="font-mono text-[#8a7340] tabular">
                          €{v}
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#ede7dc]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(v / max) * 100}%` }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-[#c9a961] to-[#e2c98a]"
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
            <div className="hairline my-5" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
                Average per course
              </span>
              <span className="font-serif text-2xl text-ink">
                €
                {Math.round(
                  Object.values(byCategory).reduce((a, b) => a + b, 0) / 3
                )}
              </span>
            </div>
          </section>
        </div>

        {/* Stop list */}
        <section className="card-light mt-8 overflow-hidden rounded-2xl">
          <div className="flex flex-col gap-3 border-b border-[#c9a961]/20 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
                <Lock className="h-3.5 w-3.5 text-[#c9a961]" />
                Stop-list · Carte availability
              </div>
              <h2 className="mt-1 font-serif text-3xl text-ink">
                Hide dishes from guests
              </h2>
              <p className="mt-1 text-sm text-[#6b655c]">
                Disabled items disappear from the guest carte at{" "}
                <code className="rounded bg-[#faf7f1] px-1 py-0.5 font-mono text-xs text-[#8a7340]">
                  /menu/:tableId
                </code>{" "}
                in real time.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["All", "Starters", "Mains", "Desserts"] as const).map((c) => (
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
              ))}
            </div>
          </div>

          <ul className="divide-y divide-[#c9a961]/15">
            {filteredMenu.map((m) => {
              const isOff = !!stopList[m.id];
              return (
                <li
                  key={m.id}
                  className={`flex items-center justify-between gap-4 px-6 py-4 transition ${
                    isOff ? "bg-[#faf7f1]/60" : "bg-white"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#faf7f1] text-2xl">
                      {m.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.32em] text-[#8a7340]">
                        <span>{m.category}</span>
                        <span className="h-1 w-1 rounded-full bg-[#c9a961]" />
                        <span>{m.course}</span>
                      </div>
                      <div
                        className={`mt-0.5 font-serif text-xl ${
                          isOff ? "text-[#9a958c] line-through" : "text-ink"
                        }`}
                      >
                        {m.name}
                      </div>
                      <div className="truncate text-xs text-[#6b655c]">
                        {m.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-4">
                    <div className="hidden text-right sm:block">
                      <div className="text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
                        Price
                      </div>
                      <div
                        className={`font-serif text-xl tabular ${
                          isOff ? "text-[#9a958c]" : "text-ink"
                        }`}
                      >
                        €{m.price}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleStopList(m.id)}
                      className={`group flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs uppercase tracking-[0.2em] transition ${
                        isOff
                          ? "border-red-400/40 bg-red-50 text-red-700 hover:border-red-500"
                          : "border-[#c9a961]/30 text-[#8a7340] hover:border-[#c9a961]"
                      }`}
                    >
                      {isOff ? (
                        <>
                          <Square className="h-3.5 w-3.5" />
                          <span>Hidden</span>
                        </>
                      ) : (
                        <>
                          <CheckSquare className="h-3.5 w-3.5 text-[#c9a961]" />
                          <span>Available</span>
                        </>
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="mt-8 flex items-center justify-between rounded-2xl border border-dashed border-[#c9a961]/40 bg-white p-5">
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
              Realtime sync
            </div>
            <div className="mt-1 font-serif text-xl text-ink">
              Every change here is broadcast instantly to all stations.
            </div>
          </div>
          <Link
            to="/menu/3"
            className="inline-flex items-center gap-2 rounded-full border border-[#c9a961]/40 bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#8a7340] hover:border-[#c9a961] hover:text-ink"
          >
            Preview guest view
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>
    </PageShell>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  sub: string;
  icon: any;
  tone?: "default" | "gold" | "ember";
}) {
  const styles =
    tone === "gold"
      ? "from-[#fff8e7] to-[#faf2dd] border-[#c9a961]/40"
      : tone === "ember"
      ? "from-[#fff3ec] to-[#ffe1cf] border-[#ff8a3d]/35"
      : "from-white to-[#faf7f1] border-[#c9a961]/20";
  const iconStyle =
    tone === "gold"
      ? "text-[#8a7340]"
      : tone === "ember"
      ? "text-[#c75a23]"
      : "text-[#8a7340]";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card-light relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 ${styles}`}
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#c9a961]/15 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.32em] text-[#8a7340]">
            {label}
          </div>
          <div className="mt-2 font-serif text-4xl font-light leading-none text-ink tabular">
            {value}
          </div>
          <div className="mt-2 text-xs text-[#6b655c]">{sub}</div>
        </div>
        <Icon className={`h-6 w-6 ${iconStyle}`} strokeWidth={1.5} />
      </div>
    </motion.div>
  );
}
