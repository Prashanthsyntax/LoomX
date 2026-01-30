import { useState } from "react";

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
        body: JSON.stringify({
          borrower,
          interest,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setMessage("Loan approved successfully");
    } catch (err) {
      setMessage(`${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-xl p-6 space-y-6">
        <h1 className="text-xl font-semibold text-center">
          Banking Operations
        </h1>

        <input
          type="text"
          placeholder="Borrower Address"
          value={borrower}
          onChange={(e) => setBorrower(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 focus:outline-none focus:border-white/30"
        />

        <input
          type="text"
          placeholder="Interest (ETH)"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 focus:outline-none focus:border-white/30"
        />

        <button
          onClick={approveLoan}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Approve Loan"}
        </button>

        {message && (
          <p className="text-center text-sm text-white/70">{message}</p>
        )}
      </div>
    </div>
  );
}
