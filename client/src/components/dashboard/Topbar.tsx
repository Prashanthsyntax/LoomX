const Topbar = () => {
  return (
    <header className="h-16 border-b border-white/10 flex items-center justify-between px-6">
      <h1 className="text-lg font-medium">Dashboard</h1>

      <button className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition">
        Connect Wallet
      </button>
    </header>
  );
};

export default Topbar;
