// src/components/layout/Navbar.jsx
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAppAuth } from '../../context/AuthContext';
import { UserButton } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isLoaded } = useAppAuth();

  return (
    <header className={`h-16 border-b flex items-center justify-between px-8 sticky top-0 z-50 transition-colors duration-300 ${
      isDarkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
    }`}>
      <div className="flex items-center gap-4">
        <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${
          isDarkMode ? "text-gray-500" : "text-gray-400"
        }`}>
          Engine Status: <span className="text-emerald-500 animate-pulse">● Live</span>
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
        
        {/* User Profile Section */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className={`text-sm font-bold leading-none ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {isLoaded ? user?.fullName : "Loading..."}
            </p>
            <p className={`text-[10px] font-medium mt-1 uppercase tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
              {user?.primaryEmailAddress?.emailAddress.split('@')[0]}
            </p>
          </div>

          <div className="p-0.5 rounded-full border-2 border-indigo-500/20 hover:border-indigo-500 transition-colors">
            <UserButton 
              appearance={{
                baseTheme: isDarkMode ? dark : undefined,
                elements: {
                  userButtonAvatarBox: "w-9 h-9",
                  userButtonPopoverCard: isDarkMode ? "bg-gray-900 border border-gray-800" : ""
                }
              }}
              afterSignOutUrl="/login"
            />
          </div>
        </div>
      </div>
    </header>
  );
}