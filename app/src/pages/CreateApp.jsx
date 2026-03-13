// src/pages/CreateApp.jsx
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAppAuth } from "../context/AuthContext.jsx"; // Import your auth hook
import {
  PlusCircle,
  ShieldCheck,
  Copy,
  Check,
  Rocket,
  Cpu,
  Globe,
  Key,
  ArrowRight,
} from "lucide-react";

export default function CreateApp() {
  const { isDarkMode } = useTheme();
  const { dbUser } = useAppAuth(); // Get user token for the request

  const [appName, setAppName] = useState("");
  const [description, setDescription] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const GATEWAY_URL = "https://ai-memory-engine-6uby.onrender.com/user-service/user-service/create-app";
      const token = dbUser?.token || dbUser?.webToken;

      const response = await fetch(GATEWAY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass token for verifyAuth middleware
        },
        body: JSON.stringify({
          name: appName,
          description: description,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Assuming your backend returns the new API key in result.data.apiKey
        setGeneratedKey(result.data.apiKey || result.data.key);
      } else {
        alert(result.message || "Failed to create application");
      }
    } catch (error) {
      console.error("Creation Error:", error);
      alert("Network error: Could not reach the Gateway.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header with Icon Group */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-500 mb-2">
          <Cpu size={40} className="animate-pulse" />
        </div>
        <h1
          className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Deploy New{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
            Memory Instance
          </span>
        </h1>
        <p
          className={`max-w-lg mx-auto text-lg ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          Connect your external applications to our high-speed retrieval bridge.
        </p>
      </div>

      {!generatedKey ? (
        <div
          className={`relative group p-[1px] rounded-[2.5rem] bg-gradient-to-b ${
            isDarkMode
              ? "from-gray-700 to-transparent"
              : "from-gray-200 to-transparent"
          }`}
        >
          <form
            onSubmit={handleCreate}
            className={`relative p-10 rounded-[2.45rem] backdrop-blur-3xl transition-all ${
              isDarkMode ? "bg-gray-950/90" : "bg-white"
            }`}
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Side: Inputs */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                  >
                    <Globe size={14} /> Application Name
                  </label>
                  <input
                    type="text"
                    required
                    className={`w-full p-4 rounded-2xl border outline-none transition-all font-medium ${
                      isDarkMode
                        ? "bg-gray-900 border-gray-800 text-white focus:border-indigo-500 focus:ring-4 ring-indigo-500/10"
                        : "bg-gray-50 border-gray-200 focus:border-indigo-400"
                    }`}
                    placeholder="e.g. Finance-Assistant-Bot"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Description
                  </label>
                  <textarea
                    className={`w-full p-4 rounded-2xl border outline-none transition-all h-32 resize-none font-medium ${
                      isDarkMode
                        ? "bg-gray-900 border-gray-800 text-white focus:border-indigo-500"
                        : "bg-gray-50 border-gray-200 focus:border-indigo-400"
                    }`}
                    placeholder="How will this app use the Memory Engine?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* Right Side: Info Panel */}
              <div
                className={`p-6 rounded-3xl border flex flex-col justify-center space-y-4 ${
                  isDarkMode
                    ? "bg-gray-900/50 border-gray-800"
                    : "bg-indigo-50/50 border-indigo-100"
                }`}
              >
                <h3
                  className={`font-bold flex items-center gap-2 ${isDarkMode ? "text-indigo-400" : "text-indigo-700"}`}
                >
                  <ShieldCheck size={18} /> Instant Provisioning
                </h3>
                <ul
                  className={`text-sm space-y-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  <li className="flex items-start gap-2">
                    • Auto-scales with your request volume.
                  </li>
                  <li className="flex items-start gap-2">
                    • Secured with SHA-256 encryption.
                  </li>
                  <li className="flex items-start gap-2">
                    • Ready for Production immediately.
                  </li>
                </ul>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !appName}
              className={`w-full mt-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl ${
                isLoading
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-500/40"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Bridge...
                </span>
              ) : (
                <>
                  Provision Instance <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Success State: Key Reveal */
        <div
          className={`p-1 rounded-[2.5rem] bg-gradient-to-r from-emerald-500 to-indigo-500 animate-in zoom-in-95 duration-500 shadow-2xl`}
        >
          <div
            className={`p-10 rounded-[2.45rem] flex flex-col items-center text-center space-y-6 ${isDarkMode ? "bg-gray-950" : "bg-white"}`}
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <ShieldCheck size={48} />
            </div>

            <div className="space-y-2">
              <h2
                className={`text-3xl font-black ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Access Granted
              </h2>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                Your application <b>{appName}</b> is now live. Use the key below
                in your header.
              </p>
            </div>

            <div
              className={`group relative w-full max-w-xl p-1 rounded-2xl transition-all ${
                isDarkMode ? "bg-gray-900" : "bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-4 px-6 py-5 font-mono text-lg">
                <Key size={20} className="text-indigo-500" />
                <span
                  className={`flex-1 truncate ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}
                >
                  {generatedKey}
                </span>
                <button
                  onClick={copyToClipboard}
                  className={`p-3 rounded-xl transition-all ${
                    copied
                      ? "bg-emerald-500 text-white"
                      : "hover:bg-indigo-500/10 text-indigo-500"
                  }`}
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="mt-4 px-8 py-3 rounded-xl font-bold border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
            >
              Finish Setup <Rocket size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
