import {  Navigate, Outlet } from "react-router";
import { authClient } from "../lib/auth-client";

export default function ProtectedLayout() {
  const { data, isPending, error } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <span className="text-sm text-slate-400">Loading your kitchen…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-red-400">
        <p className="text-sm">Something went wrong: {error.message}</p>
      </div>
    );
  }

  if (!data?.session) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
}
