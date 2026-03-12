import { toast } from "sonner";
import { Link, Navigate, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Spinner } from "../components/spinner";
import { register } from "../lib/auth-api";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "../hooks/use-session";
export default function SignUp() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { data: session, isPending, error } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-emerald-50 text-slate-700">
        <span className="text-sm text-slate-500">Checking your session…</span>
      </div>
    );
  }

  if (!error && session?.isAuthenticated) {
    return <Navigate to="/app/my-plans" />;
  }


  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    try {
      if (!name || !email || !password || !confirmPassword) {
        toast.error("Please fill in all fields");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return;
      }
      setIsLoading(true);
      await register(name, email, password);
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Account created successfully");
      navigate("/app/my-plans");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong during sign up.";
      toast.error(message);
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

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center gap-6 px-4 py-4 md:flex-row md:items-center md:justify-between md:py-8 lg:px-8">
        {/* Hero section */}
        <div className="flex-1">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-100 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-800 shadow-sm shadow-emerald-300/40 backdrop-blur"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.35)]" />
            Start your AI-guided meal journey
          </motion.div>

          <motion.h1
            className="mt-6 text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            Create your
            <span className="bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-600 bg-clip-text text-transparent">
              {" "}
              Zaiqa AI
            </span>{" "}
            kitchen.
          </motion.h1>

          <motion.p
            className="mt-4 max-w-xl text-lg text-slate-700 sm:text-xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            Tell us a bit about yourself and let Zaiqa AI turn your preferences,
            pantry, and health goals into effortless, delicious meal plans.
          </motion.p>

          <motion.ul
            className="mt-6 grid gap-3 text-base text-slate-800 sm:grid-cols-2"
            initial="hidden"
            animate="visible"
          >
            {[
              "Personalize by cuisine, spice level, and medical conditions.",
              "Generate instant one-day or week-long plans in a click.",
              "Rich recipe details with ingredients, macros and steps.",
              "Save plans to build your own meal history and favorites.",
            ].map((item, index) => (
              <motion.li
                key={item}
                className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-white p-3 shadow-sm shadow-emerald-100/70 backdrop-blur-sm"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.35 + index * 0.06 }}
              >
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-lime-300 text-[10px] font-semibold text-emerald-950 shadow-sm">
                  ✨
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
          <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-100/80 backdrop-blur-xl">
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
                Create your account
              </h2>
              <p className="text-xs text-slate-600 sm:text-sm">
                We&apos;ll use this to save your plans and remember your
                preferences.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-4 space-y-5"
              action="about:blank"
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-600"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="What should we call you?"
                  className="block w-full rounded-2xl border border-emerald-100 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-emerald-100/80 outline-none ring-0 transition focus:border-emerald-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
                />
              </div>

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
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  className="block w-full rounded-2xl border border-emerald-100 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-emerald-100/80 outline-none ring-0 transition focus:border-emerald-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
                />
                <p className="text-[11px] text-slate-500">
                  Use at least 8 characters with a mix of letters and numbers.
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-600"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  className="block w-full rounded-2xl border border-emerald-100 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-emerald-100/80 outline-none ring-0 transition focus:border-emerald-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
                />
              </div>

              {/* Top-level error placeholder */}
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
                      <span>Creating your account…</span>
                    </>
                  ) : (
                    <>
                      <span>Create account</span>
                      <span className="text-[11px] text-emerald-900/80">→</span>
                    </>
                  )}
                </span>
              </motion.button>

              <p className="text-center text-[11px] text-slate-600 sm:text-xs">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-emerald-600 underline-offset-4 hover:text-emerald-700 hover:underline"
                >
                  Log in
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
