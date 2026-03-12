import { motion } from "motion/react";
import {
  ArrowLeft,
  Clock,
  Flame,
  Soup,
  ChefHat,
  UtensilsCrossed,
  Scale,
  Utensils,
  ListOrdered,
} from "lucide-react";
import type { MealPlanEntry } from "../lib/api-functions";

type Props = {
  entry: MealPlanEntry;
  onBack: () => void;
};

const mealSlotLabel: Record<MealPlanEntry["mealSlot"], string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

const difficultyLabel: Record<MealPlanEntry["difficulty"], string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export function MealEntryDetailsPage({ entry, onBack }: Props) {
  return (
    <motion.div
      className="mt-5 space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-700 shadow-sm shadow-emerald-100/80 transition hover:border-emerald-300 hover:text-emerald-700 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to plan
      </button>

      <section className="relative space-y-4 rounded-3xl border border-emerald-100 bg-white p-5 shadow-lg shadow-emerald-100/80 backdrop-blur">
        {/* Soft background accent */}
        <div className="pointer-events-none absolute -right-20 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-emerald-200/40 via-emerald-100/30 to-lime-100/20 blur-3xl" />

        {/* Block 1: header + stats */}
        <motion.div
          className="relative space-y-4"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="flex items-start gap-4 sm:gap-5">
            <motion.div
              className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-300 via-lime-200 to-emerald-400 text-emerald-900 shadow-md shadow-emerald-200/80"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {entry.mealSlot === "breakfast" ? (
                <Soup className="h-7 w-7" />
              ) : entry.mealSlot === "lunch" ? (
                <UtensilsCrossed className="h-7 w-7" />
              ) : (
                <ChefHat className="h-7 w-7" />
              )}
            </motion.div>
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.25)]" />
                {mealSlotLabel[entry.mealSlot]}
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {entry.title}
              </h2>
              {entry.description && (
                <p className="mt-1.5 text-base leading-relaxed text-slate-700">
                  {entry.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-slate-700">
            {entry.cookingTime && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5">
                <Clock className="h-4 w-4 text-emerald-600" />
                {entry.cookingTime}
              </span>
            )}
            {entry.calories != null && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5">
                <Flame className="h-4 w-4 text-emerald-600" />
                {entry.calories} kcal
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5">
              {difficultyLabel[entry.difficulty]}
            </span>
          </div>

          {(entry.servings != null ||
            entry.weight ||
            entry.protein != null ||
            entry.carbs != null ||
            entry.fat != null) && (
            <div className="mt-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-slate-800">
              <p className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                <Scale className="h-4 w-4 text-emerald-600" />
                Nutrition & portion
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {entry.servings != null && (
                  <span>
                    Servings{" "}
                    <span className="font-semibold text-slate-900">
                      {entry.servings}
                    </span>
                  </span>
                )}
                {entry.weight && (
                  <span>
                    Portion{" "}
                    <span className="font-semibold text-slate-900">
                      {entry.weight}
                    </span>
                  </span>
                )}
                {entry.protein != null && (
                  <span>
                    Protein{" "}
                    <span className="font-semibold text-emerald-700">
                      {entry.protein} g
                    </span>
                  </span>
                )}
                {entry.carbs != null && (
                  <span>
                    Carbs{" "}
                    <span className="font-semibold text-emerald-700">
                      {entry.carbs} g
                    </span>
                  </span>
                )}
                {entry.fat != null && (
                  <span>
                    Fat{" "}
                    <span className="font-semibold text-emerald-700">
                      {entry.fat} g
                    </span>
                  </span>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Block 2: ingredients */}
        <div className="space-y-4 text-base text-slate-800">
          {entry.ingredients && entry.ingredients.length > 0 && (
            <motion.section
              className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3.5"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
            >
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                <Utensils className="h-4 w-4 text-emerald-600" />
                Ingredients
              </p>
              <ul className="space-y-1.5">
                {entry.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      {ing.name}
                    </span>
                    {(ing.quantity ?? ing.unit) && (
                      <span className="shrink-0 text-[13px] text-slate-600 tabular-nums">
                        {[ing.quantity, ing.unit].filter(Boolean).join(" ")}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* Block 3: steps */}
          {entry.instructions && entry.instructions.length > 0 && (
            <motion.section
              className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3.5"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut", delay: 0.1 }}
            >
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                <ListOrdered className="h-4 w-4 text-emerald-600" />
                Steps
              </p>
              <ol className="space-y-2.5">
                {entry.instructions.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[12px] font-semibold text-emerald-800">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed text-slate-800">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </motion.section>
          )}

          {!entry.ingredients?.length && !entry.instructions?.length && (
            <p className="rounded-2xl border border-dashed border-emerald-200 bg-white px-4 py-3 text-center text-xs text-slate-500">
              No ingredients or steps listed for this meal.
            </p>
          )}
        </div>
      </section>
    </motion.div>
  );
}

