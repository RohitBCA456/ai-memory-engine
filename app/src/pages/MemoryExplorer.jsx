import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAppAuth } from "../context/AuthContext.jsx";
import MemoryTable from "../components/ui/MemoryTable.jsx";
import FilterBar from "../components/ui/FilterBar.jsx";
import MemoryAnalytics from "../components/charts/MemoryAnalytics.jsx";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

export default function MemoryExplorer() {
  // Ensure appId is passed from parent or URL params
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
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // 1. Fetch Telemetry (Chart Data)
        const telemetryRes = await fetch(`${BASE_URL}/telemetry/${appId}`, {
          headers,
        });
        const telemetryJson = await telemetryRes.json();

        // 2. Fetch Memories (Table Data)
        const memoriesRes = await fetch(
          `${BASE_URL}/memories/${appId}?type=${typeFilter}`,
          { headers },
        );
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

  const handleDelete = async (memoryId) => {
    if (!window.confirm("Are you sure you want to delete this memory?")) return;

    try {
      const token = dbUser?.token || dbUser?.webToken;

      const response = await fetch(
        `http://localhost:4000/user-service/delete-memory/${memoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      if (result.success) {
        // Update local state to remove the item from the UI immediately
        setMemories((prev) => prev.filter((m) => m.id !== memoryId));
        // Optional: Refresh telemetry to update the chart
        // fetchExplorerData();
      } else {
        alert("Failed to delete: " + result.message);
      }
    } catch (error) {
      console.error("Deletion Error:", error);
      alert("An error occurred while deleting the memory.");
    }
  };

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
    <div className="w-full max-w-[95vw] overflow-x-hidden px-4 md:px-8 py-10 space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="min-w-0 flex-1">
          {" "}
          {/* min-w-0 prevents text from pushing width */}
          <h1
            className={`text-3xl md:text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            Memory <span className="text-indigo-600">Explorer</span>
          </h1>
          <p
            className={`mt-2 break-all md:break-normal ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Visualizing telemetry for App ID:{" "}
            <span className="font-mono text-xs bg-indigo-500/10 px-2 py-0.5 rounded">
              {appId}
            </span>
          </p>
        </div>

        <div className="w-full lg:w-auto">
          <FilterBar
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            timeSort={timeSort}
            setTimeSort={setTimeSort}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Chart Component - Wrapped in a constraint */}
      <div className="w-full overflow-hidden">
        <MemoryAnalytics data={telemetry} isDarkMode={isDarkMode} />
      </div>

      {/* Table Component - Wrapped in a constraint */}
      <div className="w-full overflow-hidden">
        <MemoryTable
          data={sortedMemories}
          onDelete={handleDelete}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
}
