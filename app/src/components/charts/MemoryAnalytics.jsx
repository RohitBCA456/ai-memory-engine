import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export default function MemoryAnalytics({ isDarkMode }) {
  // 24-Hour Mock Data: Tracking storage ingestion across time blocks
  const hourlyData = [
    { time: '00:00', longTerm: 120, shortTerm: 340 },
    { time: '04:00', longTerm: 210, shortTerm: 410 },
    { time: '08:00', longTerm: 450, shortTerm: 520 },
    { time: '12:00', longTerm: 600, shortTerm: 300 },
    { time: '16:00', longTerm: 820, shortTerm: 480 },
    { time: '20:00', longTerm: 980, shortTerm: 390 },
    { time: 'Now', longTerm: 1150, shortTerm: 510 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all ${
          isDarkMode ? "bg-gray-950/90 border-indigo-500/50 text-white" : "bg-white/90 border-gray-200 text-gray-900"
        }`}>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-indigo-500">
            Timestamp: {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between gap-10 items-center mt-1">
              <span className="text-[11px] font-bold opacity-80">{entry.name}</span>
              <span className="text-xs font-black" style={{ color: entry.color }}>
                {entry.value} MB
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`relative overflow-hidden p-8 rounded-[3rem] border transition-all duration-700 ${
      isDarkMode 
        ? "bg-gray-900/20 border-gray-800 shadow-[0_0_50px_-12px_rgba(99,102,241,0.1)]" 
        : "bg-white border-gray-100 shadow-2xl shadow-indigo-100/50"
    }`}>
      {/* Background Decorative Glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h3 className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Engine <span className="text-indigo-500">Activity</span>
          </h3>
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 ${
            isDarkMode ? "text-gray-500" : "text-gray-400"
          }`}>
            Last 24 Hours Telemetry
          </p>
        </div>
        
        <div className={`flex items-center gap-4 p-1.5 rounded-2xl border ${isDarkMode ? "bg-black/40 border-gray-800" : "bg-gray-50 border-gray-200"}`}>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            <span className="text-[9px] font-black uppercase text-indigo-500">MongoDB Archive</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            <span className="text-[9px] font-black uppercase text-purple-500">Redis Hot-Path</span>
          </div>
        </div>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="0" 
              vertical={false} 
              stroke={isDarkMode ? "#1f2937" : "#f3f4f6"} 
            />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: isDarkMode ? "#4b5563" : "#9ca3af", fontSize: 11, fontWeight: 800 }} 
              dy={15} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: isDarkMode ? "#4b5563" : "#9ca3af", fontSize: 11, fontWeight: 800 }} 
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: isDarkMode ? "#6366f108" : "#6366f105" }} 
            />
            
            <Bar 
              dataKey="longTerm" 
              name="MongoDB" 
              stackId="a" 
              fill="#6366f1" 
              radius={[0, 0, 0, 0]} 
              barSize={50}
            />
            
            <Bar 
              dataKey="shortTerm" 
              name="Redis" 
              stackId="a" 
              fill="#a855f7" 
              radius={[12, 12, 0, 0]} 
              barSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}