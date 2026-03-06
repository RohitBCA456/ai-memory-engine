import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAppAuth } from '../context/AuthContext';
import MemoryTable from '../components/ui/MemoryTable';
import FilterBar from '../components/ui/FilterBar';
import MemoryAnalytics from '../components/charts/MemoryAnalytics';
import { Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function MemoryExplorer() { // Ensure appId is passed from parent or URL params
  const { isDarkMode } = useTheme();
  const { dbUser } = useAppAuth();
  const [typeFilter, setTypeFilter] = useState("all");
  const [timeSort, setTimeSort] = useState("newest");

  const { appId } = useParams();

  const [telemetry, setTelemetry] = useState([]);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:4000/user-service";

  useEffect(() => {
    const fetchExplorerData = async () => {
      if (!dbUser || !appId) return;
      setLoading(true);
      
      try {
        const token = dbUser?.token || dbUser?.webToken;
        const headers = { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // 1. Fetch Telemetry (Chart Data)
        const telemetryRes = await fetch(`${BASE_URL}/telemetry/${appId}`, { headers });
        const telemetryJson = await telemetryRes.json();

        // 2. Fetch Memories (Table Data)
        const memoriesRes = await fetch(`${BASE_URL}/memories/${appId}?type=${typeFilter}`, { headers });
        const memoriesJson = await memoriesRes.json();

        if (telemetryJson.success) setTelemetry(telemetryJson.data);
        if (memoriesJson.success) setMemories(memoriesJson.data);

      } catch (error) {
        console.error("Explorer Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExplorerData();
  }, [dbUser, appId, typeFilter]); // Refetch when filter changes

  // Client-side sorting for the Table
  const sortedMemories = useMemo(() => {
    return [...memories].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return timeSort === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [memories, timeSort]);

  if (loading && memories.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Memory <span className="text-indigo-600">Explorer</span>
          </h1>
          <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Visualizing telemetry across MongoDB and Redis for App ID: <span className="font-mono text-xs">{appId}</span>
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

      {/* Real Analytics Data */}
      <MemoryAnalytics data={telemetry} isDarkMode={isDarkMode} />

      {/* Real Memory List */}
      <MemoryTable 
        data={sortedMemories} 
        onDelete={(id) => setMemories(prev => prev.filter(m => m.id !== id))} 
        isDarkMode={isDarkMode}
      />
    </div>
  );
}