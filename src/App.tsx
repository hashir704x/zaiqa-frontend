import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/sign-up";
import Layout from "./layouts/layout";
import CreatePlan from "./pages/create-plan";
import MyPlans from "./pages/my-plans";
import ProtectedLayout from "./layouts/protected-layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PlanDetails from "./pages/plan-details";
import { Toaster } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "app",
        element: <ProtectedLayout />,
        children: [
          {
            path: "my-plans",
            element: <MyPlans />,
          },
          {
            path: "create-plan",
            element: <CreatePlan />,
          },
          {
            path: "plan-details/:id",
            element: <PlanDetails />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right"
        toastOptions={{
          unstyled: false,
          classNames: {
            toast:
              "group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white/95 px-4 py-3 text-base text-slate-900 shadow-lg shadow-emerald-100/80 backdrop-blur flex items-start gap-3",
            title: "font-semibold text-slate-900",
            description: "mt-0.5 text-sm text-slate-600",
            actionButton:
              "rounded-full bg-gradient-to-r from-emerald-300 via-lime-200 to-emerald-400 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-900 shadow shadow-emerald-200/70",
            cancelButton:
              "rounded-full border border-emerald-100 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-600",
            icon:
              "mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 via-lime-200 to-emerald-400 text-[11px] font-semibold text-emerald-900 shadow shadow-emerald-200/70",
            closeButton:
              "absolute right-2 top-2 text-xs text-slate-400 hover:text-slate-700",
          },
        }}
      />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
