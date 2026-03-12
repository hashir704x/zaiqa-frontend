import { Link } from "react-router";
import { motion } from "motion/react";
import { ChefHat, Soup, UtensilsCrossed } from "lucide-react";
import { authClient } from "../lib/auth-client";

export default function Home() {
  const { data } = authClient.useSession();
  return (
    <div className="relative isolate bg-white overflow-hidden">
      {/* Background gradients */}
      <motion.div
        className="pointer-events-none absolute -left-32 top-[-16rem] h-80 w-80 rounded-full bg-gradient-to-br from-emerald-200/40 via-emerald-100/30 to-lime-100/20 blur-3xl opacity-60"
        animate={{ y: [0, 18, 0], x: [0, 12, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-[-18rem] right-[-14rem] h-[22rem] w-[22rem] rounded-full bg-gradient-to-tr from-lime-200/40 via-emerald-100/30 to-emerald-50/20 blur-3xl opacity-60"
      />
      <motion.div
        className="pointer-events-none absolute inset-x-[-10rem] top-1/2 h-72 bg-gradient-to-r from-emerald-100/50 via-lime-50/40 to-emerald-100/50 blur-3xl opacity-50"
      />
    

      <div className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-6xl flex-col items-center justify-center gap-12 px-4 py-10 lg:flex-row lg:px-8 lg:py-16">
        {/* Hero copy */}
        <div className="flex-1 space-y-6">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-100 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-800 shadow-sm shadow-emerald-300/40 backdrop-blur"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.35)]" />
            AI-first meal planning for real kitchens
          </motion.div>

          <motion.h1
            className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
          >
            Cook{" "}
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-600 bg-clip-text text-transparent">
              smarter
              <ChefHat className="h-6 w-6 text-emerald-500/80" />
            </span>
            , not harder.
          </motion.h1>

          <motion.p
            className="max-w-xl text-base text-slate-700 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.26 }}
          >
            Zaiqa AI turns your cuisine, spice comfort, pantry items and health
            goals into structured meal plans you can actually follow. No more
            &quot;What should I cook today?&quot; spiral.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3 pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.32 }}
          >
            <Link
              to={data ? "/app/my-plans" : "/login"}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-300 via-lime-200 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-lg shadow-emerald-200/60 transition hover:from-emerald-200 hover:via-lime-100 hover:to-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200/80"
            >
              <span className="absolute inset-0 translate-y-[120%] bg-gradient-to-r from-white/10 via-white/40 to-white/10 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100" />

              <span className="relative flex items-center gap-2">
                <span>{data ? "View my plans" : "Login"}</span>
                <span className="text-[11px] text-slate-900/80">→</span>
              </span>
            </Link>

           
          </motion.div>

          <motion.dl
            className="mt-4 grid w-full gap-4 text-sm text-slate-800 sm:grid-cols-3 sm:text-base"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.38 }}
          >
            <div className="rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm shadow-emerald-100/70 backdrop-blur">
              <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">
                <UtensilsCrossed className="h-4 w-4 text-emerald-500" />
                Cuisine aware
              </dt>
              <dd className="mt-1 text-slate-800 text-sm">
                Desi, western, arabic or pan-asia, your call.
              </dd>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm shadow-emerald-100/70 backdrop-blur">
              <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">
                <Soup className="h-4 w-4 text-emerald-500" />
                Pantry friendly
              </dt>
              <dd className="mt-1 text-sm text-slate-800">
                Plans that respect what&apos;s already in your kitchen.
              </dd>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm shadow-emerald-100/70 backdrop-blur">
              <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">
                <ChefHat className="h-4 w-4 text-emerald-500" />
                Health aware
              </dt>
              <dd className="mt-1 text-sm text-slate-800">
                Designed around medical conditions, calories.
              </dd>
            </div>
          </motion.dl>
        </div>

        {/* Preview card */}
        <motion.div
          className="flex-1 max-w-md"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-5 shadow-2xl shadow-emerald-100/70 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-medium uppercase tracking-[0.2em] text-emerald-600">
                  Sample plan
                </p>
              
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-medium text-emerald-700">
                Ai powered
              </span>
            </div>

            <div className="space-y-3 text-sm text-slate-800">
              {["Day 1", "Day 2", "Day 3"].map((day, idx) => (
                <div
                  key={day}
                  className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 shadow-sm shadow-emerald-100/70"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      <Soup className="h-4 w-4 text-emerald-500" />
                      {day}
                    </span>
                    <span className="text-xs text-slate-500">
                      ~{idx === 0 ? "1,650" : idx === 1 ? "1,700" : "1,680"}{" "}
                      kcal
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    <li className="flex items-center justify-between gap-2">
                      <span className="text-slate-900">Breakfast</span>
                      <span className="text-xs text-slate-600">
                        Masala oats & chai
                      </span>
                    </li>
                    <li className="flex items-center justify-between gap-2">
                      <span className="text-slate-900">Lunch</span>
                      <span className="text-xs text-slate-600">
                        Grilled chicken with brown rice
                      </span>
                    </li>
                    <li className="flex items-center justify-between gap-2">
                      <span className="text-slate-900">Dinner</span>
                      <span className="text-xs text-slate-600">
                        Lentil soup with salad
                      </span>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
