import { useQuery } from "@tanstack/react-query";
import { getAllPlans } from "../lib/api-functions";

type SessionData = {
  isAuthenticated: boolean;
};

export function useSession() {
  return useQuery<SessionData, Error>({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        // We only care if the request succeeds (authenticated) or fails with 401.
        await getAllPlans();
        return { isAuthenticated: true };
      } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
          return { isAuthenticated: false };
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

