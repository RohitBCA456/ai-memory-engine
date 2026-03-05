import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { MoreVertical, Eye, Trash2, Box, Calendar, ArrowUpRight } from 'lucide-react';
import ApiKeyModal from '../components/ui/ApiKeyModal';

export default function ManageApps() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  // Mock data for your BCA project
  const [apps, setApps] = useState([
    { id: '1', name: 'E-commerce Bot', description: 'Handles customer queries', apiKey: 'me_live_a1b2c3d4', createdAt: '2026-02-15' },
    { id: '2', name: 'Finance Tracker', description: 'Stores transaction context', apiKey: 'me_live_x9y8z7w6', createdAt: '2026-03-01' },
  ]);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if(window.confirm("Are you sure you want to delete this memory instance?")) {
      setApps(apps.filter(app => app.id !== id));
    }
  };

  const openKeyModal = (app, e) => {
    e.stopPropagation();
    setSelectedApp(app);
    setShowKeyModal(true);
    setActiveMenu(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Your <span className="text-indigo-600">Applications</span>
        </h1>
        <p className={`mt-2 text-lg ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          Manage your memory instances and access credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div 
            key={app.id}
            onClick={() => navigate('/explorer')}
            className={`group relative p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer hover:-translate-y-2 ${
              isDarkMode 
                ? "bg-gray-900/50 border-gray-800 hover:border-indigo-500/50 hover:bg-gray-900 shadow-2xl shadow-black/50" 
                : "bg-white border-gray-100 shadow-sm hover:shadow-indigo-100"
            }`}
          >
            {/* 3-Dot Menu */}
            <div className="absolute top-6 right-6">
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === app.id ? null : app.id); }}
                className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-gray-800 text-gray-500" : "hover:bg-gray-50 text-gray-400"}`}
              >
                <MoreVertical size={20} />
              </button>

              {activeMenu === app.id && (
                <div className={`absolute right-0 mt-2 w-48 rounded-2xl border shadow-2xl z-20 py-2 animate-in zoom-in-95 duration-200 ${
                  isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
                }`}>
                  <button 
                    onClick={(e) => openKeyModal(app, e)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <Eye size={16} /> View API Key
                  </button>
                  <button 
                    onClick={(e) => handleDelete(app.id, e)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={16} /> Delete Instance
                  </button>
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                <Box size={24} />
              </div>
              
              <div>
                <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{app.name}</h3>
                <p className={`text-sm mt-1 line-clamp-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{app.description}</p>
              </div>

              <div className={`pt-4 border-t flex items-center justify-between text-xs font-bold uppercase tracking-widest ${isDarkMode ? "border-gray-800 text-gray-600" : "border-gray-50 text-gray-400"}`}>
                <div className="flex items-center gap-2">
                  <Calendar size={14} /> {app.createdAt}
                </div>
                <div className="flex items-center gap-1 text-indigo-500">
                  Explore <ArrowUpRight size={14} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <ApiKeyModal 
          app={selectedApp} 
          onClose={() => setShowKeyModal(false)} 
          isDarkMode={isDarkMode} 
        />
      )}
    </div>
  );
}