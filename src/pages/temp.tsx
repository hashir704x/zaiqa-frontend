import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";
// import { useNavigate } from "react-router";
import { createPlan, type CreateMealPlanPayload } from "../lib/api-functions";
import { Spinner } from "../components/spinner";
import { toast } from "sonner";

type Cuisine = "desi" | "western" | "arabic" | "pan_asian";
type SpiceLevel = "low" | "medium" | "high" | "extra_hot";
type PlanType = "instant" | "one_day" | "three_day" | "week";

const cuisineOptions: { value: Cuisine; label: string; description: string }[] = [
  { value: "desi", label: "Desi", description: "Comforting subcontinental flavors" },
  { value: "western", label: "Western", description: "Pastas, bowls and roasts" },
  { value: "arabic", label: "Arabic", description: "Grills, mezze and rice dishes" },
  { value: "pan_asian", label: "Pan-Asian", description: "Stir-fries, noodles and curries" },
];

const spiceOptions: { value: SpiceLevel; label: string; hint: string }[] = [
  { value: "low", label: "Low", hint: "Very mild heat" },
  { value: "medium", label: "Medium", hint: "Balanced warmth" },
  { value: "high", label: "High", hint: "Bold, spicy kick" },
  { value: "extra_hot", label: "Extra hot", hint: "For true heat lovers" },
];

const planTypeOptions: { value: PlanType; label: string; desc: string }[] = [
  { value: "instant", label: "Instant", desc: "One-shot quick suggestion" },
  { value: "one_day", label: "One day", desc: "Breakfast, lunch & dinner for a day" },
  { value: "three_day", label: "Three days", desc: "A long weekend of structured eating" },
  { value: "week", label: "Week", desc: "Full 7-day plan to reset your routine" },
];

const medicalConditionSuggestions = [
  "Diabetes",
  "Hypertension",
  "PCOS",
  "High cholesterol",
  "Weight loss",
  "Kidney friendly",
];

const pantryCategories = {
  vegetables: [
    "Potatoes",
    "Onions",
    "Tomatoes",
    "Spinach",
    "Carrots",
    "Bell peppers",
    "Cauliflower",
    "Peas",
    "Broccoli",
    "Cabbage",
  ],
  fruits: [
    "Bananas",
    "Apples",
    "Oranges",
    "Grapes",
    "Mangoes",
    "Berries",
    "Pineapple",
    "Pomegranate",
  ],
  grains: ["Wheat flour", "Rice", "Bread", "Burger buns", "Pasta", "Oats", "Tortillas"],
  dairy: ["Milk", "Yogurt / Curd", "Cheese", "Butter", "Ghee", "Cooking cream"],
  meats: ["Chicken", "Beef", "Mutton", "Fish", "Eggs"],
  lentils: ["Red lentils (Masoor)", "Yellow lentils (Moong)", "Chickpeas", "Black lentils (Urad)", "Kidney beans"],
} as const;

type PantryCategoryKey = keyof typeof pantryCategories;

