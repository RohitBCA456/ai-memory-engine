// src/pages/ManageApps.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAppAuth } from "../context/AuthContext"; // Import your auth context
import {
  MoreVertical,
  Eye,
  Trash2,
  Box,
  Calendar,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import ApiKeyModal from "../components/ui/ApiKeyModal";

export default function ManageApps() {
  const { isDarkMode } = useTheme();
  const { dbUser } = useAppAuth(); // Get user token for the request
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const GATEWAY_URL = "http://localhost:4000/user-service/manage-app";

  // Fetch real apps from the Gateway
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const token = dbUser?.token || dbUser?.webToken;
        const response = await fetch(GATEWAY_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (result.success) {
          // Map the backend data to your frontend app structure
          setApps(result.data);
        }
      } catch (error) {
        console.error("Error fetching apps:", error);
      } finally {
        setLoading(false);
      }
    };

    if (dbUser) fetchApps();
  }, [dbUser]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();

    if (
      window.confirm("Are you sure you want to delete this memory instance?")
    ) {
      try {
        const token = dbUser?.token || dbUser?.webToken;

        const response = await fetch(
          `http://localhost:4000/user-service/delete-app/${id}`,
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
          // Real-time UI update: Remove the app from the local state array
          setApps((prevApps) => prevApps.filter((app) => app._id !== id));
          setActiveMenu(null); // Close the menu
        } else {
          alert(result.message || "Failed to delete application");
        }
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const openKeyModal = (app, e) => {
    e.stopPropagation();
    setSelectedApp(app);
    setShowKeyModal(true);
    setActiveMenu(null);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1
          className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Your <span className="text-indigo-600">Applications</span>
        </h1>
        <p
          className={`mt-2 text-lg ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          Manage your memory instances and access credentials.
        </p>
      </div>

      {apps.length === 0 ? (
        <div
          className={`p-20 text-center rounded-[3rem] border-2 border-dashed ${isDarkMode ? "border-gray-800" : "border-gray-100"}`}
        >
          <p className={isDarkMode ? "text-gray-500" : "text-gray-400"}>
            No applications found. Create one to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <div
              key={app._id} // Using MongoDB _id
              onClick={() => navigate(`/explorer/${app._id}`)}
              className={`group relative p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer hover:-translate-y-2 ${
                isDarkMode
                  ? "bg-gray-900/50 border-gray-800 hover:border-indigo-500/50 hover:bg-gray-900 shadow-2xl shadow-black/50"
                  : "bg-white border-gray-100 shadow-sm hover:shadow-indigo-100"
              }`}
            >
              {/* Menu and Content (Same as your previous JSX, ensure mapping app.name, app.description, etc.) */}
              <div className="absolute top-6 right-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === app._id ? null : app._id);
                  }}
                  className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-gray-800 text-gray-500" : "hover:bg-gray-400"}`}
                >
                  <MoreVertical size={20} />
                </button>

                {activeMenu === app._id && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-2xl border shadow-2xl z-20 py-2 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
                  >
                    <button
                      onClick={(e) => openKeyModal(app, e)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      <Eye size={16} /> View API Key
                    </button>
                    <button
                      onClick={(e) => handleDelete(app._id, e)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={16} /> Delete Instance
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}
                >
                  <Box size={24} />
                </div>
                <div>
                  <h3
                    className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {app.name}
                  </h3>
                  <p
                    className={`text-sm mt-1 line-clamp-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {app.description}
                  </p>
                </div>
                <div
                  className={`pt-4 border-t flex items-center justify-between text-xs font-bold uppercase tracking-widest ${isDarkMode ? "border-gray-800 text-gray-600" : "border-gray-50 text-gray-400"}`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />{" "}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1 text-indigo-500">
                    Explore <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
