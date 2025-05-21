import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (query: string) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg 
              width="16"
              height="16"
              viewBox="0 0 20 20" 
              fill="currentColor"
              className={`${isFocused ? 'text-stripe-primary' : 'text-stripe-text-subtle'} transition-colors duration-200`}
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search by book title or author..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl
                     border border-stripe-border/60 
                     shadow-stripe-sm hover:shadow-stripe-md
                     focus:outline-none focus:border-stripe-primary focus:ring-4 focus:ring-stripe-primary/10
                     placeholder-stripe-text-subtle text-stripe-text
                     transition-all duration-200"
          />
        </div>
        <button
          type="submit"
          disabled={!searchQuery.trim()}
          className="px-6 py-3 bg-stripe-primary rounded-xl text-white font-medium
                   shadow-stripe-sm hover:shadow-stripe-md
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-stripe-primary
                   hover:bg-stripe-primary-dark transform-gpu hover:-translate-y-[1px]
                   focus:outline-none focus:ring-4 focus:ring-stripe-primary/20
                   transition-all duration-200"
        >
          Search Books
        </button>
      </div>
    </form>
  );
}; 