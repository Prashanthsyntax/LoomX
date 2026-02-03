import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ArrowDownRight, Search } from "lucide-react";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

export default function Market() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMarket();
    const interval = setInterval(fetchMarket, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchMarket = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h",
      );
      const data = await res.json();
      setCoins(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* 🔍 Optimized Search Filter */
  const filteredCoins = useMemo(() => {
    if (!search.trim()) return coins;

    const q = search.toLowerCase();
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(q) ||
        coin.symbol.toLowerCase().includes(q),
    );
  }, [coins, search]);

  const [activeTab, setActiveTab] = useState<"top" | "trending" | "watchlist">(
    "top",
  );

  return (
    <div className="min-h-screen text-white px-6 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab("top")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
      ${
        activeTab === "top"
          ? "bg-white/10 text-white"
          : "text-white/60 hover:bg-white/5 hover:text-white"
      }`}
          >
            Top
          </button>

          <button
            onClick={() => setActiveTab("trending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
      ${
        activeTab === "trending"
          ? "bg-white/10 text-white"
          : "text-white/60 hover:bg-white/5 hover:text-white"
      }`}
          >
            Trending
          </button>

          <button
            onClick={() => setActiveTab("watchlist")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
      ${
        activeTab === "watchlist"
          ? "bg-white/10 text-white"
          : "text-white/60 hover:bg-white/5 hover:text-white"
      }`}
          >
            Watchlist
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Bitcoin, ETH, SOL..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black border border-white/10 focus:border-white/30 outline-none text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <table className="w-full text-sm">
          <thead className="bg-black/40 text-white/60">
            <tr>
              <th className="text-left px-5 py-3">Asset</th>
              <th className="text-right px-5 py-3">Price</th>
              <th className="text-right px-5 py-3">24h %</th>
              <th className="text-right px-5 py-3">Market Cap</th>
              <th className="text-right px-5 py-3">Volume</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-white/50">
                  Loading market data...
                </td>
              </tr>
            ) : filteredCoins.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-white/50">
                  No assets found
                </td>
              </tr>
            ) : (
              filteredCoins.map((coin) => {
                const isUp = coin.price_change_percentage_24h >= 0;

                return (
                  <tr
                    key={coin.id}
                    className="border-t border-white/5 hover:bg-white/5 transition"
                  >
                    {/* Asset */}
                    <td className="px-5 py-4 flex items-center gap-3">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-6 h-6"
                      />
                      <div>
                        <p className="font-medium">{coin.name}</p>
                        <p className="text-xs text-white/50 uppercase">
                          {coin.symbol}
                        </p>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 text-right font-medium">
                      ${coin.current_price.toLocaleString()}
                    </td>

                    {/* Change */}
                    <td
                      className={`px-5 py-4 text-right font-medium ${
                        isUp ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      <span className="inline-flex items-center gap-1">
                        {isUp ? (
                          <ArrowUpRight size={14} />
                        ) : (
                          <ArrowDownRight size={14} />
                        )}
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </td>

                    {/* Market Cap */}
                    <td className="px-5 py-4 text-right text-white/70">
                      ${coin.market_cap.toLocaleString()}
                    </td>

                    {/* Volume */}
                    <td className="px-5 py-4 text-right text-white/70">
                      ${coin.total_volume.toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
