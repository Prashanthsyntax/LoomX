import { Lock, Repeat, CreditCard, Gift } from "lucide-react";

const QuickActions = () => {
  return (
    <div className="rounded-2xl bg-zinc-900 p-6 border border-white/5 space-y-3">
      <h3 className="text-sm text-white/60 font-semibold">Quick Actions</h3>

      <button className="w-full h-11 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition flex items-center justify-center gap-2">
        <Lock className="w-4 h-4" />
        Stake
      </button>

      <button className="w-full h-11 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition flex items-center justify-center gap-2">
        <Repeat className="w-4 h-4" />
        Swap
      </button>

      <button className="w-full h-11 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition flex items-center justify-center gap-2">
        <CreditCard className="w-4 h-4" />
        Add Liquidity
      </button>

      <button className="w-full h-11 rounded-xl bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 transition flex items-center justify-center gap-2">
        <Gift className="w-4 h-4" />
        Claim Rewards
      </button>
    </div>
  );
};

export default QuickActions;
