import {
  ShieldCheck,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";

export default function Profile() {
  return (
    <div className="min-h-screen text-white px-6 py-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-black">
            GG
          </div>

          <div>
            <h1 className="text-xl font-semibold">Greedy Geeks</h1>
            <p className="text-xs text-white/50 flex items-center gap-1">
              <Wallet size={12} /> 0x9F2A...81E3
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
          <ShieldCheck className="text-emerald-400" size={16} />
          Account Healthy
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Supplied" value="$18,450" icon={<TrendingUp />} />
        <StatCard title="Borrowed" value="$7,320" icon={<TrendingDown />} />
        <StatCard title="Net APY" value="6.8%" positive />
        <StatCard title="Health Factor" value="1.92" highlight />
      </div>

      {/* POSITIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* SUPPLIED */}
        <PositionCard
          title="Supplied Assets"
          items={[
            { name: "Ethereum", symbol: "ETH", amount: "4.2", apy: "4.5%" },
            { name: "USDC", symbol: "USDC", amount: "6,000", apy: "5.1%" },
          ]}
          action="Withdraw"
        />

        {/* BORROWED */}
        <PositionCard
          title="Borrowed Assets"
          items={[
            { name: "USDT", symbol: "USDT", amount: "3,500", apy: "7.2%" },
          ]}
          action="Repay"
          danger
        />
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({
  title,
  value,
  icon,
  positive,
  highlight,
}: {
  title: string;
  value: string;
  icon?: React.ReactNode;
  positive?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <p className="text-xs text-white/50 mb-1">{title}</p>
      <div
        className={`text-lg font-semibold ${
          positive
            ? "text-emerald-400"
            : highlight
            ? "text-orange-400"
            : ""
        }`}
      >
        {value}
      </div>
      {icon && <div className="text-white/30 mt-2">{icon}</div>}
    </div>
  );
}

function PositionCard({
  title,
  items,
  action,
  danger,
}: {
  title: string;
  items: {
    name: string;
    symbol: string;
    amount: string;
    apy: string;
  }[];
  action: string;
  danger?: boolean;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <h2 className="font-medium mb-4">{title}</h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.symbol}
            className="flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-white/50">{item.symbol}</p>
            </div>

            <div className="text-right">
              <p>{item.amount}</p>
              <p
                className={`text-xs ${
                  danger ? "text-red-400" : "text-emerald-400"
                }`}
              >
                APY {item.apy}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        className={`mt-4 w-full py-2 rounded-lg flex items-center justify-center gap-1 transition
          ${
            danger
              ? "bg-red-500/10 hover:bg-red-500/20 text-red-400"
              : "bg-white/10 hover:bg-white/20"
          }`}
      >
        {action}
        <ArrowUpRight size={14} />
      </button>
    </div>
  );
}