export default function CreatePlan() {
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine>("desi");
  const [selectedSpice, setSelectedSpice] = useState<SpiceLevel>("medium");
  const [selectedPlanType, setSelectedPlanType] = useState<PlanType>("three_day");
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [extraMedicalConditions, setExtraMedicalConditions] = useState("");
  const [pantrySelection, setPantrySelection] = useState<Record<PantryCategoryKey, string[]>>({
    vegetables: [],
    fruits: [],
    grains: [],
    dairy: [],
    meats: [],
    lentils: [],
  });
  const [extraPantryItems, setExtraPantryItems] = useState("");
  // const navigate = useNavigate();

  const splitCommaList = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

  const createPlanMutation = useMutation({
    mutationFn: (payload: CreateMealPlanPayload) => createPlan(payload),
    onSuccess: (data) => {
      console.log("data", data);
      toast.success("Plan created successfully");
      // navigate("/app/my-plans");
    },
    onError: (error: any) => {
      const message = error?.message ?? "Something went wrong while creating the plan.";
      toast.error(message);
    },
  });
  
  const toggleMedicalCondition = (condition: string) => {
    setMedicalConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition],
    );
  };

  const togglePantryItem = (category: PantryCategoryKey, item: string) => {
    setPantrySelection((prev) => {
      const items = prev[category] ?? [];
      const exists = items.includes(item);
      const nextItems = exists ? items.filter((i) => i !== item) : [...items, item];
      return { ...prev, [category]: nextItems };
    });
  };

  const selectAllCategory = (category: PantryCategoryKey) => {
    setPantrySelection((prev) => {
      const allItems = pantryCategories[category];
      const isAllSelected = prev[category]?.length === allItems.length;
      return {
        ...prev,
        [category]: isAllSelected ? [] : [...allItems],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const extraConditions = splitCommaList(extraMedicalConditions);
    const allConditions = [...medicalConditions, ...extraConditions];

    const pantryItemsFromSelection: string[] = [];
    Object.values(pantrySelection).forEach((items) => {
      pantryItemsFromSelection.push(...items);
    });

    const extraPantry = splitCommaList(extraPantryItems);
    const allPantryItems = [...pantryItemsFromSelection, ...extraPantry];

    const payload: CreateMealPlanPayload = {
      title: "Untitled meal plan",
      cuisine: selectedCuisine,
      spiceLevel: selectedSpice,
      planType: selectedPlanType,
      medicalConditions: allConditions.length > 0 ? allConditions : undefined,
      pantryItemsSnapshot: allPantryItems.length > 0 ? allPantryItems : undefined,
    };

    createPlanMutation.mutate(payload);
  };

  return (
    <motion.div
      className="relative isolate min-h-[calc(100vh-3.5rem)] bg-slate-950 px-4 py-8 lg:px-8 lg:py-10"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -left-40 top-[-10rem] h-72 w-72 rounded-full bg-gradient-to-br from-orange-500/70 via-amber-400/40 to-fuchsia-500/40 blur-3xl opacity-70"
          animate={{ y: [0, 20, 0], x: [0, 14, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10rem] right-[-6rem] h-72 w-72 rounded-full bg-gradient-to-tr from-orange-600/70 via-rose-500/40 to-amber-400/40 blur-3xl opacity-80"
          animate={{ y: [0, -18, 0], x: [0, -12, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-orange-200 shadow-sm shadow-orange-500/30 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_0_3px_rgba(249,115,22,0.35)]" />
            New AI meal plan
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            Tell us how you&apos;d like to eat.
          </h1>
          <p className="max-w-2xl text-sm text-slate-400 sm:text-base">
            Choose a cuisine, your spice comfort, how long the plan should run and what&apos;s already in
            your kitchen. Zaiqa AI will generate a structured plan and store it for you.
          </p>
        </header>

        <form
          className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)]"
          action="about:blank"
          onSubmit={handleSubmit}
        >
          {/* Left column: core preferences */}
          <section className="space-y-6">
            <div className="space-y-3 rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-md shadow-black/60 backdrop-blur">
              <h2 className="text-sm font-semibold text-slate-100">Plan basics</h2>
              <p className="text-xs text-slate-400">
                These settings influence how Gemini structures your plan and how many days it includes.
              </p>

              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300/80">
                    Cuisine
                  </label>
                  <div className="space-y-2">
                    {cuisineOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedCuisine(option.value)}
                        className={[
                          "w-full cursor-pointer rounded-2xl border px-3.5 py-2.5 text-left text-xs transition shadow-sm",
                          selectedCuisine === option.value
                            ? "border-orange-400/80 bg-orange-500/15 text-slate-50 shadow-orange-500/40"
                            : "border-white/10 bg-slate-900/60 text-slate-200 hover:border-orange-400/60 hover:bg-slate-900",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">{option.label}</span>
                          {selectedCuisine === option.value && (
                            <span className="text-[10px] uppercase tracking-[0.16em] text-orange-300">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-400">{option.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300/80">
                    Spice level
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {spiceOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedSpice(option.value)}
                        className={[
                          "cursor-pointer rounded-2xl border px-3 py-2 text-left text-[11px] transition shadow-sm",
                          selectedSpice === option.value
                            ? "border-orange-400/80 bg-orange-500/15 text-slate-50 shadow-orange-500/40"
                            : "border-white/10 bg-slate-900/60 text-slate-200 hover:border-orange-400/60 hover:bg-slate-900",
                        ].join(" ")}
                      >
                        <span className="block text-xs font-medium">{option.label}</span>
                        <span className="block text-[10px] text-slate-400">{option.hint}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300/80">
                  Plan duration
                </label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {planTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedPlanType(option.value)}
                      className={[
                        "cursor-pointer rounded-2xl border px-3 py-2 text-left text-[11px] transition shadow-sm",
                        selectedPlanType === option.value
                          ? "border-orange-400/80 bg-orange-500/15 text-slate-50 shadow-orange-500/40"
                          : "border-white/10 bg-slate-900/60 text-slate-200 hover:border-orange-400/60 hover:bg-slate-900",
                      ].join(" ")}
                    >
                      <span className="block text-xs font-medium">{option.label}</span>
                      <span className="block text-[10px] text-slate-400">{option.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-md shadow-black/60 backdrop-blur">
              <h2 className="text-sm font-semibold text-slate-100">Medical and dietary notes</h2>
              <p className="text-xs text-slate-400">
                Optional. We&apos;ll pass these to Gemini so meals can be suggested with extra care.
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {medicalConditionSuggestions.map((condition) => {
                  const selected = medicalConditions.includes(condition);
                  return (
                    <button
                      key={condition}
                      type="button"
                      onClick={() => toggleMedicalCondition(condition)}
                      className={[
                        "cursor-pointer rounded-full border px-3 py-1.5 text-[11px] font-medium transition",
                        selected
                          ? "border-orange-400/80 bg-orange-500/15 text-orange-200 shadow-sm shadow-orange-500/40"
                          : "border-white/15 bg-slate-900/70 text-slate-300 hover:border-orange-400/60 hover:text-orange-100",
                      ].join(" ")}
                    >
                      {condition}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 space-y-1.5">
                <label
                  htmlFor="extra-medical"
                  className="block text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300/80"
                >
                  Other conditions (comma separated)
                </label>
                <input
                  id="extra-medical"
                  type="text"
                  value={extraMedicalConditions}
                  onChange={(e) => setExtraMedicalConditions(e.target.value)}
                  placeholder="e.g. gluten free, thyroid, pregnancy"
                  className="block w-full rounded-2xl border border-white/10 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm shadow-black/40 outline-none ring-0 transition focus:border-orange-400/70 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                />
                <p className="text-[11px] text-slate-500">
                  Separate multiple conditions with commas. We&apos;ll merge them with the selected tags
                  when sending the request.
                </p>
              </div>
            </div>
          </section>

          {/* Right column: pantry selection */}
          <section className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-md shadow-black/60 backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">What&apos;s in your kitchen?</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Select ingredients you already have. Zaiqa AI will try to prioritize them in the plan.
                </p>
              </div>
              <span className="rounded-full bg-orange-500/15 px-3 py-1 text-[11px] font-medium text-orange-300">
                Optional
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {(Object.keys(pantryCategories) as PantryCategoryKey[]).map((categoryKey) => {
                const items = pantryCategories[categoryKey];
                const selectedItems = pantrySelection[categoryKey] ?? [];
                const allSelected = selectedItems.length === items.length && items.length > 0;

                const title =
                  categoryKey === "vegetables"
                    ? "Vegetables"
                    : categoryKey === "fruits"
                    ? "Fruits"
                    : categoryKey === "grains"
                    ? "Grains & staples"
                    : categoryKey === "dairy"
                    ? "Dairy & fats"
                    : categoryKey === "meats"
                    ? "Meats & proteins"
                    : "Lentils & beans";

                return (
                  <motion.div
                    key={categoryKey}
                    className="flex flex-col rounded-2xl border border-white/12 bg-slate-900/60 p-3 text-xs text-slate-200 shadow-sm shadow-black/40"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {title}
                      </p>
                      <button
                        type="button"
                        onClick={() => selectAllCategory(categoryKey)}
                        className="cursor-pointer text-[11px] font-medium text-orange-300 hover:text-orange-200"
                      >
                        {allSelected ? "Clear" : "Select all"}
                      </button>
                    </div>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {items.map((item) => {
                        const checked = selectedItems.includes(item);
                        return (
                          <motion.button
                            key={item}
                            type="button"
                            onClick={() => togglePantryItem(categoryKey, item)}
                            className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-left text-[11px] hover:bg-slate-800/70"
                            whileTap={{ scale: 0.97 }}
                          >
                            <motion.span
                              className="flex h-4 w-4 items-center justify-center rounded-md border border-white/25 bg-slate-950/90 shadow-sm"
                              animate={{
                                backgroundColor: checked ? "rgba(249,115,22,0.35)" : "rgba(15,23,42,0.95)",
                                borderColor: checked ? "rgba(249,115,22,0.9)" : "rgba(148,163,184,0.6)",
                                scale: checked ? 1 : 0.98,
                              }}
                              transition={{ duration: 0.18, ease: "easeOut" }}
                            >
                              {checked && (
                                <motion.span
                                  className="h-2.5 w-2.5 rounded-[4px] bg-gradient-to-br from-orange-500 to-amber-400 shadow-[0_0_6px_rgba(249,115,22,0.8)]"
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                />
                              )}
                            </motion.span>
                            <span className="text-slate-200">{item}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-3 space-y-1.5">
              <label
                htmlFor="extra-pantry"
                className="block text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300/80"
              >
                Other pantry items (comma separated)
              </label>
              <input
                id="extra-pantry"
                type="text"
                value={extraPantryItems}
                onChange={(e) => setExtraPantryItems(e.target.value)}
                placeholder="e.g. olive oil, basmati rice, oats"
                className="block w-full rounded-2xl border border-white/10 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm shadow-black/40 outline-none ring-0 transition focus:border-orange-400/70 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
              />
              <p className="text-[11px] text-slate-500">
                Add any key ingredients we haven&apos;t listed. Separate multiple items with commas so we
                can later split them into an array.
              </p>
            </div>

            <div className="pt-2">
              <motion.button
                type="submit"
                whileTap={createPlanMutation.isPending ? undefined : { scale: 0.97 }}
                disabled={createPlanMutation.isPending}
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/40 transition hover:from-orange-400 hover:via-amber-300 hover:to-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 disabled:cursor-not-allowed disabled:opacity-80"
              >
                <span className="absolute inset-0 translate-y-[120%] bg-gradient-to-r from-white/10 via-white/40 to-white/10 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100" />
                <span className="relative flex items-center gap-2">
                  {createPlanMutation.isPending ? (
                    <>
                      <Spinner size={18} color="#020617" />
                      <span>Generating your plan…</span>
                    </>
                  ) : (
                    <>
                      <span>Generate meal plan</span>
                      <span className="text-[11px] text-slate-900/80">→</span>
                    </>
                  )}
                </span>
              </motion.button>
              <p className="mt-2 text-[11px] text-slate-500">
                We&apos;ll call <code className="rounded bg-slate-900/80 px-1 py-[1px] text-[10px]">POST
                /api/meal-plans</code> on submit and show a loading state while Gemini and the database work.
              </p>
            </div>
          </section>
        </form>
      </div>
    </motion.div>
  );
}