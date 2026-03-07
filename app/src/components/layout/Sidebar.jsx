import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Cpu,
  PlusCircle,
  SquareStackIcon,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function Sidebar() {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Create App", path: "/create-app", icon: PlusCircle },
    { name: "Manage Apps", path: "/manage-apps", icon: SquareStackIcon },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <Cpu size={24} />
        </div>
        <span className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          MemEngine
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)} // Close menu on click
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : isDarkMode
                    ? "text-gray-400 hover:bg-gray-900"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* --- MOBILE NAVIGATION --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center border-b backdrop-blur-md bg-opacity-80">
        <div className="flex items-center gap-2">
          <Cpu className="text-indigo-600" size={24} />
          <span className="font-bold">MemEngine</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-lg ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu Overlay */}
      {isOpen && (
        <div className={`md:hidden fixed inset-0 z-40 pt-20 animate-in slide-in-from-top duration-300 ${
          isDarkMode ? "bg-gray-950" : "bg-white"
        }`}>
          <SidebarContent />
        </div>
      )}

      {/* --- DESKTOP SIDEBAR --- */}
      <aside
        className={`w-64 border-r transition-colors duration-300 hidden md:flex flex-col h-screen sticky top-0 ${
          isDarkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}