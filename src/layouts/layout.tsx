import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import { authClient } from "../lib/auth-client";

export default function Layout() {
  const { data, error, isPending } = authClient.useSession();
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col text-slate-900 text-[16px] sm:text-[17px] leading-relaxed overflow-x-hidden">
      <header className="sticky top-0 z-20 border-b border-emerald-200 bg-emerald-50/90 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-300 via-lime-200 to-emerald-400 text-[11px] font-bold text-emerald-600 shadow-md shadow-emerald-300/50">
              ZA
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Zaiqa AI
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-6 text-sm sm:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                [
                  "relative pb-0.5 text-xs font-medium uppercase tracking-[0.22em] transition-colors",
                  isActive
                    ? "text-emerald-600"
                    : "text-slate-500 hover:text-slate-900",
                ].join(" ")
              }
            >
              Home
            </NavLink>

            {data ? (
              <div className="flex items-center gap-3">
                <NavLink
                  to="/app/my-plans"
                  className={({ isActive }) =>
                    [
                      "relative pb-0.5 text-xs font-medium uppercase tracking-[0.22em] transition-colors",
                      isActive
                        ? "text-emerald-600"
                        : "text-slate-500 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  My Plans
                </NavLink>

                <NavLink
                  to="/app/create-plan"
                  className={({ isActive }) =>
                    [
                      "relative pb-0.5 text-xs font-medium uppercase tracking-[0.22em] transition-colors",
                      isActive
                        ? "text-emerald-600"
                        : "text-slate-500 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  Create Plan
                </NavLink>

                <button
                  onClick={async () => {
                    await authClient.signOut();
                    queryClient.clear();
                    navigate("/");
                  }}
                  className="relative inline-flex items-center gap-1 rounded-full border border-emerald-500/50 bg-emerald-100 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-800 shadow-sm shadow-emerald-300/40 transition hover:border-emerald-500 hover:bg-emerald-200 hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  [
                    "relative pb-0.5 text-xs font-medium uppercase tracking-[0.22em] transition-colors",
                    isActive
                      ? "text-orange-300"
                      : "text-slate-400 hover:text-emerald-600",
                  ].join(" ")
                }
              >
                Login
              </NavLink>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 text-emerald-700 hover:border-emerald-400 hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 sm:hidden"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>

        {/* Mobile slide-down menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-emerald-100 bg-emerald-50/95 py-3 sm:hidden">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 pb-1">
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  [
                    "block rounded-xl px-2 py-1.5 text-xs font-medium uppercase tracking-[0.22em]",
                    isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700",
                  ].join(" ")
                }
              >
                Home
              </NavLink>

              {data ? (
                <>
                  <NavLink
                    to="/app/my-plans"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      [
                        "block rounded-xl px-2 py-1.5 text-xs font-medium uppercase tracking-[0.22em]",
                        isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700",
                      ].join(" ")
                    }
                  >
                    My Plans
                  </NavLink>

                  <NavLink
                    to="/app/create-plan"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      [
                        "block rounded-xl px-2 py-1.5 text-xs font-medium uppercase tracking-[0.22em]",
                        isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700",
                      ].join(" ")
                    }
                  >
                    Create Plan
                  </NavLink>

                  <button
                    type="button"
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await authClient.signOut();
                      queryClient.clear();
                      navigate("/");
                    }}
                    className="mt-1 inline-flex items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-100 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-800 shadow-sm shadow-emerald-300/40 hover:bg-emerald-200 hover:text-emerald-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      "block rounded-xl px-2 py-1.5 text-xs font-medium uppercase tracking-[0.22em]",
                      isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700",
                    ].join(" ")
                  }
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {isPending ? (
          <div className="flex h-full items-center justify-center mt-10 text-slate-700">
            <span className="text-sm text-slate-500">
              Loading your kitchen…
            </span>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center mt-10 text-red-500">
            <p className="text-sm">Something went wrong: {error.message}</p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      <footer className="border-t border-emerald-100 bg-emerald-50/95">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-300 via-lime-200 to-emerald-400 text-[11px] font-bold text-emerald-700 shadow-md shadow-emerald-300/50">
              ZA
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Zaiqa AI
              </p>
              <p className="text-[11px] text-slate-500">
                Dish-by-dish plans from your own smart chef.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.35)]" />
              Freshly cooked with the help of AI.
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400 shadow-[0_0_0_3px_rgba(190,242,100,0.35)]" />
              Spice-aware, pantry-aware, health-aware.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
