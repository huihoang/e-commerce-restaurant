// ==================== All Import
import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Homepage from "./components/HomePage/Homepage";
import Contact from "./components/HomePage/Contact";
import Auth from "./components/HomePage/Auth";
import Book from "./components/HomePage/Book";
import Blog from "./components/HomePage/Blog";
import Menu from "./components/HomePage/Menu";
import About from "./components/HomePage/About";
import AdminDashboard from "./components/Admin/AdminDashboard";
import UserDashboard from "./components/User/UserDashboard";
import BlogDetails from "./components/HomePage/BlogDetails"; // trang chi tiết
import Cart from "./components/HomePage/Cart";
import LayoutOne from "./layouts/LayoutOne";

// ==================== All Routes
const getRouter = (setIsLoggedIn, setRole) =>
  createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<LayoutOne />}>
        <Route index element={<Homepage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/login"
          element={<Auth setIsLoggedIn={setIsLoggedIn} setRole={setRole} />}
        />
        <Route path="/book" element={<Book />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/cart" element={<Cart />} />
      </Route>
    )
  );

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (token && storedRole) {
      setIsLoggedIn(true);
      setRole(storedRole);
    }
  }, []);

  // ==================== Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole("");
  };

  if (isLoggedIn && role === "admin") {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (isLoggedIn && role === "user") {
    return <UserDashboard onLogout={handleLogout} />;
  }

  return (
    <>
      <RouterProvider router={getRouter(setIsLoggedIn, setRole)} />
    </>
  );
};

export default App;
