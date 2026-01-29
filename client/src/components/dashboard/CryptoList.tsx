const cryptos = [
  { name: "Bitcoin", symbol: "BTC", price: "$43,120", change: "+2.4%" },
  { name: "Ethereum", symbol: "ETH", price: "$2,320", change: "-1.1%" },
  { name: "Solana", symbol: "SOL", price: "$98.40", change: "+5.8%" }
];

const CryptoList = () => {
  return (
    <div className="grid gap-4">
      {cryptos.map((c) => (
        <div
          key={c.symbol}
          className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition"
        >
          <div>
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-white/50">{c.symbol}</p>
          </div>

          <div className="text-right">
            <p>{c.price}</p>
            <p
              className={`text-sm ${
                c.change.startsWith("+")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {c.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CryptoList;
