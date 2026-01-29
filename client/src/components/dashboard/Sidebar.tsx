import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  User,
  Activity,
  Settings,
  ArrowLeft,
} from "lucide-react";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Home", path: "/dashboard/home", icon: Home },
  { name: "Profile", path: "/dashboard/profile", icon: User },
  { name: "Activity", path: "/dashboard/activity", icon: Activity },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

const Sidebar = () => {
  return (
    <aside className="w-64 border-r border-white/10 bg-zinc-950">
      <div className="px-6 py-5 text-xl font-semibold">⚡ LoomX</div>

      <nav className="px-3 space-y-1">
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

      {/* Back */}
      <div className="absolute bottom-6 w-full px-3">
        <NavLink
          to="/"
          className="inline-flex items-center gap-3 px-12 py-3 rounded-lg text-white/60 hover:bg-white/5"
        >
          <ArrowLeft size={18} />
          Back to site
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
