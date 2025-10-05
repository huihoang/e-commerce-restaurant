// ==================== All Import
import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Homepage from "./component/HomePage/Homepage";
import Contact from "./component/HomePage/Contact";
import Auth from "./component/HomePage/Auth";
import Book from "./component/HomePage/Book";
import Blog from "./component/HomePage/Blog";
import Manu from "./component/HomePage/Manu";
import About from "./component/HomePage/About";
import LayoutOne from "./Layout/LayoutOne";
import AdminDashboard from "./component/Admin/AdminDashboard";
import UserDashboard from "./component/User/UserDashboard";
import BlogDetails from "./component/HomePage/BlogDetails"; // trang chi tiết

// ==================== All Routes
const getRouter = (setIsLoggedIn, setRole) =>
  createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<LayoutOne />}>
        <Route index element={<Homepage />} />
        <Route path="/manu" element={<Manu />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/login"
          element={<Auth setIsLoggedIn={setIsLoggedIn} setRole={setRole} />}
        />
        <Route path="/book" element={<Book />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
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
