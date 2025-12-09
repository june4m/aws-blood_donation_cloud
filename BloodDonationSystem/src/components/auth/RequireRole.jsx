import React, { useEffect, useState, useCallback } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useApi from "../../hooks/useApi";

/**
 * Refactored ProtectedRoute
 * - Avoids firing protected API calls when token is missing (prevents immediate 401 races)
 * - Clears client-side auth first, then optionally notifies server (fire-and-forget)
 * - Does NOT use window.location.href or timeouts for navigation
 * - Throws and handles 401 at caller level (getCurrentUser should surface 401 via thrown error)
 */

const ProtectedRoute = ({
  allowedRoles = null,
  requireAuth = false,
  restricted = false,
}) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { getCurrentUser, logout } = useApi();

  // Clear client-side auth data and log stack for debugging
  const clearClientAuth = useCallback(() => {
    console.warn(
      "clearClientAuth called. Clearing localStorage. Stack:\n",
      new Error().stack
    );
    try {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    } catch (err) {
      console.error("Error clearing localStorage:", err);
    }
  }, []);

  // Centralized logout + redirect handler
  const handleLogoutAndRedirect = useCallback(
    async (message) => {
      // Clear client immediately
      clearClientAuth();

      // Show user-friendly message
      if (message) {
        toast.error(message, { position: "top-center", autoClose: 3000 });
      }

      // Try to notify server but don't block UX (fire-and-forget)
      try {
        // Don't await to avoid race or further 401 triggering
        logout?.().catch((err) =>
          console.debug("Server logout failed (ignored):", err)
        );
      } catch (err) {
        // ignore
        console.debug("logout invocation failed:", err);
      }

      // Use react-router navigation (no reload)
      navigate("/login", { replace: true });
    },
    [clearClientAuth, logout, navigate]
  );

  // Small reusable popup for routes that require login
  const showLoginPopup = useCallback(async () => {
    const result = await Swal.fire({
      title: "Lưu ý",
      text: "Vui lòng đăng nhập để sử dụng chức năng này.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      navigate("/login", { state: { from: location }, replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      setIsLoading(true);

      try {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const token = localStorage.getItem("accessToken");

        // Public route (no auth required, not restricted)
        if (!requireAuth && !restricted) {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        // If route requires auth but user isn't flagged as logged in -> prompt login
        if (requireAuth && !isLoggedIn) {
          setIsAuthorized(true); // allow rendering so page can show prompt
          setShowLoginPrompt(true);
          setIsLoading(false);
          return;
        }

        // Inconsistent state: marked logged in but token missing -> force logout
        if (isLoggedIn && !token) {
          await handleLogoutAndRedirect(
            "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại."
          );
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        // Restricted route (login/register) behavior: if logged in + token => fetch user to redirect
        if (!requireAuth && restricted) {
          if (isLoggedIn && token) {
            try {
              const res = await getCurrentUser();
              if (!cancelled) setUser(res.data);
              // We set isAuthorized to false so later code returns a <Navigate /> based on role
              setIsAuthorized(false);
            } catch (err) {
              // If fetching user fails (401 etc.) we'll allow rendering (so user can still see login/register)
              console.debug("getCurrentUser failed on restricted route:", err);
              setIsAuthorized(true);
            }
          } else {
            setIsAuthorized(true);
          }
          setIsLoading(false);
          return;
        }

        // From here, we must have token (or we would have returned above)
        let userInfo = null;
        try {
          const res = await getCurrentUser();
          userInfo = res.data;
          if (!cancelled) setUser(userInfo);
        } catch (error) {
          // Treat 401 (or other auth errors) as expired session
          console.debug("getCurrentUser error:", error);
          await handleLogoutAndRedirect("Phiên đăng nhập đã hết hạn");
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        // If allowedRoles is provided, validate
        if (allowedRoles && Array.isArray(allowedRoles)) {
          const userRole = (userInfo?.user_role || "")
            .toString()
            .trim()
            .toLowerCase();
          const normalizedAllowed = allowedRoles.map((r) =>
            r.toString().toLowerCase()
          );
          if (normalizedAllowed.includes(userRole)) {
            setIsAuthorized(true);
          } else {
            await handleLogoutAndRedirect(
              "Bạn không có quyền truy cập trang này. Vui lòng đăng nhập bằng tài khoản có quyền phù hợp."
            );
            setIsAuthorized(false);
          }
        } else {
          setIsAuthorized(true);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error in ProtectedRoute.checkAuth:", err);
        await handleLogoutAndRedirect("Đã xảy ra lỗi xác thực");
        setIsAuthorized(false);
        setIsLoading(false);
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedRoles, requireAuth, restricted, location.pathname]);

  useEffect(() => {
    if (showLoginPrompt) {
      showLoginPopup();
      setShowLoginPrompt(false);
    }
  }, [showLoginPrompt, showLoginPopup]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // If not authorized, handle restricted redirect based on fetched user
  if (!isAuthorized) {
    if (restricted && user) {
      const role = (user.user_role || "").toString().toLowerCase();
      if (role === "admin") return <Navigate to="/admin" replace />;
      if (role === "staff") return <Navigate to="/dashboard" replace />;
      return <Navigate to="/" replace />;
    }
    // Other non-authorized cases are handled inside the hook (logout + navigate)
    return null; // nothing to render because navigation/redirect handled
  }

  return <Outlet />;
};

export default ProtectedRoute;
