import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useTheme } from '../../context/ThemeContext';

export default function DashboardLayout({ children }) {
  const { isDarkMode } = useTheme();

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${
      isDarkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"
    }`}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}