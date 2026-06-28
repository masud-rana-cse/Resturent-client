import { useState } from "react";
import { AxiosInstance } from "../../AxiosInstance/AxiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
export default function SignIn() {
  const [tab, setTab] = useState("login");
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [regError, setRegError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const email = e.target.email?.value?.trim() ?? "";
      const password = e.target.password?.value ?? "";
      const res = await AxiosInstance.post("/signIn", {
        email,
        password,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        console.log(res.data)
        if (email.includes("admin")) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
        setLoginError("");
        setRegError("");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        e.target.reset();
      } else {
        setLoginError("something went wrong");
      }
    } catch (error) {
      setLoginError(error.message);
    }
  }
  async function handleRegister(e) {
    e.preventDefault();
    try {
      const name = e.target.name?.value?.trim() ?? "";
      const email = e.target.email?.value?.trim() ?? "";
      const password = e.target.password?.value ?? "";

      const res = await AxiosInstance.post("/signUp", {
        name,
        email,
        password,
      });
      if (res.data.success) {
        setTab("login");
        setLoginError("");
        setRegError("");
        e.target.reset();
      } else {
        setRegError("something went wrong");
      }
    } catch (error) {
      setRegError(error.message);
    }
  }

  const inputClass =
    "w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 transition-colors";

  return (
    <div className="fixed inset-0 bg-linear-to-br from-[#1a0a00] via-[#3d1a00] to-[#1a0a00] flex items-center justify-center z-9999">
      <div className="bg-white rounded-3xl p-10 w-[90%] max-w-105 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
        {/* Logo */}
        <div className="text-center text-3xl font-extrabold text-(--primary-600) mb-6 tracking-wide">
          🍽️ Food Court
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-(--neutral-100)  rounded-xl p-1 mb-6">
          {["login", "register"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-[10px] text-sm font-semibold transition-all duration-300 border-none cursor-pointer capitalize
                ${
                  tab === t
                    ? "bg-(--primary-500) text-white shadow-(--primary-glow)"
                    : "hover:bg-(--primary-500) bg-transparent text-black hover:text-white"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Login form */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-(--neutral-700) mb-1">
                <i className="fas fa-envelope mr-1" /> Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-(--neutral-700) mb-1">
                <i className="fas fa-lock mr-1" /> Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className={inputClass}
              />
            </div>
            {loginError && (
              <p className="text-red-600 text-sm min-h-4">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-linear-to-br from-(--primary-500) to-(--primary-600) text-white py-4 rounded-xl font-bold
                hover:-translate-y-0.5 hover:shadow-(-- primary-glow) transition-all duration-300 flex items-center justify-center gap-2 border-none cursor-pointer mt-1"
            >
              Login <i className="fas fa-arrow-right" />
            </button>
          </form>
        )}

        {/* Register form */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <h2 className="text-xl font-bold text-(--secondary-500)">
              Create Account
            </h2>
            <p className="text-(--neutral-500) text-sm -mt-2">
              Join Food Court today
            </p>
            <div>
              <label className="block text-sm font-medium text-(--neutral-700) mb-1">
                <i className="fas fa-user mr-1" /> Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-(--neutral-700) mb-1">
                <i className="fas fa-envelope mr-1" /> Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-(--neutral-700) mb-1">
                <i className="fas fa-lock mr-1" /> Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Min 6 characters"
                required
                className={inputClass}
              />
            </div>
            {regError && (
              <p className="text--red-600 text-sm min-h-4">{regError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-(--primary-600) hover:bg-(--primary-700) text-white py-4 rounded-xl font-bold
                hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 border-none cursor-pointer mt-1"
            >
              Register <i className="fas fa-arrow-right" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
