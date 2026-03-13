import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  ScanLine,
  Settings,
  LogOut,
  Ticket,
  Sparkles,
} from "lucide-react";
import { useAppDispatch } from "../../store";
import { logout } from "../../store/slices/authSlice";

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Events", icon: Calendar, path: "/events" },
    { name: "Check-In", icon: ScanLine, path: "/check-in" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <aside className="h-full w-64 bg-[#0D0D0D] text-white flex flex-col border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
      {/* Branding Section */}
      <div className="p-8 mb-4">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF3333] to-[#990000] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF3333]/20 group-hover:rotate-6 transition-transform">
            <Ticket className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tighter uppercase italic leading-none">
              Event<span className="text-[#FF3333]">ix</span>
            </h2>
            <p className="text-[8px] tracking-[0.4em] text-white/30 uppercase font-black mt-1">Terminal v4.0</p>
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`
                flex items-center px-5 py-3.5 rounded-2xl transition-all duration-300 group
                ${isActive
                  ? "bg-white/[0.03] border border-white/10 text-white shadow-xl"
                  : "text-white/40 hover:text-white hover:bg-white/[0.02]"
                }
              `}
            >
              <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-[#FF3333]" : "group-hover:text-[#FF3333]"}`} />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{item.name}</span>

              {isActive && (
                <Sparkles className="ml-auto w-3 h-3 text-[#FF3333] animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-6 border-t border-white/5 bg-black/20">
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center w-full px-5 py-3 text-white/20 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all duration-300 group"
        >
          <LogOut className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">Logout Session</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;