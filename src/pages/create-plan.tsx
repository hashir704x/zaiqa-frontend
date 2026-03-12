import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, Sparkles, X, Eye } from "lucide-react";
import { createPlan, type CreateMealPlanPayload } from "../lib/api-functions";
import { toast } from "sonner";
import { Spinner } from "../components/spinner";

type Cuisine = "desi" | "western" | "arabic" | "pan_asian";
type SpiceLevel = "low" | "medium" | "high" | "extra_hot";
type PlanType = "instant" | "one_day" | "three_day" | "week";

const STEPS = [
  { id: "cuisine", title: "Cuisine", subtitle: "What kind of food do you crave?" },
  { id: "spice", title: "Spice level", subtitle: "How much heat can you handle?" },
  { id: "duration", title: "Plan duration", subtitle: "How long should your plan run?" },
  { id: "medical", title: "Diet & health", subtitle: "Any dietary or medical notes? (optional)" },
  { id: "pantry", title: "Your kitchen", subtitle: "What's already in your pantry? (optional)" },
  { id: "review", title: "You're all set", subtitle: "Review and generate your plan" },
] as const;

const TOTAL_STEPS = STEPS.length;

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
    "Potatoes", "Onions", "Tomatoes", "Spinach", "Carrots",
    "Bell peppers", "Cauliflower", "Peas", "Broccoli", "Cabbage",
  ],
  fruits: [
    "Bananas", "Apples", "Oranges", "Grapes", "Mangoes",
    "Berries", "Pineapple", "Pomegranate",
  ],
  grains: ["Wheat flour", "Rice", "Bread", "Burger buns", "Pasta", "Oats", "Tortillas"],
  dairy: ["Milk", "Yogurt / Curd", "Cheese", "Butter", "Ghee", "Cooking cream"],
  meats: ["Chicken", "Beef", "Mutton", "Fish", "Eggs"],
  lentils: ["Red lentils (Masoor)", "Yellow lentils (Moong)", "Chickpeas", "Black lentils (Urad)", "Kidney beans"],
} as const;

type PantryCategoryKey = keyof typeof pantryCategories;

const categoryTitles: Record<PantryCategoryKey, string> = {
  vegetables: "Vegetables",
  fruits: "Fruits",
  grains: "Grains & staples",
  dairy: "Dairy & fats",
  meats: "Meats & proteins",
  lentils: "Lentils & beans",
};

