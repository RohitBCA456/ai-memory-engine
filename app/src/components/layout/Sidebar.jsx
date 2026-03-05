import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Cpu,
  PlusCircle,
  SquareStackIcon,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function Sidebar() {
  const { isDarkMode } = useTheme();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Create App", path: "/create-app", icon: PlusCircle },
    { name: "Manage Apps", path: "/manage-apps", icon: SquareStackIcon },
  ];

  return (
    <aside
      className={`w-64 border-r transition-colors duration-300 hidden md:flex flex-col ${
        isDarkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <Cpu size={24} />
        </div>
        <span className="text-xl font-bold">MemEngine</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : isDarkMode
                    ? "text-gray-400 hover:bg-gray-900"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
