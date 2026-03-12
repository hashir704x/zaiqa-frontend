import { UtensilsCrossed } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { getAllPlans, type MealPlanSummary } from "../lib/api-functions";
import { Spinner } from "../components/spinner";

const planTypeLabel: Record<MealPlanSummary["planType"], string> = {
  instant: "Instant",
  one_day: "One day",
  three_day: "Three days",
  week: "Week-long",
};

const cuisineLabel: Record<MealPlanSummary["cuisine"], string> = {
  desi: "Desi",
  western: "Western",
  arabic: "Arabic",
  pan_asian: "Pan-Asian",
};

const spiceLabel: Record<MealPlanSummary["spiceLevel"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  extra_hot: "Extra hot",
};

export default function MyPlans() {
  // Load plans from the backend using TanStack Query
  const {
    data: plans,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<MealPlanSummary[], Error>({
    queryKey: ["meal-plans"],
    queryFn: getAllPlans,
  });

  const hasPlans = (plans ?? []).length > 0;
  return (
    <motion.div
      className=" relative isolate bg-white px-4 py-8 lg:px-8 lg:py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -left-40 top-[-10rem] h-72 w-72 rounded-full bg-gradient-to-br from-emerald-200/40 via-emerald-100/30 to-lime-100/20 blur-3xl opacity-60"
          animate={{ y: [0, 20, 0], x: [0, 14, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10rem] right-[-6rem] h-72 w-72 rounded-full bg-gradient-to-tr from-lime-200/40 via-emerald-100/30 to-emerald-50/20 blur-3xl opacity-60"
          animate={{ y: [0, -18, 0], x: [0, -12, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <motion.div
        className="relative mx-auto flex w-full max-w-6xl flex-col gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              My meal plans
            </h1>
            <p className="mt-1 text-base text-slate-700">
              Browse the plans you&apos;ve generated with Zaiqa AI. We&apos;ll
              show cuisine, spice and when they were created.
            </p>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <motion.div
            className="mt-12 flex flex-1 items-center justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white px-5 py-4 shadow-lg shadow-emerald-100/80 backdrop-blur">
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-100/60 via-lime-50/40 to-emerald-100/60 opacity-80" />
              <div className="flex items-center gap-3">
                <Spinner size={20} color="#fed7aa" />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Loading your meal plans…
                  </p>
                  <p className="text-[11px] text-slate-600">
                    We&apos;re fetching your saved plans from the kitchen.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error state */}
        {isError && !isLoading && (
          <div className="mt-10 flex flex-1 items-center justify-center">
            <div className="max-w-md rounded-2xl border border-red-300/60 bg-red-50 px-4 py-3 text-base text-red-700 shadow-md shadow-red-100/80 backdrop-blur">
              <p className="font-medium">Could not load your plans.</p>
              <p className="mt-1 text-xs text-red-500/90">{error?.message}</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 inline-flex cursor-pointer items-center rounded-full border border-red-400/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-red-700 hover:bg-red-100"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {!isLoading && !isError && !hasPlans ? (
          <motion.div
            className="mt-4 flex flex-1 items-center justify-center mt-16"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="max-w-md rounded-3xl border border-dashed border-emerald-200 bg-white/90 p-6 text-center shadow-lg shadow-emerald-100/80 backdrop-blur">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-300 via-lime-200 to-emerald-400 text-emerald-900 shadow-md shadow-emerald-200/70">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                No meal plans yet
              </h2>
              <p className="mt-2 text-sm text-slate-700">
                Once you generate a plan, it will appear here with a quick
                summary so you can reopen it anytime.
              </p>
              <p className="mt-3 text-xs text-slate-500">
                We&apos;ll also surface your most recent plan on the home screen
                for quick access.
              </p>

              <div className="mt-5 flex justify-center">
                <Link
                  to="/app/create-plan"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-300 via-lime-200 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-emerald-900 shadow-lg shadow-emerald-200/70 transition hover:from-emerald-200 hover:via-lime-100 hover:to-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200/80"
                >
                  <span className="absolute inset-0 translate-y-[120%] bg-gradient-to-r from-white/10 via-white/40 to-white/10 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100" />
                  <span className="relative flex items-center gap-2">
                    <span>Create plan</span>
                    <span className="text-[15px] text-emerald-900/80">+</span>
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        ) : !isLoading && !isError && hasPlans ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans!.map((plan) => (
              <Link
                to={`/app/plan-details/${plan.id}`}
                key={plan.id}
                className="group flex flex-col rounded-3xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-800 shadow-md shadow-emerald-100/80 backdrop-blur transition hover:border-emerald-400/70 hover:bg-emerald-50 cursor-pointer"
              >
                {/* Header with placeholder title and type chip */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                      Meal plan
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {plan.title}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    {planTypeLabel[plan.planType]}
                  </span>
                </div>

                {/* Meta row */}
                <div className="mb-3 flex items-center justify-between gap-3 text-xs text-slate-500">
                  <span>
                    {cuisineLabel[plan.cuisine]} · {spiceLabel[plan.spiceLevel]}{" "}
                    spice
                  </span>
                  <span>
                    {new Date(plan.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Badges row */}
                <div className=" flex flex-wrap gap-2 text-[12px]">
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-slate-700">
                    Cuisine:{" "}
                    <span className="text-emerald-700">
                      {cuisineLabel[plan.cuisine]}
                    </span>
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-slate-700">
                    Spice:{" "}
                    <span className="text-emerald-700">
                      {spiceLabel[plan.spiceLevel]}
                    </span>
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-slate-700">
                    Duration:{" "}
                    <span className="text-emerald-700">
                      {planTypeLabel[plan.planType]}
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
