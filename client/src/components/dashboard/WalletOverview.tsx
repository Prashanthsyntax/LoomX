const WalletOverview = () => {
  return (
    <div className="rounded-2xl bg-zinc-900 p-6 border border-white/5">
      <h3 className="text-sm text-white/60 mb-4">Wallet Overview</h3>

      <div className="space-y-2">
        <p className="text-lg font-medium">0x4Bd6...Ae6c</p>
        <p className="text-sm text-white/50">Network · Ethereum</p>
        <p className="text-2xl font-semibold">2.15 ETH <span className="text-white/50 text-base">≈ $6,800</span></p>
      </div>
    </div>
  );
};

export default WalletOverview;
