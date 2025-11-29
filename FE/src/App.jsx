// ==================== All Import
import PropTypes from "prop-types";
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Homepage from "./components/HomePage/Homepage";
import Contact from "./components/HomePage/Contact";
import Auth from "./components/HomePage/Auth";
import Book from "./components/HomePage/Book";
import Blog from "./components/HomePage/Blog";
import Menu from "./components/HomePage/Menu";
import About from "./components/HomePage/About";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminUserManager from "./components/Admin/AdminUserManager";
import AdminMenuManager from "./components/Admin/AdminMenuManager";
import AdminBlogList from "./components/Admin/AdminBlogList";
import AdminCategoryManager from "./components/Admin/AdminCategoryManager";
import AdminDiscountManager from "./components/Admin/AdminDiscountManager";
import AdminTableManager from "./components/Admin/AdminTableManager";
import AdminBookingList from "./components/Admin/AdminBookingList";
import AdminContactList from "./components/Admin/AdminContactList";
import BookUsers from "./components/User/BookUsers";
import BookingHistory from "./components/User/BookingHistory";
import UserProfile from "./components/User/UserProfile";
import UserSettings from "./components/User/UserSettings";
import BlogDetails from "./components/HomePage/BlogDetails"; // trang chi tiết
import Cart from "./components/HomePage/Cart";
import LayoutOne from "./layouts/LayoutOne";
import { NotificationProvider } from "./contexts/NotificationContext";

// ==================== Setup Axios Interceptor
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Request interceptor - Thêm token vào header tự động
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    // Chỉ thêm token cho request đến API của chúng ta
    if (token) {
      const url = config.url || "";
      // Nếu là full URL và bắt đầu bằng API_BASE_URL, hoặc là relative path
      if (url.startsWith(API_BASE_URL) || url.startsWith("/api/")) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý token hết hạn
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Nếu token hết hạn hoặc không hợp lệ (401, 403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      const requestUrl = error.config?.url || "";
      if (requestUrl.includes(API_BASE_URL) || requestUrl.startsWith("/api/")) {
        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("selectedMenu");
        localStorage.removeItem("admin-section");

        // Redirect về trang login nếu chưa ở đó
        if (globalThis.location.pathname !== "/login") {
          globalThis.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// ==================== Protected Route
const ProtectedRoute = (props) => {
  const { isAllowed, redirectTo = "/login", children } = props;
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  isAllowed: PropTypes.bool.isRequired,
  redirectTo: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// ==================== Admin Only Route
const AdminOnlyRoute = ({ children }) => {
  const role = localStorage.getItem("role") || "user";
  if (role !== "admin") {
    return <Navigate to="/admin/book" replace />;
  }
  return children;
};

AdminOnlyRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// ==================== All Routes
const isAdminRole = (role) => role === "admin" || role === "staff";
const isUserRole = (role) => role === "user";

const getRouter = ({
  setIsLoggedIn,
  setRole,
  handleLogout,
  isLoggedIn,
  role,
}) =>
  createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<LayoutOne />}>
          <Route index element={<Homepage />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/login"
            element={
              <Auth
                setIsLoggedIn={setIsLoggedIn}
                setRole={setRole}
                isLoggedIn={isLoggedIn}
                role={role}
              />
            }
          />
          <Route path="/book" element={<Book />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                isAllowed={isLoggedIn && isUserRole(role)}
                redirectTo="/login"
              >
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute
                isAllowed={isLoggedIn && isUserRole(role)}
                redirectTo="/login"
              >
                <BookingHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute
                isAllowed={isLoggedIn && isUserRole(role)}
                redirectTo="/login"
              >
                <UserSettings />
              </ProtectedRoute>
            }
          />
        </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute
                isAllowed={isLoggedIn && isAdminRole(role)}
                redirectTo="/login"
              >
                <AdminDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }
          >
          {/* Admin routes - chỉ admin mới truy cập được */}
          <Route index element={<Navigate to={role === "admin" ? "users" : "book"} replace />} />
          <Route 
            path="users" 
            element={
              <AdminOnlyRoute>
                <AdminUserManager />
              </AdminOnlyRoute>
            } 
          />
          <Route 
            path="menu" 
            element={
              <AdminOnlyRoute>
                <AdminMenuManager />
              </AdminOnlyRoute>
            } 
          />
          <Route 
            path="categories" 
            element={
              <AdminOnlyRoute>
                <AdminCategoryManager />
              </AdminOnlyRoute>
            } 
          />
          <Route 
            path="tables" 
            element={
              <AdminOnlyRoute>
                <AdminTableManager />
              </AdminOnlyRoute>
            } 
          />
          <Route 
            path="discounts" 
            element={
              <AdminOnlyRoute>
                <AdminDiscountManager />
              </AdminOnlyRoute>
            } 
          />
          <Route 
            path="blog" 
            element={
              <AdminOnlyRoute>
                <AdminBlogList />
              </AdminOnlyRoute>
            } 
          />
          <Route 
            path="bookings" 
            element={
              <AdminOnlyRoute>
                <AdminBookingList />
              </AdminOnlyRoute>
            } 
          />
          <Route 
            path="contacts" 
            element={
              <AdminOnlyRoute>
                <AdminContactList />
              </AdminOnlyRoute>
            } 
          />
          {/* Staff routes - cả admin và staff đều truy cập được */}
          <Route path="book" element={<BookUsers />} />
          <Route path="history" element={<BookingHistory />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

      </>
    )
  );

const App = () => {
  // Initialize state from localStorage immediately to avoid router recreation
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    return !!(token && storedRole);
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || "";
  });

  // ==================== Handle Logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setRole("");
  }, [setIsLoggedIn, setRole]);

  // Sync auth state when other parts of the app change localStorage
  useEffect(() => {
    const syncFromStorage = () => {
      const token = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role") || "";
      setIsLoggedIn(Boolean(token && storedRole));
      setRole(storedRole);
    };

    const handleAuthChange = () => syncFromStorage();

    globalThis.addEventListener("auth-change", handleAuthChange);
    globalThis.addEventListener("storage", handleAuthChange);

    return () => {
      globalThis.removeEventListener("auth-change", handleAuthChange);
      globalThis.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const router = useMemo(
    () =>
      getRouter({
        setIsLoggedIn,
        setRole,
        handleLogout,
        isLoggedIn,
        role,
      }),
    [handleLogout, isLoggedIn, role, setIsLoggedIn, setRole]
  );

  return (
    <NotificationProvider>
      <RouterProvider router={router} />
    </NotificationProvider>
  );
};

export default App;
