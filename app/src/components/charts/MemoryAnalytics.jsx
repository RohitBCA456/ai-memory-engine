import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// src/components/charts/MemoryAnalytics.jsx
export default function MemoryAnalytics({ data, isDarkMode }) {
  // 'data' is now the real telemetry array from the backend
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl ${
          isDarkMode ? "bg-gray-950/90 border-indigo-500/50 text-white" : "bg-white/90 border-gray-200 text-gray-900"
        }`}>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-indigo-500">
            Bucket: {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between gap-10 items-center mt-1">
              <span className="text-[11px] font-bold opacity-80">{entry.name}</span>
              <span className="text-xs font-black" style={{ color: entry.color }}>
                {entry.value} Operations {/* Changed from MB to Operations */}
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
      isDarkMode ? "bg-gray-900/20 border-gray-800" : "bg-white border-gray-100 shadow-2xl shadow-indigo-100/50"
    }`}>
      {/* Header and Decorative Glow (Keep existing code) */}
      
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {/* Passing the real 'data' prop here */}
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke={isDarkMode ? "#1f2937" : "#f3f4f6"} />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? "#4b5563" : "#9ca3af", fontSize: 11, fontWeight: 800 }} dy={15} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? "#4b5563" : "#9ca3af", fontSize: 11, fontWeight: 800 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? "#6366f108" : "#6366f105" }} />
            
            {/* Matches controller: longTerm */}
            <Bar dataKey="longTerm" name="MongoDB" stackId="a" fill="#6366f1" barSize={50} />
            
            {/* Matches controller: shortTerm */}
            <Bar dataKey="shortTerm" name="Redis" stackId="a" fill="#a855f7" radius={[12, 12, 0, 0]} barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}