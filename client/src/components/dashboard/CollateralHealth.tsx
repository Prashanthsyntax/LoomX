const CollateralHealth = () => {
  return (
    <div className="rounded-2xl bg-zinc-900 p-6 border border-white/5">
      <h3 className="text-sm text-white/60">Collateral Health</h3>

      <div className="flex items-center gap-3 mt-2">
        <p className="text-3xl font-semibold">2.4</p>
        <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
          Safe
        </span>
      </div>

      <p className="text-sm text-white/50 mt-2">Liquidation Price: $1,850</p>
      <p className="text-sm mt-2 text-amber-50">Explore →</p>
    </div>
  );
};

export default CollateralHealth;
