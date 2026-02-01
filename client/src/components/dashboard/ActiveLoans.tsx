const ActiveLoans = () => {
  return (
    <div className="rounded-2xl bg-zinc-900 p-6 border border-white/5">
      <h3 className="text-sm text-white/60 mb-2">Active Loans</h3>
      <p className="text-xl font-semibold">1.5 ETH ≈ $4,750</p>
      <p className="text-sm text-white/50 mt-1">Due May 15, 2024</p>

      <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full w-[75%] bg-green-400" />
      </div>

      <p className="text-xs text-white/50 mt-2">75% paid</p>
    </div>
  );
};

export default ActiveLoans;
