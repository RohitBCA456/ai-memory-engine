import React, { useState, useCallback } from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import DocBot, { SIDE_PANEL_WIDTH } from "../ui/DocBot.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function DashboardLayout({ children }) {
  const { isDarkMode } = useTheme();

  const [botOpen, setBotOpen] = useState(false);
  const [botMode, setBotMode] = useState("float");

  const handleBotStateChange = useCallback((open, mode) => {
    setBotOpen(open);
    setBotMode(mode);
  }, []);

  const sideOpen = botOpen && botMode === "side";

  return (
    // Outer wrapper is now a COLUMN so Navbar sits above everything
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: isDarkMode ? "#020817" : "#f8fafc",
        transition: "background 0.2s",
      }}
    >
      {/* ── Top navbar — full width ── */}
      <Navbar />

      {/* ── Body row: sidebar + page content ── */}
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "stretch",
          marginRight: sideOpen ? SIDE_PANEL_WIDTH : 0,
          transition: "margin-right 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Left sidebar */}
        <Sidebar />

        {/* Page content */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            padding: "32px",
            overflowX: "hidden",
          }}
        >
          {children}
        </main>
      </div>

      {/* DocBot — floats or docks as side panel */}
      <DocBot onStateChange={handleBotStateChange} />
    </div>
  );
}
