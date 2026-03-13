import { Navigate, Outlet } from "react-router";
import { authClient } from "../lib/auth-client";

export default function ProtectedLayout() {
  const { data, isPending, error } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-slate-700">
        <span className="text-sm text-slate-500">Loading your kitchen…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-red-500">
        <p className="text-sm">Something went wrong: {error.message}</p>
      </div>
    );
  }

  if (!data) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}
