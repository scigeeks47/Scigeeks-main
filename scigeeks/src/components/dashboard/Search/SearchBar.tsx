"use client";

import React, { useState } from "react";
import { Search, Mic } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onVoiceSearch?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search courses, mentors, AI...",
  onSearch,
  onVoiceSearch,
}) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="relative w-full my-3">
      <div className="relative flex items-center w-full">
        <Search className="absolute left-4 w-4 h-4 text-neutral-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full h-12 pl-11 pr-11 bg-[#121212] border border-neutral-800/80 rounded-2xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-700 focus:ring-1 focus:ring-[#00E676]/40 transition-all duration-200 shadow-inner"
        />
        <button
          type="button"
          onClick={onVoiceSearch}
          aria-label="Voice search"
          className="absolute right-3.5 p-1 text-[#00E676] hover:text-[#33ef8f] hover:scale-110 active:scale-95 transition-all duration-150"
        >
          <Mic className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