export default function CreatePlan() {
  const [step, setStep] = useState(0);
  const [planTitle, setPlanTitle] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine | null>(null);
  const [selectedSpice, setSelectedSpice] = useState<SpiceLevel | null>(null);
  const [selectedPlanType, setSelectedPlanType] = useState<PlanType | null>(null);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [extraMedicalConditions, setExtraMedicalConditions] = useState("");
  const [pantrySelection, setPantrySelection] = useState<Record<PantryCategoryKey, string[]>>({
    vegetables: [], fruits: [], grains: [], dairy: [], meats: [], lentils: [],
  });
  const [extraPantryItems, setExtraPantryItems] = useState("");
  const [pantryModalOpen, setPantryModalOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const splitCommaList = (value: string) =>
    value.split(",").map((s) => s.trim()).filter(Boolean);

  const createPlanMutation = useMutation({
    mutationFn: (payload: CreateMealPlanPayload) => createPlan(payload),
    onSuccess: () => {
      setStep(0);
      setPlanTitle("");
      setSelectedCuisine(null);
      setSelectedSpice(null);
      setSelectedPlanType(null);
      setMedicalConditions([]);
      setExtraMedicalConditions("");
      setPantrySelection({ vegetables: [], fruits: [], grains: [], dairy: [], meats: [], lentils: [] });
      setExtraPantryItems("");
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
      toast.success("Meal plan created successfully");
      navigate("/app/my-plans");
    },
    onError: (error: Error) => {
      const message = error?.message ?? "Something went wrong while creating the plan.";
      toast.error(message);
    },
  });

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const toggleMedicalCondition = (condition: string) => {
    setMedicalConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition],
    );
  };

  const togglePantryItem = (category: PantryCategoryKey, item: string) => {
    setPantrySelection((prev) => {
      const items = prev[category] ?? [];
      const next = items.includes(item) ? items.filter((i) => i !== item) : [...items, item];
      return { ...prev, [category]: next };
    });
  };

  const selectAllCategory = (category: PantryCategoryKey) => {
    const all = pantryCategories[category];
    setPantrySelection((prev) => ({
      ...prev,
      [category]: prev[category]?.length === all.length ? [] : [...all],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== TOTAL_STEPS - 1 || !selectedCuisine || !selectedSpice || !selectedPlanType) return;

    const trimmedTitle = planTitle.trim();
    if (!trimmedTitle) {
      toast.error("Plan title is required.");
      return;
    }

    const allConditions = [...medicalConditions, ...splitCommaList(extraMedicalConditions)];
    const pantryItems: string[] = [];
    Object.values(pantrySelection).forEach((items) => pantryItems.push(...items));
    const allPantry = [...pantryItems, ...splitCommaList(extraPantryItems)];

    if (allPantry.length < 4) {
      toast.error("Please select at least 4 pantry items so we can build a useful plan.");
      return;
    }

    const payload: CreateMealPlanPayload = {
      title: trimmedTitle,
      cuisine: selectedCuisine,
      spiceLevel: selectedSpice,
      planType: selectedPlanType,
      medicalConditions: allConditions.length > 0 ? allConditions : undefined,
      pantryItemsSnapshot: allPantry.length > 0 ? allPantry : undefined,
    };
    createPlanMutation.mutate(payload);
  };

  const currentStepConfig = STEPS[step];
  const isOptionalStep = step === 3 || step === 4;
  const isReviewStep = step === TOTAL_STEPS - 1;

  return (
    <motion.div
      className="relative isolate bg-white px-4 py-8 lg:px-8 lg:py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
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

      <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-8">
        {/* Step progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium uppercase tracking-[0.2em] text-slate-600">
              Step {step + 1} of {TOTAL_STEPS}
            </span>
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setStep(i)}
                  className="h-1.5 w-1.5 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: i <= step ? "rgba(16,185,129,0.9)" : "rgba(148,163,184,0.4)",
                  }}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-emerald-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-300"
              initial={false}
              animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Step title */}
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {currentStepConfig.title}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {currentStepConfig.subtitle}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {/* Step 0: Cuisine */}
            {step === 0 && (
              <motion.div
                key="cuisine"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-3 sm:grid-cols-2"
              >
                {cuisineOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSelectedCuisine(opt.value);
                      setStep(1);
                    }}
                    className={[
                      "cursor-pointer rounded-2xl border px-4 py-4 text-left transition shadow-sm",
                      selectedCuisine === opt.value
                        ? "border-emerald-400/80 bg-emerald-100 text-slate-900 shadow-emerald-200/80"
                        : "border-emerald-100 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50",
                    ].join(" ")}
                  >
                    <span className="block text-sm font-semibold text-slate-900">{opt.label}</span>
                    <span className="mt-1 block text-[11px] text-slate-600">{opt.description}</span>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Step 1: Spice */}
            {step === 1 && (
              <motion.div
                key="spice"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 gap-3 sm:grid-cols-4"
              >
                {spiceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSelectedSpice(opt.value);
                      setStep(2);
                    }}
                    className={[
                      "cursor-pointer rounded-2xl border px-4 py-3 text-left transition shadow-sm",
                      selectedSpice === opt.value
                        ? "border-emerald-400/80 bg-emerald-100 text-slate-900 shadow-emerald-200/80"
                        : "border-emerald-100 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50",
                    ].join(" ")}
                  >
                    <span className="block text-sm font-semibold text-slate-900">{opt.label}</span>
                    <span className="mt-0.5 block text-[11px] text-slate-600">{opt.hint}</span>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Step 2: Plan type */}
            {step === 2 && (
              <motion.div
                key="duration"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-3 sm:grid-cols-2"
              >
                {planTypeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSelectedPlanType(opt.value);
                      setStep(3);
                    }}
                    className={[
                      "cursor-pointer rounded-2xl border px-4 py-4 text-left transition shadow-sm",
                      selectedPlanType === opt.value
                        ? "border-emerald-400/80 bg-emerald-100 text-slate-900 shadow-emerald-200/80"
                        : "border-emerald-100 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50",
                    ].join(" ")}
                  >
                    <span className="block text-sm font-semibold text-slate-900">{opt.label}</span>
                    <span className="mt-1 block text-[11px] text-slate-600">{opt.desc}</span>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Step 3: Medical (optional) */}
            {step === 3 && (
              <motion.div
                key="medical"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex flex-wrap gap-2">
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
                            ? "border-emerald-400/80 bg-emerald-100 text-emerald-800"
                            : "border-emerald-100 bg-white text-slate-700 hover:border-emerald-300",
                        ].join(" ")}
                      >
                        {condition}
                      </button>
                    );
                  })}
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="extra-medical"
                    className="block text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600"
                  >
                    Other (comma separated)
                  </label>
                  <input
                    id="extra-medical"
                    type="text"
                    value={extraMedicalConditions}
                    onChange={(e) => setExtraMedicalConditions(e.target.value)}
                    placeholder="e.g. gluten free, thyroid"
                    className="block w-full rounded-2xl border border-emerald-100 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-emerald-100/60 focus:border-emerald-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 4: Pantry (optional) */}
            {step === 4 && (
              <motion.div
                key="pantry"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {(Object.keys(pantryCategories) as PantryCategoryKey[]).map((key) => {
                    const items = pantryCategories[key];
                    const selected = pantrySelection[key] ?? [];
                    const allSelected = selected.length === items.length;
                    return (
                      <div
                        key={key}
                        className="rounded-2xl border border-emerald-100 bg-white p-3"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                            {categoryTitles[key]}
                          </span>
                          <button
                            type="button"
                            onClick={() => selectAllCategory(key)}
                            className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 cursor-pointer"
                          >
                            {allSelected ? "Clear" : "Select all"}
                          </button>
                        </div>
                        <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
                          {items.map((item) => {
                            const isSelected = selected.includes(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => togglePantryItem(key, item)}
                                className={[
                                  "cursor-pointer rounded-full px-2.5 py-1 text-[11px] transition",
                                  isSelected
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-emerald-50 text-slate-700 hover:bg-emerald-100",
                                ].join(" ")}
                              >
                                {item}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="extra-pantry"
                    className="block text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600"
                  >
                    Other pantry items (comma separated)
                  </label>
                  <input
                    id="extra-pantry"
                    type="text"
                    value={extraPantryItems}
                    onChange={(e) => setExtraPantryItems(e.target.value)}
                    placeholder="e.g. olive oil, basmati rice"
                    className="block w-full rounded-2xl border border-emerald-100 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-emerald-100/60 focus:border-emerald-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {selectedCuisine && selectedSpice && selectedPlanType ? (
                  <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-lg shadow-emerald-100/80 backdrop-blur">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-300 via-lime-200 to-emerald-400 text-emerald-900">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        Your plan summary
                      </span>
                    </div>

                    <div className="mb-4 space-y-1.5">
                      <label
                        htmlFor="plan-title"
                        className="block text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600"
                      >
                        Plan title
                      </label>
                      <input
                        id="plan-title"
                        type="text"
                        value={planTitle}
                        onChange={(e) => setPlanTitle(e.target.value)}
                        placeholder="e.g. Weeknight desi comfort, Low-spice lunch prep"
                        className="block w-full rounded-2xl border border-emerald-100 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-emerald-100/60 outline-none ring-0 transition focus:border-emerald-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
                      />
                    </div>

                    <dl className="space-y-3 text-sm">
                      {planTitle.trim() && (
                        <div className="flex justify-between gap-4 border-b border-emerald-100 pb-2">
                          <dt className="text-slate-600">Title</dt>
                          <dd className="font-medium text-slate-900 text-right">
                            {planTitle.trim()}
                          </dd>
                        </div>
                      )}
                      <div className="flex justify-between gap-4 border-b border-emerald-100 pb-2">
                        <dt className="text-slate-600">Cuisine</dt>
                        <dd className="font-medium text-slate-900">
                          {cuisineOptions.find((o) => o.value === selectedCuisine)?.label ??
                            selectedCuisine}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 border-b border-emerald-100 pb-2">
                        <dt className="text-slate-600">Spice level</dt>
                        <dd className="font-medium text-slate-900">
                          {spiceOptions.find((o) => o.value === selectedSpice)?.label ??
                            selectedSpice}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 border-b border-emerald-100 pb-2">
                        <dt className="text-slate-600">Duration</dt>
                        <dd className="font-medium text-slate-900">
                          {planTypeOptions.find((o) => o.value === selectedPlanType)?.label ??
                            selectedPlanType}
                        </dd>
                      </div>
                      {medicalConditions.length > 0 || extraMedicalConditions.trim() ? (
                        <div className="flex justify-between gap-4 border-b border-emerald-100 pb-2">
                          <dt className="text-slate-600">Diet & health</dt>
                          <dd className="text-right font-medium text-slate-900">
                            {[...medicalConditions, ...splitCommaList(extraMedicalConditions)].join(
                              ", ",
                            )}
                          </dd>
                        </div>
                      ) : null}
                      {(() => {
                        const total =
                          Object.values(pantrySelection).flat().length +
                          splitCommaList(extraPantryItems).length;
                        return (
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 pb-2">
                            <dt className="text-slate-600">Pantry items</dt>
                            <dd className="flex items-center gap-2">
                              <span className="font-medium text-slate-900">
                                {total} selected
                              </span>
                              <button
                                type="button"
                                onClick={() => setPantryModalOpen(true)}
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-emerald-400/60 bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-700 transition hover:bg-emerald-200 hover:text-emerald-900"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                View
                              </button>
                            </dd>
                          </div>
                        );
                      })()}
                    </dl>
                  </div>
                ) : (
                  <p className="rounded-2xl border border-emerald-100 bg-white/80 px-4 py-3 text-center text-sm text-slate-600">
                    Complete cuisine, spice and duration in the steps above to see your summary.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {step > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-2xl border border-emerald-100 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
              )}
            </div>
            <div className="flex gap-2 sm:ml-auto">
              {isReviewStep ? (
                <motion.button
                  type="submit"
                  disabled={createPlanMutation.isPending || !selectedCuisine || !selectedSpice || !selectedPlanType}
                  whileTap={createPlanMutation.isPending ? undefined : { scale: 0.98 }}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-300 via-lime-200 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-200/70 transition hover:from-emerald-200 hover:via-lime-100 hover:to-emerald-400 disabled:cursor-not-allowed disabled:opacity-80 sm:w-auto"
                >
                  {createPlanMutation.isPending ? (
                    <>
                      <Spinner size={18} color="#022c22" />
                      <span>Generating your plan…</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-emerald-700" />
                      <span>Generate meal plan</span>
                    </>
                  )}
                </motion.button>
              ) : isOptionalStep ? (
                <>
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex cursor-pointer items-center rounded-2xl border border-emerald-100 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-300 via-lime-200 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-200/70 transition hover:from-emerald-200 hover:via-lime-100 hover:to-emerald-400"
                  >
                    <span>Continue</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </form>

        {/* Pantry items modal (review step) */}
        <AnimatePresence>
          {pantryModalOpen && (
            <>
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="pantry-modal-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                  onClick={() => setPantryModalOpen(false)}
                  aria-hidden="true"
                />
                <motion.div
                  id="pantry-modal-title"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-emerald-100 bg-white shadow-2xl shadow-emerald-100/80"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-emerald-100 px-5 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">Your pantry items</h2>
                    <button
                      type="button"
                      onClick={() => setPantryModalOpen(false)}
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-emerald-100 text-slate-500 transition hover:border-emerald-400 hover:text-emerald-700"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    <p className="text-[11px] text-slate-600">
                      Add or remove items. Changes are saved when you close this window.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(Object.keys(pantryCategories) as PantryCategoryKey[]).map((key) => {
                        const items = pantryCategories[key];
                        const selected = pantrySelection[key] ?? [];
                        const allSelected = selected.length === items.length;
                        return (
                          <div
                            key={key}
                            className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                                {categoryTitles[key]}
                              </span>
                              <button
                                type="button"
                                onClick={() => selectAllCategory(key)}
                                className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 cursor-pointer"
                              >
                                {allSelected ? "Clear" : "Select all"}
                              </button>
                            </div>
                            <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
                              {items.map((item) => {
                                const isSelected = selected.includes(item);
                                return (
                                  <button
                                    key={item}
                                    type="button"
                                    onClick={() => togglePantryItem(key, item)}
                                    className={[
                                      "cursor-pointer rounded-full px-2.5 py-1 text-[11px] transition",
                                      isSelected
                                        ? "bg-emerald-200 text-emerald-900"
                                        : "bg-white text-slate-700 hover:bg-emerald-50",
                                    ].join(" ")}
                                  >
                                    {item}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="modal-extra-pantry"
                        className="block text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600"
                      >
                        Other pantry items (comma separated)
                      </label>
                      <input
                        id="modal-extra-pantry"
                        type="text"
                        value={extraPantryItems}
                        onChange={(e) => setExtraPantryItems(e.target.value)}
                        placeholder="e.g. olive oil, basmati rice"
                        className="block w-full rounded-2xl border border-emerald-100 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-emerald-100/60 focus:border-emerald-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
                      />
                    </div>
                  </div>
                  <div className="border-t border-emerald-100 px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setPantryModalOpen(false)}
                      className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-emerald-300 via-lime-200 to-emerald-400 px-4 py-2.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-200/70 transition hover:from-emerald-200 hover:via-lime-100 hover:to-emerald-400"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
