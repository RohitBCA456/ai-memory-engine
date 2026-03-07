import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

export default function MemoryAnalytics({ data, isDarkMode }) {
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 md:p-4 rounded-xl border shadow-2xl backdrop-blur-xl ${
          isDarkMode ? "bg-gray-950/90 border-indigo-500/50 text-white" : "bg-white/90 border-gray-200 text-gray-900"
        }`}>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-indigo-500">
            Bucket: {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between gap-6 md:gap-10 items-center mt-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[10px] md:text-[11px] font-bold opacity-80">{entry.name}</span>
              </div>
              <span className="text-[10px] md:text-xs font-black">{entry.value} Ops</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    // Reduced padding and rounded corners on mobile (p-4 vs p-8)
    <div className={`relative overflow-hidden p-4 md:p-8 rounded-[1.5rem] md:rounded-[3rem] border transition-all duration-700 ${
      isDarkMode ? "bg-gray-900/20 border-gray-800" : "bg-white border-gray-100 shadow-2xl shadow-indigo-100/50"
    }`}>
      {/* Container height is slightly reduced on mobile */}
      <div className="h-[250px] md:h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#1f2937" : "#f3f4f6"} />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              interval={0}
              tick={{ fill: isDarkMode ? "#4b5563" : "#9ca3af", fontSize: 10, fontWeight: 800 }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: isDarkMode ? "#4b5563" : "#9ca3af", fontSize: 10, fontWeight: 800 }} 
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Line type="monotone" dataKey="longTerm" name="MongoDB" stroke="#6366f1" strokeWidth={3} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="shortTerm" name="Redis" stroke="#a855f7" strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}