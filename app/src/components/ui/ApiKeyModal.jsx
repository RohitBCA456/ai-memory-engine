import React, { useState } from 'react';
import { X, Key, Copy, Check } from 'lucide-react';

export default function ApiKeyModal({ app, onClose, isDarkMode }) {
  const [copied, setCopied] = useState(false);

  const copyKey = () => {
    navigator.clipboard.writeText(app.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className={`relative w-full max-w-md p-8 rounded-[2.5rem] border shadow-2xl animate-in zoom-in-95 duration-300 ${
          isDarkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-500/10 transition-colors">
          <X size={20} />
        </button>

        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 mb-4">
              <Key size={32} />
            </div>
            <h2 className="text-2xl font-black">App Credentials</h2>
            <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Credentials for <b>{app.name}</b>
            </p>
          </div>

          <div className={`p-5 rounded-2xl border space-y-3 ${isDarkMode ? "bg-black border-gray-800" : "bg-gray-50 border-gray-200"}`}>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Public API Key</label>
            <div className="flex items-center gap-3 font-mono text-sm break-all">
              <span className={isDarkMode ? "text-emerald-400" : "text-emerald-600"}>{app.apiKey}</span>
              <button 
                onClick={copyKey}
                className={`shrink-0 p-2 rounded-lg transition-all ${copied ? "bg-emerald-500 text-white" : "hover:bg-indigo-500/10 text-indigo-500"}`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-red-500 font-medium">
            Warning: Do not share this key in public repositories.
          </p>
        </div>
      </div>
    </div>
  );
}