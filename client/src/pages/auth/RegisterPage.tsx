import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, User } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"borrower" | "lender" | "both">("borrower"); // ← ADD HERE
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      alert("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, role }), // ← role ADDED HERE
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Account created! Please sign in.");
      navigate("/auth");
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
          <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
          <p className="text-sm text-white/50">Sign up to get started with your dashboard</p>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm text-white/60">Full Name</label>
          <div className="relative">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 h-11 rounded-lg bg-zinc-900 border border-white/10 outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition pr-10"
            />
            <User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm text-white/60">Email</label>
          <input
            type="email"
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

        {/* Role Selector */}
        <div className="space-y-2">
          <label className="text-sm text-white/60">I want to join as</label>
          <div className="grid grid-cols-3 gap-2">
            {(["borrower", "lender", "both"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)} // ← setRole wired here
                className={`h-10 rounded-lg border text-sm capitalize transition ${
                  role === r
                    ? "border-pink-500/60 bg-pink-500/10 text-pink-300"
                    : "border-white/10 bg-zinc-900 text-white/50 hover:border-white/20"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="group w-full h-11 rounded-full bg-pink-600 hover:bg-pink-700 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
          {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition" />}
        </button>

        <p className="text-center text-sm text-white/40">
          Already have an account?{" "}
          <Link to="/auth" className="text-pink-400 hover:text-pink-300 transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;