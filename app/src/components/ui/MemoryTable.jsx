import React from 'react';
import { Trash2, ShieldCheck, Clock } from 'lucide-react';

export default function MemoryTable({ data, onDelete, isDarkMode }) {
  return (
    <div className={`w-full overflow-hidden rounded-xl md:rounded-2xl border transition-all duration-300 ${
      isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white shadow-sm"
    }`}>
      {/* This wrapper handles the horizontal scrolling on mobile */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className={isDarkMode ? "bg-gray-800/50" : "bg-gray-50"}>
            <tr>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Source</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Content</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Created</th>
              <th className="p-4 text-right"></th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? "divide-gray-800" : "divide-gray-100"}`}>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className={`transition-colors ${isDarkMode ? "hover:bg-gray-800/40" : "hover:bg-gray-50"}`}>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${
                      item.storageType === 'MongoDB' 
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-500" 
                        : "bg-purple-500/10 border-purple-500/20 text-purple-500"
                    }`}>
                      {item.storageType === 'MongoDB' ? <ShieldCheck size={10} /> : <Clock size={10} />}
                      {item.storageType}
                    </span>
                  </td>
                  
                  {/* Content column: increased truncation safety */}
                  <td className={`p-4 text-sm max-w-[200px] md:max-w-md truncate ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {item.contentPreview}
                  </td>

                  <td className={`p-4 text-xs whitespace-nowrap ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                    {new Date(item.createdAt).toLocaleDateString([], { hour: '2-digit', minute:'2-digit' })}
                  </td>

                  <td className="p-4 text-right">
                    <button 
                      onClick={() => onDelete(item.id)} 
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      aria-label="Delete memory"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="p-12 text-center text-gray-500 italic">No memories found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}