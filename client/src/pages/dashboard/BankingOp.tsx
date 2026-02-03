import { useState } from "react";
import { ArrowUpRight, Wallet, TrendingUp, ShieldCheck } from "lucide-react";

export default function BankingOp() {
  const [borrower, setBorrower] = useState("");
  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const approveLoan = async () => {
    if (!borrower || !interest) {
      setMessage("⚠️ Fill all fields");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("http://localhost:5000/api/loan/approve-loan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrower, interest }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage("✅ Loan approved successfully");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white px-6 py-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="ETH Earnings"
          value="$11,600"
          sub="+6.7% (30d)"
          icon={<TrendingUp />}
        />
        <StatCard
          title="USDC Yield"
          value="8.3%"
          sub="Stable returns"
          icon={<Wallet />}
        />
        <StatCard
          title="Total Value"
          value="$16,900"
          sub="+0.52 ETH"
          icon={<ArrowUpRight />}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Utilization */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Utilization</h2>

          <div className="h-40 flex items-end gap-1">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="w-full bg-gradient-to-t from-emerald-500/40 to-emerald-500 rounded-sm"
                style={{ height: `${40 + Math.random() * 60}%` }}
              />
            ))}
          </div>

          <p className="text-white/50 text-xs mt-3">
            ETH Pool utilization ~82%
          </p>
        </div>

        {/* Risk / Stats */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-medium">Quick Stats</h2>

          <StatRow label="AI Lending Score" value="830 / 900" />
          <StatRow label="Risk Exposure" value="Low" />
          <StatRow label="Liquidity Buffer" value="2.4x Safe" />

          <button className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
            View Analytics
          </button>
        </div>

        {/* Active Loan */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Active Lends</h2>

          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70">5.4 ETH Supplied</span>
            <span className="text-emerald-400">$17,100</span>
          </div>

          {/* Utilization */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[70%] bg-emerald-500" />
          </div>

          <div className="mt-3 flex justify-between text-xs text-white/50">
            <span>Utilization</span>
            <span>70%</span>
          </div>

          {/* Earnings */}
          <div className="mt-4 flex justify-between text-sm">
            <div>
              <p className="text-white/50 text-xs">APY</p>
              <p className="text-white font-medium">5.9%</p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-xs">Earnings (30d)</p>
              <p className="text-emerald-400 font-medium">+0.32 ETH</p>
            </div>
          </div>
        </div>

        {/* Approve Loan */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Approve Loan</h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Borrower Address"
              value={borrower}
              onChange={(e) => setBorrower(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 focus:border-white/30 outline-none"
            />

            <input
              type="number"
              placeholder="Interest (ETH)"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 focus:border-white/30 outline-none"
            />

            <button
              onClick={approveLoan}
              disabled={loading}
              className="w-full py-3 rounded-lg bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Approve Loan"}
            </button>

            {message && (
              <p className="text-sm text-center text-white/70">{message}</p>
            )}
          </div>
        </div>

        {/* Eligibility */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Lend Assets</h2>

          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="text-emerald-400" />
            <span className="text-white/80">ETH Pool • APY 5.9%</span>
          </div>

          {/* Pool Utilization */}
          <div className="mb-2 flex justify-between text-xs text-white/50">
            <span>Pool Utilization</span>
            <span>70%</span>
          </div>

          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[70%] bg-emerald-500" />
          </div>

          {/* Stats */}
          <div className="mt-4 flex justify-between text-sm">
            <div>
              <p className="text-white/50 text-xs">Deposited</p>
              <p className="text-white font-medium">5.4 ETH</p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-xs">Risk</p>
              <p className="text-emerald-400 font-medium">Low</p>
            </div>
          </div>

          <button className="mt-5 w-full py-2.5 rounded-lg bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition">
            Deposit / Lend
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function StatCard({
  title,
  value,
  sub,
  icon,
}: {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4">
      <div className="p-3 rounded-lg bg-white/10">{icon}</div>
      <div>
        <p className="text-white/60 text-sm">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
        <p className="text-emerald-400 text-xs">{sub}</p>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/60">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}
