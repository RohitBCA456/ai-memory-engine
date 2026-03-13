// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Database, Clock, Activity, BrainCircuit, Zap, ShieldCheck, Share2, Quote, Rocket } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAppAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, isDarkMode }) => (
  <div className={`p-6 rounded-2xl border shadow-sm transition-all duration-300 ${
    isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
  }`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{title}</p>
        <h3 className={`text-2xl font-bold mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

const FeatureBadge = ({ icon: Icon, title, desc, isDarkMode }) => (
  <div className="flex gap-4">
    <div className={`p-2 h-fit rounded-lg ${isDarkMode ? "bg-gray-800 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
      <Icon size={20} />
    </div>
    <div>
      <h4 className={`font-bold text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>{title}</h4>
      <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{desc}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const { isDarkMode } = useTheme();
  const { dbUser } = useAppAuth();
  const [stats, setStats] = useState({ longTerm: 0, shortTerm: 0, total: 0 });
  const navigate = useNavigate();

 useEffect(() => {
  const fetchRealStats = async () => {
    try {
      const token = dbUser?.token || dbUser?.webToken;
      const response = await fetch("http://localhost:4000/user-service/global-stats", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();
      if (result.success) {
        setStats({
          longTerm: result.data.longTerm,
          shortTerm: result.data.shortTerm,
          total: result.data.total
        });
      }
    } catch (error) {
      console.error("Dashboard Stats Error:", error);
    }
  };

  if (dbUser) fetchRealStats();
}, [dbUser]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          System Overview
        </h1>
        <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          Welcome back to the AI Memory Engine. Your retrieval-augmented bridge is active.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Long-Term Memories" value={stats.longTerm} icon={Database} color="bg-blue-600" isDarkMode={isDarkMode} />
        <StatCard title="Short-Term Context" value={stats.shortTerm} icon={Clock} color="bg-purple-600" isDarkMode={isDarkMode} />
        <StatCard title="Total Operations" value={stats.total} icon={Activity} color="bg-emerald-600" isDarkMode={isDarkMode} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: About & Philosophy */}
        <div className={`lg:col-span-2 p-8 rounded-3xl border ${
          isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        }`}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            <Zap size={22} className="text-yellow-500" /> Core Capabilities
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureBadge 
              icon={ShieldCheck} 
              title="State Persistence" 
              desc="Automatic migration from Redis hot-path to MongoDB cold storage." 
              isDarkMode={isDarkMode}
            />
            <FeatureBadge 
              icon={Share2} 
              title="Multi-App Bridge" 
              desc="Connect multiple Node.js instances using unique API credentials." 
              isDarkMode={isDarkMode}
            />
            <FeatureBadge 
              icon={BrainCircuit} 
              title="Contextual Retrieval" 
              desc="Optimize LLM performance by providing relevant historical context." 
              isDarkMode={isDarkMode}
            />
            <FeatureBadge 
              icon={Activity} 
              title="Real-time Streams" 
              desc="Monitor memory ingestion with millisecond latency tracking." 
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Right Column: AI Insights / Quote */}
        <div className={`p-8 rounded-3xl border flex flex-col justify-between ${
          isDarkMode ? "bg-indigo-950/20 border-indigo-500/20" : "bg-indigo-50 border-indigo-100"
        }`}>
          <div>
            <Quote size={32} className="text-indigo-500 mb-4 opacity-50" />
            <p className={`text-lg font-medium leading-relaxed italic ${isDarkMode ? "text-indigo-200" : "text-indigo-900"}`}>
              "The capacity to remember is what makes intelligence useful. Without memory, AI is just a calculator."
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-indigo-500/10">
            <p className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
              System Tip
            </p>
            <p className={`text-sm mt-2 ${isDarkMode ? "text-indigo-300/70" : "text-indigo-800/70"}`}>
              Clear your Redis cache periodically to ensure the highest speed for new context windows.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="bg-indigo-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Rocket size={28} />
            <h2 className="text-2xl font-bold">Ready to integrate?</h2>
          </div>
          <p className="opacity-90 max-w-md text-indigo-50">
            Connect your Node.js application to the AI Memory Engine using your API key. 
          </p>
        </div>
        <button 
        onClick={() => navigate("/view-docs")}
        className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg">
          View Documentation
        </button>
      </div>
    </div>
  );
}