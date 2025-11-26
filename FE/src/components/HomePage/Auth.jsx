// ==================== All Import
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/contexts/NotificationContext";

const isAdminRole = (role) => role === "admin" || role === "staff";
const getHomePathByRole = (role) => (isAdminRole(role) ? "/admin" : "/user");

const Auth = ({ setIsLoggedIn, setRole, isLoggedIn, role }) => {
  const { showSuccess, showError } = useNotification();
  // ==================== All Hooks
  const [form, setForm] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && role) {
      navigate(getHomePathByRole(role), { replace: true });
    }
  }, [isLoggedIn, role, navigate]);

  // ==================== All Functions
  // -------- handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      setIsLoggedIn(true);
      setRole(data.role);
      setForm("logout");
      showSuccess("Đăng nhập thành công!");
      navigate(getHomePathByRole(data.role), { replace: true });
    } else {
      showError(data.message || "Đăng nhập thất bại!");
    }
  };

  // -------- handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }), // mặc định role là "user"
    });
    const data = await res.json();
    if (res.ok) {
      showSuccess("Tạo tài khoản thành công! Vui lòng đăng nhập.");
      setForm("login");
    } else {
      showError(data.message || "Tạo tài khoản thất bại!");
    }
  };

  // -------- handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole("");
    setForm("login");
  };

  return (
    <div className="bg-white max-w-7xl mx-auto shadow-sm">
      <section className="flex justify-center items-start pt-20 pb-16 min-h-[calc(100vh-200px)]">
        <div className="w-[400px] bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          {/* ============== Login Form ============== */}
          {form === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Đăng nhập
              </h2>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Tên đăng nhập"
                required
                className="h-[50px] border rounded-full px-4 outline-none"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Mật khẩu"
                required
                className="h-[50px] border rounded-full px-4 outline-none"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-full font-bold hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Đăng nhập
              </button>
              <p className="text-center text-sm">
                Chưa có tài khoản?{" "}
                <span
                  onClick={() => setForm("signup")}
                  className="text-blue-600 cursor-pointer hover:text-blue-700 font-semibold transition-colors duration-300"
                >
                  Đăng ký
                </span>
              </p>
            </form>
          )}

          {/* ============== Signup Form ============== */}
          {form === "signup" && (
            <form onSubmit={handleSignup} className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Tạo tài khoản
              </h2>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Tên đăng nhập"
                required
                className="h-[50px] border rounded-full px-4 outline-none"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                required
                className="h-[50px] border rounded-full px-4 outline-none"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Mật khẩu"
                required
                className="h-[50px] border rounded-full px-4 outline-none"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-full font-bold hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Đăng ký
              </button>
              <p className="text-center text-sm">
                Đã có tài khoản?{" "}
                <span
                  onClick={() => setForm("login")}
                  className="text-blue-600 cursor-pointer hover:text-blue-700 font-semibold transition-colors duration-300"
                >
                  Đăng nhập
                </span>
              </p>
            </form>
          )}

          {/* ============== Logout View ============== */}
          {form === "logout" && (
            <div className="flex flex-col gap-6 items-center">
              <h2 className="text-2xl font-bold text-[#2C2F24]">
                Chào mừng bạn!
              </h2>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-2 rounded-full hover:from-slate-800 hover:to-slate-900 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Auth;
