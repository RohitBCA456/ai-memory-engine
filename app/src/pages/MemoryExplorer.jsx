import React, { useState, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import MemoryTable from '../components/ui/MemoryTable';
import FilterBar from '../components/ui/FilterBar';
import MemoryAnalytics from '../components/charts/MemoryAnalytics';

export default function MemoryExplorer() {
  const { isDarkMode } = useTheme();
  const [typeFilter, setTypeFilter] = useState("all");
  const [timeSort, setTimeSort] = useState("newest");

  // Mock data for analytics
  const chartData = [
    { name: 'E-commerce Bot', longTerm: 450, shortTerm: 120 },
    { name: 'Finance Tracker', longTerm: 320, shortTerm: 80 },
    { name: 'Health App', longTerm: 150, shortTerm: 400 },
  ];

  const [memories, setMemories] = useState([
    { id: '1', type: 'long-term', content: 'System Design study notes', createdAt: new Date(2026, 2, 1) },
    { id: '2', type: 'short-term', content: 'Recent Node.js context', createdAt: new Date(2026, 2, 5) },
    { id: '3', type: 'long-term', content: 'Unit testing best practices', createdAt: new Date(2026, 1, 11) },
  ]);

  const filteredMemories = useMemo(() => {
    let result = [...memories];
    if (typeFilter !== "all") {
      result = result.filter(m => m.type === typeFilter);
    }
    result.sort((a, b) => timeSort === "newest" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt);
    return result;
  }, [typeFilter, timeSort, memories]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Memory <span className="text-indigo-600">Explorer</span>
          </h1>
          <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Visualizing telemetry across MongoDB and Redis engines.
          </p>
        </div>

        <FilterBar 
          typeFilter={typeFilter} 
          setTypeFilter={setTypeFilter} 
          timeSort={timeSort} 
          setTimeSort={setTimeSort} 
          isDarkMode={isDarkMode} 
        />
      </div>

      {/* Analytics Chart Section */}
      <MemoryAnalytics data={chartData} isDarkMode={isDarkMode} />

      <MemoryTable 
        data={filteredMemories} 
        onDelete={(id) => setMemories(prev => prev.filter(m => m.id !== id))} 
        isDarkMode={isDarkMode}
      />
    </div>
  );
}