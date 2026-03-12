import { authClient } from "../lib/auth-client";
import { toast } from "sonner";
import { Link, Navigate, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Spinner } from "../components/spinner";

export default function Login() {
  const { data, isPending, error } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-emerald-50 text-slate-700">
        <span className="text-sm text-slate-500">Checking your session…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-emerald-50 text-red-500">
        <p className="text-sm">Something went wrong: {error.message}</p>
      </div>
    );
  }

  if (data?.session) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (!email || !password) {
        toast.error("Please fill in all fields");
        return;
      }
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return;
      }
      await authClient.signIn.email(
        { email: email, password: password },
        {
          onRequest: () => {
            setIsLoading(true);
          },
          onSuccess: () => {
            setIsLoading(false);
            toast.success("Logged in successfully");
            navigate("/app/my-plans");
          },
          onError: (ctx) => {
            setIsLoading(false);
            toast.error(ctx.error.message || "Something went wrong during login.");
          },
        },
      );
    } catch (error) {
      toast.error("Something went wrong during login.");
      console.error(error);
    }
  };
  return (
    <div className="relative flex h-screen items-stretch overflow-hidden bg-emerald-50 text-slate-900">
      {/* Background gradient blobs */}
      <motion.div
        className="pointer-events-none absolute -left-32 top-[-10rem] h-80 w-80 rounded-full bg-gradient-to-br from-emerald-300/60 via-emerald-200/40 to-lime-200/40 blur-3xl opacity-70"
        animate={{ y: [0, 24, 0], x: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-[-6rem] right-[-4rem] h-72 w-72 rounded-full bg-gradient-to-tr from-lime-200/70 via-emerald-100/40 to-emerald-50/40 blur-3xl opacity-80"
        animate={{ y: [0, -20, 0], x: [0, -16, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col gap-8 overflow-y-auto px-4 py-6 md:flex-row md:items-center md:py-10 lg:px-8">
        {/* Hero section */}
        <div className="flex-1">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-100 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-800 shadow-sm shadow-emerald-300/40 backdrop-blur"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.35)]" />
            Smart AI-powered meal planning
          </motion.div>

          <motion.h1
            className="mt-6 text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            Welcome back to{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-600 bg-clip-text text-transparent">
              Zaiqa AI
            </span>
            .
          </motion.h1>

          <motion.p
            className="mt-4 max-w-xl text-lg text-slate-700 sm:text-xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            Log in to continue crafting personalized, desi-inspired meal plans
            that respect your taste, health goals, and pantry — all powered by
            Gemini.
          </motion.p>

          <motion.ul
            className="mt-6 grid gap-3 text-base text-slate-800 sm:grid-cols-2"
            initial="hidden"
            animate="visible"
          >
            {[
              "AI-crafted plans tuned to your cuisine & spice level.",
              "Smart pantry awareness so nothing goes to waste.",
              "Day-wise meal breakdown with calories & macros.",
              "Save and revisit your favorite meal plans anytime.",
            ].map((item, index) => (
                <motion.li
                key={item}
                className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-white p-3 shadow-sm shadow-emerald-100/70 backdrop-blur-sm"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.35 + index * 0.06 }}
                >
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-lime-300 text-[10px] font-semibold text-emerald-950 shadow-sm">
                  ✓
                </span>
                <span>{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Form section */}
        <motion.div
          className="relative w-full max-w-md flex-1"
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          whileHover={{ y: -4 }}
          >
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-emerald-200/40 via-emerald-100/40 to-emerald-200/70 opacity-90 blur-xl" />
          <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-100/80 backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-300 via-lime-200 to-emerald-400 text-xs font-bold text-emerald-700 shadow-md shadow-emerald-200/60">
                  ZA
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                    Zaiqa AI
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Your smart meal planner
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                Log in to your kitchen
              </h2>
              <p className="text-xs text-slate-600 sm:text-sm">
                Continue where you left off and let Zaiqa AI handle what&apos;s
                for dinner.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
              action="about:blank"
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-600"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="block w-full rounded-2xl border border-emerald-100 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-emerald-100/80 outline-none ring-0 transition focus:border-emerald-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-600"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="block w-full rounded-2xl border border-emerald-100 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-emerald-100/80 outline-none ring-0 transition focus:border-emerald-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
                />
              </div>

              <motion.button
                type="submit"
                whileTap={isLoading ? undefined : { scale: 0.97 }}
                disabled={isLoading}
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-300 via-lime-200 to-emerald-400 px-5 py-3 text-base font-semibold text-emerald-950 shadow-lg shadow-emerald-200/70 ring-0 transition hover:from-emerald-200 hover:via-lime-100 hover:to-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200/80 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
              >
                <span className="absolute inset-0 translate-y-[120%] bg-gradient-to-r from-white/10 via-white/40 to-white/10 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100" />
                <span className="relative flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <Spinner size={18} className="mr-1.5 text-emerald-900" />
                      <span>Loging in…</span>
                    </>
                  ) : (
                    <>
                      <span>Login</span>
                      <span className="text-[11px] text-emerald-900/80">→</span>
                    </>
                  )}
                </span>
              </motion.button>
              <p className="text-center text-[11px] text-slate-600 sm:text-xs">
                Don&apos;t have an account yet?{" "}
                <Link
                  to="/sign-up"
                  className="font-medium text-emerald-600 underline-offset-4 hover:text-emerald-700 hover:underline"
                >
                  Create one in seconds
                </Link>
                .
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
