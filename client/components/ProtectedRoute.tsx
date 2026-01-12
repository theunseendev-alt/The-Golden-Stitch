import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (requireAuth) {
      const user = localStorage.getItem("user");
      if (!user) {
        navigate(redirectTo);
        return;
      }

      const userData = JSON.parse(user);
      // If user is logged in but hasn't selected a role, redirect to choose-role
      if (!userData.role && !userData.selected) {
        navigate("/choose-role");
        return;
      }
    }
  }, [navigate, requireAuth, redirectTo]);

  return <>{children}</>;
}
