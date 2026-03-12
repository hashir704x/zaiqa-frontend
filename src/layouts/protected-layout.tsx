import { Navigate, Outlet } from "react-router";
import { useSession } from "../hooks/use-session";

export default function ProtectedLayout() {
  const { data: session, isPending, error } = useSession();

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

  if (!session?.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}
