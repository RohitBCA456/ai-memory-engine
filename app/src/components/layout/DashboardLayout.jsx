import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useTheme } from '../../context/ThemeContext';

export default function DashboardLayout({ children }) {
  const { isDarkMode } = useTheme();

  return (
    // overflow-x-hidden on the root is the safety net
    <div className={`flex min-h-screen w-full overflow-x-hidden transition-colors duration-300 ${
      isDarkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"
    }`}>
      <Sidebar />
      
      {/* min-w-0 is the "magic" fix for flex children. 
          It allows the container to shrink smaller than its content.
      */}
      <div className="flex-1 min-w-0 flex flex-col">
        <Navbar />
        
        {/* Added mt-16 to clear the mobile sticky sidebar header.
            overflow-x-hidden here ensures children like charts stay bounded.
        */}
        <main className="p-4 md:p-8 flex-1 w-full max-w-full overflow-x-hidden mt-16 md:mt-0">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}