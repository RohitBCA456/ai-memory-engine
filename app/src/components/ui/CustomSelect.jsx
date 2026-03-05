import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({ label, value, options, onChange, icon: Icon, isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Find the label of the currently selected option
  const selectedLabel = options.find(opt => opt.value === value)?.label;

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300 min-w-[190px] ${
          isDarkMode 
            ? "bg-gray-900 border-gray-800 text-white hover:border-indigo-500 shadow-lg shadow-black/20" 
            : "bg-white border-gray-200 text-gray-900 hover:border-indigo-400 shadow-sm"
        }`}
      >
        <Icon size={16} className="text-indigo-500" />
        <span className="flex-1 text-sm text-left font-medium">
          {selectedLabel}
        </span>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Transparent Overlay to close on outside click */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          
          <ul className={`absolute z-20 mt-2 w-full rounded-xl border shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200 ${
            isDarkMode 
              ? "bg-gray-900 border-gray-800 shadow-black" 
              : "bg-white border-gray-200 shadow-gray-200"
          }`}>
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                  value === opt.value 
                    ? "bg-indigo-600 text-white font-semibold" 
                    : isDarkMode 
                      ? "hover:bg-gray-800 text-gray-300" 
                      : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}