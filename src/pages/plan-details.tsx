import { useParams, Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Flame,
  Soup,
  ChefHat,
  UtensilsCrossed,
  RefreshCw,
} from "lucide-react";
import {
  getPlanDetailsById,
  replaceMealEntry,
  deletePlan,
  type MealPlanDetails,
  type MealPlanEntry,
} from "../lib/api-functions";
import { Spinner } from "../components/spinner";
import { MealEntryDetailsPage } from "../components/meal-entry-details-page";

type MealEntry = MealPlanEntry;

const cuisineLabel: Record<MealPlanDetails["plan"]["cuisine"], string> = {
  desi: "Desi",
  western: "Western",
  arabic: "Arabic",
  pan_asian: "Pan-Asian",
};

const spiceLabel: Record<MealPlanDetails["plan"]["spiceLevel"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  extra_hot: "Extra hot",
};

const planTypeLabel: Record<MealPlanDetails["plan"]["planType"], string> = {
  instant: "Instant",
  one_day: "One day",
  three_day: "Three days",
  week: "Week-long",
};

const mealSlotLabel: Record<"breakfast" | "lunch" | "dinner", string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

export default function PlanDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedEntry, setSelectedEntry] = useState<MealEntry | null>(null);
  const [entryToReplace, setEntryToReplace] = useState<MealEntry | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery<
    MealPlanDetails,
    Error
  >({
    queryKey: ["meal-plan-details", id],
    queryFn: () => getPlanDetailsById(id!),
    enabled: !!id,
  });

  const replaceMutation = useMutation({
    mutationFn: () => replaceMealEntry(id!, entryToReplace!.id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["meal-plan-details", id] });
      setEntryToReplace(null);
      setSelectedEntry(result.entry);
    },
    onError: () => {
      // Keep confirm modal open so user can retry or cancel
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePlan(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
      queryClient.removeQueries({ queryKey: ["meal-plan-details", id] });
      navigate("/app/my-plans");
    },
  });

  const totalMeals =
    data?.days.reduce((sum, day) => sum + day.entries.length, 0) ?? 0;

  const totalCalories =
    data?.days.reduce(
      (sum, day) =>
        sum + day.entries.reduce((s, e) => s + (e.calories ?? 0), 0),
      0,
    ) ?? 0;

  return (
    <div className="relative isolate min-h-[calc(100vh-60px)] bg-white px-4 py-8 lg:px-8 lg:py-10">
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

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6">
        {/* Header row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/app/my-plans"
              className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-slate-700 shadow-sm shadow-emerald-100/80 transition hover:border-emerald-300 hover:text-emerald-700 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {data?.plan.title ?? "Plan details"}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                A clean, day-by-day overview of what Zaiqa AI has planned for
                you.
              </p>
            </div>
          </div>

          {data && (
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
              <span className="rounded-full bg-emerald-100 px-3 py-1">
                {cuisineLabel[data.plan.cuisine]} ·{" "}
                {spiceLabel[data.plan.spiceLevel]} spice
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1">
                {planTypeLabel[data.plan.planType]} plan
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-emerald-600" />
                {data.days.length} day{data.days.length === 1 ? "" : "s"}
              </span>
              <button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-400/70 bg-red-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-red-700 shadow-sm shadow-red-100/80 transition hover:bg-red-100 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                Delete plan
              </button>
            </div>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <motion.div
            className="mt-10 flex flex-1 items-center justify-center"
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
                    Loading your plan details…
                  </p>
                  <p className="text-[11px] text-slate-600">
                    We&apos;re fetching the full day-by-day breakdown from the
                    kitchen.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error state */}
        {isError && !isLoading && (
          <div className="mt-10 flex flex-1 items-center justify-center">
            <div className="max-w-md rounded-2xl border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-md shadow-red-100/80 backdrop-blur">
              <p className="font-medium">
                {error?.message === "Plan not found."
                  ? "We couldn&apos;t find this meal plan."
                  : "Could not load this meal plan."}
              </p>
              {error?.message && (
                <p className="mt-1 text-xs text-red-500/90">{error.message}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="inline-flex cursor-pointer items-center rounded-full border border-red-400/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-red-700 hover:bg-red-100"
                >
                  Try again
                </button>
                <Link
                  to="/app/my-plans"
                  className="inline-flex cursor-pointer items-center rounded-full border border-emerald-100 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-700 hover:bg-emerald-50"
                >
                  Back to plans
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && !isError && data && !selectedEntry && (
          <div className="mt-2 space-y-8">
            {/* ——— Top section: plan stats ——— */}
            <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-lg shadow-emerald-100/80 backdrop-blur">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Plan overview
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-1 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                  <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-700">
                    <UtensilsCrossed className="h-4 w-4 text-emerald-600" />
                    Total meals
                  </span>
                  <span className="text-xl font-semibold text-slate-900">
                    {totalMeals}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                  <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-700">
                    <Flame className="h-4 w-4 text-emerald-600" />
                    Calories
                  </span>
                  <span className="text-xl font-semibold text-slate-900">
                    {totalCalories > 0 ? totalCalories.toLocaleString() : "—"}{" "}
                    <span className="text-xs font-normal text-slate-600">
                      kcal
                    </span>
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                  <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-700">
                    <CalendarDays className="h-4 w-4 text-emerald-600" />
                    Created
                  </span>
                  <span className="text-lg font-semibold text-slate-900">
                    {new Date(data.plan.createdAt).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-700">
                    Days · Cuisine · Spice
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {data.days.length} day
                    {data.days.length === 1 ? "" : "s"} ·{" "}
                    {cuisineLabel[data.plan.cuisine]} ·{" "}
                    {spiceLabel[data.plan.spiceLevel]}
                  </span>
                  <span className="text-[11px] text-slate-600">
                    {planTypeLabel[data.plan.planType]} plan
                  </span>
                </div>
              </div>
            </section>

            {/* ——— Day sections with 3-column meal cards ——— */}
            {data.days.map((day, dayIdx) => (
              <motion.section
                key={day.id}
                className="space-y-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: dayIdx * 0.05 }}
              >
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-emerald-100 pb-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Day {day.dayIndex + 1}
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-600">
                      {day.summary || "Your meals for this day"}
                    </p>
                    {day.date && (
                      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5 text-emerald-600" />
                        {new Date(day.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-medium text-emerald-700">
                    {day.entries.length} meal
                    {day.entries.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {day.entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white text-left shadow-md shadow-emerald-100/80 transition hover:border-emerald-400/60 hover:bg-emerald-50"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedEntry(entry)}
                        className="flex flex-1 flex-col p-4 pr-12 cursor-pointer text-left"
                      >
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-300 via-lime-200 to-emerald-400 text-emerald-900 shadow-lg shadow-emerald-200/80">
                          {entry.mealSlot === "breakfast" ? (
                            <Soup className="h-5 w-5" />
                          ) : entry.mealSlot === "lunch" ? (
                            <UtensilsCrossed className="h-5 w-5" />
                          ) : (
                            <ChefHat className="h-5 w-5" />
                          )}
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                          {mealSlotLabel[entry.mealSlot]}
                        </p>
                        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-slate-900">
                          {entry.title}
                        </h3>
                        {entry.description && (
                          <p className="mt-1.5 line-clamp-2 text-[12px] text-slate-600">
                            {entry.description}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-600">
                          {entry.cookingTime && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1">
                              <Clock className="h-3.5 w-3.5 text-emerald-600" />
                              {entry.cookingTime}
                            </span>
                          )}
                          {entry.calories != null && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1">
                              <Flame className="h-3.5 w-3.5 text-emerald-600" />
                              {entry.calories} kcal
                            </span>
                          )}
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEntryToReplace(entry);
                        }}
                        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-100 bg-white text-slate-500 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
                        title="Replace this meal"
                        aria-label="Replace this meal"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.section>
            ))}

            {/* Optional: medical & pantry if present */}
            {(data.plan.medicalConditions?.length ?? 0) > 0 ||
            (data.plan.pantryItemsSnapshot?.length ?? 0) > 0 ? (
              <section className="rounded-2xl border border-emerald-100 bg-white p-4 text-[11px] backdrop-blur">
                {data.plan.medicalConditions &&
                  data.plan.medicalConditions.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        Medical & dietary notes
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {data.plan.medicalConditions.map((c) => (
                          <span
                            key={c}
                            className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800 text-xs"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                {data.plan.pantryItemsSnapshot &&
                  data.plan.pantryItemsSnapshot.length > 0 && (
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        Pantry snapshot
                      </p>
                      <div className="mt-1.5 flex max-h-20 flex-wrap gap-1.5 overflow-y-auto">
                        {data.plan.pantryItemsSnapshot.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-emerald-50 px-2.5 py-1 text-slate-800 text-xs"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </section>
            ) : null}
          </div>
        )}

        {/* When a specific meal is selected, show full-page details within this view */}
        {!isLoading && !isError && data && selectedEntry && (
          <MealEntryDetailsPage
            entry={selectedEntry}
            onBack={() => setSelectedEntry(null)}
          />
        )}

        {/* Delete plan confirmation modal */}
        <AnimatePresence>
          {isDeleteOpen && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-plan-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[65] flex items-center justify-center p-4"
            >
              <div
                className="absolute inset-0 bg-slate-950/70"
                onClick={() =>
                  !deleteMutation.isPending && setIsDeleteOpen(false)
                }
                aria-hidden="true"
              />
              <motion.div
                id="delete-plan-title"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-sm rounded-2xl border border-red-300/70 bg-white p-5 shadow-xl shadow-red-100/80"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  Delete this plan?
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  This will permanently remove this meal plan and all its days
                  and entries from your account. This action cannot be undone.
                </p>
                {deleteMutation.isError && (
                  <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    {deleteMutation.error?.message ??
                      "Could not delete this plan. Please try again."}
                  </p>
                )}
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDeleteOpen(false)}
                    disabled={deleteMutation.isPending}
                    className="flex-1 rounded-xl border border-emerald-100 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate()}
                    disabled={deleteMutation.isPending}
                    className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/40 transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-75 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <Spinner size={16} color="#022c22" />
                        <span>Deleting…</span>
                      </>
                    ) : (
                      "Yes, delete"
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Replace meal confirmation modal */}
        <AnimatePresence>
          {entryToReplace && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="replace-confirm-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            >
              <div
                className="absolute inset-0 bg-slate-950/70"
                onClick={() =>
                  !replaceMutation.isPending && setEntryToReplace(null)
                }
                aria-hidden="true"
              />
              <motion.div
                id="replace-confirm-title"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-sm rounded-2xl border border-emerald-100 bg-white shadow-xl shadow-emerald-100/80 p-5"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  Replace this meal?
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Are you sure? A new suggestion will be generated for this slot
                  based on your plan&apos;s cuisine and preferences.
                </p>
                {replaceMutation.isError && (
                  <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    {replaceMutation.error?.message ??
                      "Something went wrong. Please try again."}
                  </p>
                )}
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEntryToReplace(null)}
                    disabled={replaceMutation.isPending}
                    className="flex-1 rounded-xl border border-emerald-100 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => replaceMutation.mutate()}
                    disabled={replaceMutation.isPending}
                    className="flex-1 rounded-xl bg-gradient-to-r from-emerald-300 via-lime-200 to-emerald-400 px-4 py-2.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-200/70 transition hover:from-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  >
                    {replaceMutation.isPending ? (
                      <>
                        <Spinner size={16} color="#022c22" />
                        <span>Replacing…</span>
                      </>
                    ) : (
                      "Yes, replace"
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
