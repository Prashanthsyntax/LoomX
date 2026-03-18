import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const AuthPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert("Please enter email and password");
        return;
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        setLoading(false);
        return;
      }

      login(data.user, data.token);
      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.15),_transparent_60%)]" />

      <div className="relative w-full max-w-md p-8 rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-[0_0_60px_rgba(236,72,153,0.15)] space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-white/50">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm text-white/60">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 h-11 rounded-lg bg-zinc-900 border border-white/10 outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm text-white/60">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 h-11 rounded-lg bg-zinc-900 border border-white/10 outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="group w-full h-11 rounded-full bg-pink-600 hover:bg-pink-700 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Continue"}
          {!loading && (
            <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
          )}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;