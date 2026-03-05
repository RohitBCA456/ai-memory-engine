import React from 'react';
import { Trash2, ShieldCheck, Clock, FileText, Calendar, BrainCircuit } from 'lucide-react';

export default function MemoryTable({ data, onDelete, isDarkMode }) {
  return (
    <div className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
      isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead className={isDarkMode ? "bg-gray-800/50" : "bg-gray-50"}>
            <tr>
              <th className={`p-4 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                <div className="flex items-center gap-2"><BrainCircuit size={14} /> Storage Type</div>
              </th>
              <th className={`p-4 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                <div className="flex items-center gap-2"><FileText size={14} /> Content Preview</div>
              </th>
              <th className={`p-4 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                <div className="flex items-center gap-2"><Calendar size={14} /> Created At</div>
              </th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className={`divide-y ${isDarkMode ? "divide-gray-800" : "divide-gray-100"}`}>
            {data.length > 0 ? (
              data.map((item) => (
                <tr 
                  key={item._id || item.id} 
                  className={`transition-colors ${isDarkMode ? "hover:bg-gray-800/40" : "hover:bg-gray-50"}`}
                >
                  {/* Type Badge */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      item.type === 'long-term' 
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-500" 
                        : "bg-purple-500/10 border-purple-500/20 text-purple-500"
                    }`}>
                      {item.type === 'long-term' ? <ShieldCheck size={12} /> : <Clock size={12} />}
                      {item.type === 'long-term' ? "MongoDB" : "Redis"}
                    </span>
                  </td>

                  {/* Content Preview */}
                  <td className={`p-4 text-sm max-w-md truncate ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {item.content}
                  </td>

                  {/* Timestamp */}
                  <td className={`p-4 text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                    {new Date(item.createdAt).toLocaleString()}
                  </td>

                  {/* Delete Action */}
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => onDelete(item._id || item.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      title="Delete Memory"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-12 text-center text-gray-500">
                  No memories found in the engine.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}