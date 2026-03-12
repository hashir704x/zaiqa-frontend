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

async function fetchJson<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers ?? {}),
    },
  });

  let body: any = null;
  const contentType = response.headers.get("Content-Type") ?? "";
  if (contentType.includes("application/json")) {
    body = await response.json().catch(() => null);
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    if (response.status === 404) {
      const message =
        body?.message ?? body?.error ?? "Resource not found.";
      throw new Error(message);
    }

    const message =
      body?.message ??
      body?.error ??
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return body as T;
}

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

export async function getAllPlans(): Promise<MealPlanSummary[]> {
  const data = await fetchJson<GetAllPlansResponse>("/api/meal-plans", {
    method: "GET",
  });
  return data.plans;
}

export async function createPlan(payload: CreateMealPlanPayload) {
  return fetchJson("/api/meal-plans", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function getPlanDetailsById(id: string): Promise<MealPlanDetails> {
  return fetchJson<MealPlanDetails>(`/api/meal-plans/${id}`, {
    method: "GET",
  });
}

export async function deletePlan(id: string): Promise<void> {
  await fetchJson<void>(`/api/meal-plans/${id}`, {
    method: "DELETE",
  });
}

export type MealPlanEntry = MealPlanDetails["days"][number]["entries"][number];

export type ReplaceMealEntryResponse = {
  entry: MealPlanEntry;
};

export async function replaceMealEntry(
  planId: string,
  entryId: string,
): Promise<ReplaceMealEntryResponse> {
  return fetchJson<ReplaceMealEntryResponse>(
    `/api/meal-plans/${planId}/entries/${entryId}`,
    {
      method: "PATCH",
    },
  );
}
