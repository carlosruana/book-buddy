import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FixedSizeList as ReactWindowList } from 'react-window';
import { SearchForm } from '../components/Search/SearchForm';
import { VirtualizedBookGrid } from '../components/Books/VirtualizedBookGrid';
import { searchBooks, type BookSearchResult } from '../services/api';
import { BookDetailsPage } from './BookDetailsPage';

export function BookSearchPage() {
  const { bookKey } = useParams<{ bookKey: string }>();

  useEffect(() => {
    console.log('BookSearchPage Instance MOUNTED');
    // Optional: Log when bookKey changes to see render cycles
    // console.log(`BookSearchPage re-rendered, bookKey: ${bookKey}`);
    return () => {
      console.log('BookSearchPage Instance UNMOUNTED');
    };
  }, []);

  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');
  const gridRef = useRef<ReactWindowList | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentQuery(query);
      setSearchResults([]);
      setTotalItems(0);
      if (gridRef.current && typeof gridRef.current.scrollTo === 'function') {
        gridRef.current.scrollTo(0); // Reset scroll on new search
      }
      const response = await searchBooks({ query });
      setSearchResults(response.docs);
      setTotalItems(response.numFound);
    } catch (err) {
      setError('Failed to search books. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const isItemLoaded = (index: number) => {
    return index < searchResults.length;
  };

  const loadMoreItems = async (startIndex: number, stopIndex: number) => {
    if (!currentQuery || isLoading || searchResults.length >= totalItems) return;
    try {
      setIsLoading(true);
      const itemsPerPage = stopIndex - startIndex + 1;
      const page = Math.floor(startIndex / itemsPerPage) + 1;
      const response = await searchBooks({ 
        query: currentQuery,
        page,
        limit: itemsPerPage
      });
      setSearchResults(prev => [...prev, ...response.docs]);
    } catch (err) {
      console.error('Error loading more items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Search List Part - always in DOM, visibility controlled by CSS */}
      <div style={{ display: bookKey ? 'none' : 'block' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-stripe-primary via-purple-600 to-stripe-primary bg-clip-text text-transparent
                        animate-gradient bg-300% leading-tight">
              Discover Your Next Literary Adventure
            </h1>
            <p className="text-lg sm:text-xl text-stripe-text-secondary mb-12 max-w-xl mx-auto">
              Search through millions of books to find stories that will transport you to new worlds
            </p>
            <div className="bg-white/50 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-stripe-border/10">
              <SearchForm onSearch={handleSearch} />
            </div>
          </div>
          
          {error && (
            <div className="max-w-xl mx-auto mb-12">
              <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-xl text-center
                            shadow-sm backdrop-blur-sm">
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}

          {(searchResults.length > 0 || (isLoading && currentQuery)) && (
            <div>
              <div className="mb-8 text-stripe-text-secondary text-center">
                <span className="font-medium text-stripe-text">{totalItems.toLocaleString()}</span> books found for "{currentQuery}"
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-3xl border border-stripe-border/10 p-6 sm:p-8 shadow-xl">
                <VirtualizedBookGrid
                  ref={gridRef}
                  items={searchResults}
                  totalItems={totalItems}
                  isItemLoaded={isItemLoaded}
                  loadMoreItems={loadMoreItems}
                  isLoading={isLoading}
                  error={null}
                />
              </div>
            </div>
          )}

          {!isLoading && !error && searchResults.length === 0 && currentQuery && (
            <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stripe-surface mb-6">
                <span className="text-4xl">😕</span>
                </div>
                <p className="text-lg text-stripe-text-subtle">
                No books found for "{currentQuery}". Try a different search.
                </p>
            </div>
          )}

          {!isLoading && !error && searchResults.length === 0 && !currentQuery && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stripe-surface mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <p className="text-lg text-stripe-text-subtle">
                Start your journey by searching for books above
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Book Details Part - rendered if bookKey exists */}
      {bookKey && <BookDetailsPage />}
    </>
  );
} 