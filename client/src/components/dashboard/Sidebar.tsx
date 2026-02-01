import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Settings,
  BanknoteXIcon,
  BarChart2,
  BadgeEuro,
  User,
} from "lucide-react";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Portfolio", path: "/dashboard/portfolio", icon: BarChart2 },
  { name: "Lending", path: "/dashboard/banking-op", icon: BanknoteXIcon },
  { name: "Market", path: "/dashboard/market", icon: BadgeEuro },
  { name: "Activity", path: "/dashboard/activity", icon: Activity },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

const Sidebar = () => {
  return (
    <aside className="w-64 border-r border-white/10 bg-zinc-950 flex flex-col h-screen justify-between">
      
      {/* Logo */}
      <div className="px-6 py-5 text-xl font-semibold text-white">⚡ LoomX</div>

      {/* Navigation */}
      <nav className="px-3 space-y-1 flex-1 overflow-y-auto">
        {links.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all
              ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {name}
          </NavLink>
        ))}
      </nav>

      {/* Sticky Profile Section */}
      <div className="px-4 py-5 bg-zinc-950 border-t border-white/5 flex items-center gap-3 rounded-t-xl hover:bg-white/5 transition cursor-pointer">
        <User size={24} className="text-white/80" />
        <div className="flex-1">
          <p className="text-white/80 font-semibold text-sm">Greedy Geeks</p>
          <p className="text-white/50 text-xs">Ethereum</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
