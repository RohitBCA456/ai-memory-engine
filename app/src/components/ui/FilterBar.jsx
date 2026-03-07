import React from 'react';
import { Database, SortDesc } from 'lucide-react';
import CustomSelect from './CustomSelect.jsx';

export default function FilterBar({ typeFilter, setTypeFilter, timeSort, setTimeSort, isDarkMode }) {

const storageOptions = [
  { label: "All Storage", value: "all" },
  { label: "MongoDB", value: "mongodb" },
  { label: "Redis", value: "redis" },
];

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4">
      <CustomSelect 
        value={typeFilter}
        options={storageOptions}
        onChange={setTypeFilter}
        icon={Database}
        isDarkMode={isDarkMode}
      />
      <CustomSelect 
        value={timeSort}
        options={sortOptions}
        onChange={setTimeSort}
        icon={SortDesc}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}