// ==================== All Import
import PropTypes from "prop-types";
import { useState, useMemo, useCallback } from "react";
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
import AdminBookingList from "./components/Admin/AdminBookingList";
import AdminContactList from "./components/Admin/AdminContactList";
import UserDashboard from "./components/User/UserDashboard";
import BookUsers from "./components/User/BookUsers";
import BookingHistory from "./components/User/BookingHistory";
import UserProfile from "./components/User/UserProfile";
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

// ==================== All Routes
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
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute
              isAllowed={isLoggedIn && role === "admin"}
              redirectTo="/login"
            >
              <AdminDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<AdminUserManager />} />
          <Route path="menu" element={<AdminMenuManager />} />
          <Route path="blog" element={<AdminBlogList />} />
          <Route path="bookings" element={<AdminBookingList />} />
          <Route path="contacts" element={<AdminContactList />} />
        </Route>

        <Route
          path="/user"
          element={
            <ProtectedRoute
              isAllowed={isLoggedIn && role === "user"}
              redirectTo="/login"
            >
              <UserDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="book" replace />} />
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
    setIsLoggedIn(false);
    setRole("");
  }, [setIsLoggedIn, setRole]);

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
