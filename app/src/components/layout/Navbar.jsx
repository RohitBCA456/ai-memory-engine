// src/components/layout/Navbar.jsx
import { Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAppAuth } from '../../context/AuthContext';
import { useUser } from '@clerk/clerk-react';

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { dbUser, loading, logout } = useAppAuth();
  const { user } = useUser(); // Used for the profile image

  return (
    <header className={`h-16 border-b flex items-center justify-between px-8 sticky top-0 z-50 transition-colors duration-300 ${
      isDarkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
    }`}>
      {/* Engine Status */}
      <div className="flex items-center gap-4">
        <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
          Engine Status: <span className={`${dbUser ? "text-emerald-500" : "text-red-500"} animate-pulse`}>
            ● {dbUser ? "Live" : "Offline"}
          </span>
        </h2>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className={`p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95 ${
            isDarkMode ? "bg-gray-900 text-yellow-400 border border-gray-800" : "bg-gray-100 text-indigo-600 border border-gray-200"
          }`}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className={`h-6 w-[1px] ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`} />

        {/* Custom Profile Section (No Dropdown) */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className={`text-sm font-bold leading-none ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {!loading && dbUser ? dbUser.username : "Connecting..."}
              </p>
              <p className={`text-[10px] font-medium mt-1 uppercase tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                {dbUser?.email ? dbUser.email.split('@')[0] : "auth_sync"}
              </p>
            </div>
            
            {/* Manual Profile Image */}
            <div className="w-9 h-9 rounded-full border-2 border-indigo-500/20 overflow-hidden">
              <img 
                src={user?.imageUrl || "/default-avatar.png"} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Dedicated Logout Button */}
          <button
            onClick={logout}
            title="Sign Out"
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? "text-gray-400 hover:text-red-400 hover:bg-red-400/10" 
                : "text-gray-500 hover:text-red-600 hover:bg-red-50"
            }`}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}