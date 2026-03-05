// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Database, Clock, Activity, BrainCircuit } from 'lucide-react';
import api from '../services/api.js';
import { useTheme } from '../context/ThemeContext';

const StatCard = ({ title, value, icon: Icon, color, isDarkMode }) => (
  <div className={`p-6 rounded-2xl border shadow-sm transition-all duration-300 ${
    isDarkMode 
      ? "bg-gray-900 border-gray-800" 
      : "bg-white border-gray-200"
  }`}>
    <div className="flex items-center justify-between">
      <div>
        {/* Fix: Title color now toggles between light and dark gray */}
        <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          {title}
        </p>
        {/* Fix: Value color now toggles between white and near-black */}
        <h3 className={`text-2xl font-bold mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {value}
        </h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({ longTerm: 0, shortTerm: 0, total: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats({ longTerm: 124, shortTerm: 45, total: 169 }); 
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        {/* Fix: Main heading toggles color */}
        <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          System Overview
        </h1>
        <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          Monitoring your AI Memory Engine activity across MongoDB and Redis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Long-Term Memories" 
          value={stats.longTerm} 
          icon={Database} 
          color="bg-blue-600" 
          isDarkMode={isDarkMode}
        />
        <StatCard 
          title="Short-Term Context" 
          value={stats.shortTerm} 
          icon={Clock} 
          color="bg-purple-600" 
          isDarkMode={isDarkMode}
        />
        <StatCard 
          title="Total Operations" 
          value={stats.total} 
          icon={Activity} 
          color="bg-emerald-600" 
          isDarkMode={isDarkMode}
        />
      </div>

      <div className="bg-indigo-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BrainCircuit size={28} />
            <h2 className="text-2xl font-bold">Ready to integrate?</h2>
          </div>
          <p className="opacity-90 max-w-md text-indigo-50">
            Use your API key to connect your Node.js application to the AI Memory Engine. 
          </p>
        </div>
        <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg">
          View Documentation
        </button>
      </div>

      <div className={`rounded-2xl border p-6 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      }`}>
        {/* Fix: Section heading toggles color */}
        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Recent Memory Logs
        </h3>
        <div className="text-center py-12">
          <Activity size={48} className={`mx-auto mb-4 opacity-20 ${isDarkMode ? "text-white" : "text-gray-900"}`} />
          <p className={isDarkMode ? "text-gray-500" : "text-gray-400"}>
            No recent activity detected. Connect your app to see live logs.
          </p>
        </div>
      </div>
    </div>
  );
}