import { useState } from "react";
import { ShieldCheck, Wallet, TrendingUp } from "lucide-react";

type AIResult = {
  eligible: boolean;
  score: number;
  risk: string;
  reason?: string;
};

export default function LendingDashboard() {
  const [form, setForm] = useState({
    borrowerAddress: "",
    age: "",
    income: "",
    employmentYears: "",
    loanAmount: "",
    interestRate: "",
    creditHistoryYears: "",
  });

  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const checkEligibility = async () => {
    setLoading(true);
    setMessage("");
    setAiResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/ai/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person_age: Number(form.age),
          person_income: Number(form.income),
          person_emp_length: Number(form.employmentYears),
          loan_amnt: Number(form.loanAmount),
          loan_int_rate: Number(form.interestRate),
          cb_person_cred_hist_length: Number(form.creditHistoryYears),
          borrower: form.borrowerAddress,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAiResult(data);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "AI evaluation failed");
    } finally {
      setLoading(false);
    }
  };

  const approveLoan = async () => {
    if (!aiResult?.eligible) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:4000/api/loan/approve-loan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          borrower: form.borrowerAddress,
          interest: Number(form.interestRate),
          aiScore: aiResult.score,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setMessage(`✅ Loan approved on-chain! Tx: ${data.txHash}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Loan approval failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-8 space-y-8">
      {/* Top Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Stat title="Total Liquidity" value="16.9 ETH" icon={<Wallet />} />
        <Stat title="Average APY" value="5.9%" icon={<TrendingUp />} />
        <Stat title="Platform Risk" value="Low" icon={<ShieldCheck />} />
      </div>

      {/* Loan Application */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Loan Application</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            ["borrowerAddress", "Borrower Address"],
            ["age", "Age"],
            ["income", "Annual Income"],
            ["employmentYears", "Employment (Years)"],
            ["loanAmount", "Loan Amount"],
            ["interestRate", "Interest Rate (%)"],
            ["creditHistoryYears", "Credit History (Years)"],
          ].map(([name, label]) => (
            <input
              key={name}
              name={name}
              placeholder={label}
              value={(form as any)[name]}
              onChange={handleChange}
              className="px-4 py-3 rounded-lg bg-black border border-white/10"
            />
          ))}
        </div>

        <button
          onClick={checkEligibility}
          disabled={loading}
          className="mt-5 px-6 py-3 bg-emerald-500 text-black rounded-lg font-medium"
        >
          {loading ? "Evaluating..." : "Check AI Eligibility"}
        </button>
      </div>

      {/* AI Result */}
      {aiResult && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-3">AI Credit Decision</h2>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <Result label="Credit Score" value={aiResult.score} />
            <Result label="Risk Level" value={aiResult.risk} />
            <Result
              label="Status"
              value={aiResult.eligible ? "Eligible" : "Rejected"}
            />
          </div>

          {!aiResult.eligible && (
            <p className="mt-3 text-red-400 text-sm">
              ❌ {aiResult.reason || "High default risk"}
            </p>
          )}

          {aiResult.eligible && (
            <button
              onClick={approveLoan}
              className="mt-5 px-6 py-3 bg-emerald-500 text-black rounded-lg font-medium"
            >
              Approve Loan
            </button>
          )}
        </div>
      )}

      {message && (
        <p className="text-center text-sm text-white/70">{message}</p>
      )}
    </div>
  );
}

/* ---------- Components ---------- */

function Stat({ title, value, icon }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex gap-4">
      <div className="p-3 bg-white/10 rounded-lg">{icon}</div>
      <div>
        <p className="text-white/60 text-sm">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Result({ label, value }: any) {
  return (
    <div className="bg-black/40 p-4 rounded-lg">
      <p className="text-white/60 text-xs">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  );
}
