const CreditScore = () => {
  return (
    <div className="rounded-2xl bg-zinc-900 p-6 border border-white/5 flex justify-between">
      <div>
        <h3 className="text-sm text-white/60">AI Credit Score</h3>
        <p className="text-4xl font-semibold mt-2">720 <span className="text-lg text-white/40">/ 900</span></p>
        <p className="text-md mt-2 text-green-400">Low Risk · 2.5% APY</p>
        <p className="text-sm mt-1 text-amber-50">Learn more →</p>
      </div>

      {/* Gauge placeholder */}
      <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-red-500 via-yellow-400 to-green-400 opacity-80" />
    </div>
  );
};

export default CreditScore;
