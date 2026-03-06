import React from 'react';
import { Trash2, ShieldCheck, Clock, FileText, Calendar, BrainCircuit } from 'lucide-react';

// src/components/ui/MemoryTable.jsx
export default function MemoryTable({ data, onDelete, isDarkMode }) {
  return (
    <div className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
      isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* ... Table Header (Keep existing code) ... */}
          <tbody className={`divide-y ${isDarkMode ? "divide-gray-800" : "divide-gray-100"}`}>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className={`transition-colors ${isDarkMode ? "hover:bg-gray-800/40" : "hover:bg-gray-50"}`}>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      item.storageType === 'MongoDB' 
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-500" 
                        : "bg-purple-500/10 border-purple-500/20 text-purple-500"
                    }`}>
                      {item.storageType === 'MongoDB' ? <ShieldCheck size={12} /> : <Clock size={12} />}
                      {item.storageType}
                    </span>
                  </td>

                  {/* Matches controller: contentPreview */}
                  <td className={`p-4 text-sm max-w-md truncate ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {item.contentPreview}
                  </td>

                  <td className={`p-4 text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                    {new Date(item.createdAt).toLocaleString()}
                  </td>

                  <td className="p-4 text-right">
                    <button onClick={() => onDelete(item.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="p-12 text-center text-gray-500">No memories found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}