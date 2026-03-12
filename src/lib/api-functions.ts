export type MealPlanSummary = {
  id: string;
  title: string;
  planType: "instant" | "one_day" | "three_day" | "week";
  cuisine: "desi" | "western" | "arabic" | "pan_asian";
  spiceLevel: "low" | "medium" | "high" | "extra_hot";
  createdAt: string;
};

type GetAllPlansResponse = {
  plans: MealPlanSummary[];
};

const API_URL = import.meta.env.VITE_API_URL;

export type CreateMealPlanPayload = {
  title: string;
  cuisine: MealPlanSummary["cuisine"];
  spiceLevel: MealPlanSummary["spiceLevel"];
  planType: MealPlanSummary["planType"];
  medicalConditions?: string[];
  pantryItemsSnapshot?: string[];
};

// Types for a single plan with all days and entries
export type MealPlanDetails = {
  plan: {
    id: string;
    userId: string;
    title: string;
    cuisine: MealPlanSummary["cuisine"];
    spiceLevel: MealPlanSummary["spiceLevel"];
    planType: MealPlanSummary["planType"];
    medicalConditions: string[] | null;
    pantryItemsSnapshot: string[] | null;
    createdAt: string;
    updatedAt: string;
  };
  days: {
    id: string;
    planId: string;
    date: string | null;
    dayIndex: number;
    summary: string | null;
    createdAt: string;
    updatedAt: string;
    entries: {
      id: string;
      planDayId: string;
      mealSlot: "breakfast" | "lunch" | "dinner";
      position: number;
      title: string;
      description: string | null;
      searchKeyword: string;
      imageUrl: string | null;
      cookingTime: string | null;
      difficulty: "easy" | "medium" | "hard";
      instructions: string[] | null;
      ingredients:
        | {
            name: string;
            quantity?: string;
            unit?: string;
          }[]
        | null;
      servings: number | null;
      calories: number | null;
      protein: number | null;
      carbs: number | null;
      fat: number | null;
      weight: string | null;
      createdAt: string;
      updatedAt: string;
    }[];
  }[];
};

// Step 1: Call the backend
// Step 2: Check for errors
// Step 3: Parse JSON and return plans array
export async function getAllPlans(): Promise<MealPlanSummary[]> {
  // Step 1: Make the request
  const response = await fetch(`${API_URL}/api/meal-plans`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  // Step 2: Handle non-OK responses
  if (!response.ok) {
    throw new Error(`Failed to load meal plans (status ${response.status})`);
  }

  // Step 3: Read and return the data
  const data: GetAllPlansResponse = await response.json();
  return data.plans;
}

export async function createPlan(payload: CreateMealPlanPayload) {
  const response = await fetch(`${API_URL}/api/meal-plans`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create meal plan (status ${response.status})`);
  }

  // We don't need strong typing for the full plan shape here yet,
  // so return whatever the backend sends.
  return response.json();
}

export async function getPlanDetailsById(id: string): Promise<MealPlanDetails> {
  const response = await fetch(`${API_URL}/api/meal-plans/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Plan not found.");
    }
    throw new Error(`Failed to load meal plan (status ${response.status})`);
  }

  const data: MealPlanDetails = await response.json();
  return data;
}

export async function deletePlan(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/meal-plans/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Plan not found.");
    }
    const body = await response.json().catch(() => ({}));
    const message =
      (body as { message?: string })?.message ??
      `Failed to delete meal plan (status ${response.status})`;
    throw new Error(message);
  }
}

export type MealPlanEntry = MealPlanDetails["days"][number]["entries"][number];

export type ReplaceMealEntryResponse = {
  entry: MealPlanEntry;
};

export async function replaceMealEntry(
  planId: string,
  entryId: string,
): Promise<ReplaceMealEntryResponse> {
  const response = await fetch(
    `${API_URL}/api/meal-plans/${planId}/entries/${entryId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Plan or entry not found.");
    }
    const body = await response.json().catch(() => ({}));
    const message =
      (body as { message?: string })?.message ??
      `Failed to replace meal (status ${response.status})`;
    throw new Error(message);
  }

  const data: ReplaceMealEntryResponse = await response.json();
  return data;
}
