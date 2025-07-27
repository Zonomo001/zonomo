'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import debounce from 'lodash.debounce'; // install lodash if not done

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  // Debounced search function (simulate API)
  const searchHandler = debounce(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    // Simulate API call
    const fakeResults = ['Salon Services', 'Cleaning', 'Plumbing', 'Electrical'].filter(item =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(fakeResults);
    setShowDropdown(true);
  }, 300);

  useEffect(() => {
    searchHandler(query);
    return () => searchHandler.cancel();
  }, [query]);

  const handleSelect = (item: string) => {
    router.push(`/products?query=${item}`);
    setShowDropdown(false);
  };

  return (
    <div className="py-2 px-4 md:px-6 relative max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none" />
        <input
          type="text"
          placeholder="Search services..."
          className="w-full rounded-md py-2 pl-10 pr-3 bg-white/10 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 transition focus:bg-white/15"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowDropdown(true)}
        />
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute mt-2 w-full bg-white/10 backdrop-blur rounded-md text-white shadow-lg">
          {results.map((item, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-white/20 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
