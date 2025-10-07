// ==================== All Import
import React, { useState } from "react";

const Auth = ({ setIsLoggedIn, setRole }) => {
  // ==================== All Hooks
  const [form, setForm] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
    } else {
      alert(data.message);
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
      alert("Tạo tài khoản thành công! Vui lòng đăng nhập.");
      setForm("login");
    } else {
      alert(data.message);
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
    <>
      <section className="flex justify-center items-start pt-20 min-h-screen bg-white">
        <div className="w-[400px] bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          {/* ============== Login Form ============== */}
          {form === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold text-center text-[#AD343E]">
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
                className="bg-[#AD343E] text-white py-3 rounded-full font-bold hover:bg-red-500 active:scale-95 duration-200"
              >
                Đăng nhập
              </button>
              <p className="text-center text-sm">
                Chưa có tài khoản?{" "}
                <span
                  onClick={() => setForm("signup")}
                  className="text-[#AD343E] cursor-pointer hover:underline"
                >
                  Đăng ký
                </span>
              </p>
            </form>
          )}

          {/* ============== Signup Form ============== */}
          {form === "signup" && (
            <form onSubmit={handleSignup} className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold text-center text-[#AD343E]">
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
                className="bg-[#AD343E] text-white py-3 rounded-full font-bold hover:bg-red-500 active:scale-95 duration-200"
              >
                Đăng ký
              </button>
              <p className="text-center text-sm">
                Đã có tài khoản?{" "}
                <span
                  onClick={() => setForm("login")}
                  className="text-[#AD343E] cursor-pointer hover:underline"
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
                className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-600 active:scale-95 duration-200"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Auth;
