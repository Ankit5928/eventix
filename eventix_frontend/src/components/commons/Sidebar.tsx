import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  ScanLine,
  Settings,
  LogOut,
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
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0 z-50">
      {/* Brand Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link
          to="/dashboard"
          className="text-2xl font-bold tracking-tight text-blue-500"
        >
          EVENTIX
          <span className="text-white text-xs ml-1 uppercase">Admin</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-6 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon
                className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "group-hover:text-blue-400"}`}
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
