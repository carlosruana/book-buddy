import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FixedSizeList as ReactWindowList } from 'react-window';
import { SearchForm } from '../components/Search/SearchForm';
import { VirtualizedBookGrid } from '../components/Books/VirtualizedBookGrid';
import { searchBooks, type BookSearchResult } from '../services/api';
import { BookDetailsPage } from './BookDetailsPage';

const ITEMS_PER_PAGE = 20;

export function BookSearchPage() {
  const { bookKey } = useParams<{ bookKey: string }>();

  // Listen for reading list changes (for cross-tab and cross-component updates)
  useEffect(() => {
    const handler = () => setSearchResults(r => [...r]); // force re-render
    window.addEventListener('reading-list-changed', handler);
    return () => window.removeEventListener('reading-list-changed', handler);
  }, []);

  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');
  const gridRef = useRef<ReactWindowList | null>(null);
  const [loadedItemsCount, setLoadedItemsCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const pendingRequestRef = useRef<{ start: number; end: number } | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentQuery(query);
      setSearchResults([]);
      setTotalItems(0);
      setLoadedItemsCount(0);
      if (gridRef.current && typeof gridRef.current.scrollTo === 'function') {
        gridRef.current.scrollTo(0); // Reset scroll on new search
      }
      console.log('Initial search:', { query, limit: 20, offset: 0 });
      const response = await searchBooks({ query, limit: 20, offset: 0 });
      // Pre-fill the array with undefined to the total number of items
      const initialResults = new Array(response.numFound);
      response.docs.forEach((doc, i) => {
        initialResults[i] = doc;
      });
      setSearchResults(initialResults);
      setTotalItems(response.numFound);
      setLoadedItemsCount(response.docs.length);
      console.log('Initial search complete:', { 
        docsLoaded: response.docs.length,
        totalItems: response.numFound 
      });
    } catch (err) {
      setError('Failed to search books. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const isItemLoaded = (index: number) => {
    return !!searchResults[index];
  };

  const loadMoreItems = async (startIndex: number, stopIndex: number) => {
    console.log('loadMoreItems called with:', { startIndex, stopIndex, currentLoadedItems: loadedItemsCount });
    
    if (!currentQuery || isLoading || isLoadingMore) {
      console.log('Skipping loadMoreItems:', { 
        hasQuery: !!currentQuery, 
        isLoading,
        isLoadingMore,
        loadedItemsCount, 
        totalItems 
      });
      return;
    }

    // If we're already at or beyond the total items, don't load more
    if (loadedItemsCount >= totalItems) {
      console.log('Already loaded all items:', { loadedItemsCount, totalItems });
      return;
    }

    // Calculate which page we need based on the startIndex
    const pageSize = ITEMS_PER_PAGE;
    const nextPage = Math.floor(startIndex / pageSize);
    const offset = nextPage * pageSize;

    // If we already have this page loaded, skip
    if (offset < loadedItemsCount) {
      console.log('Page already loaded:', {
        offset,
        loadedItemsCount,
        nextPage
      });
      return;
    }

    try {
      setIsLoadingMore(true);
      console.log('Loading page:', {
        page: nextPage,
        offset,
        pageSize,
        currentLoaded: loadedItemsCount
      });

      const response = await searchBooks({
        query: currentQuery,
        limit: pageSize,
        offset
      });

      if (response.docs.length === 0) {
        console.log('No more items to load');
        return;
      }

      console.log('Loaded new items:', {
        newItems: response.docs.length,
        offset,
        totalLoaded: loadedItemsCount + response.docs.length
      });

      setSearchResults(prev => {
        const updated = [...prev];
        response.docs.forEach((doc, i) => {
          updated[offset + i] = doc;
        });
        return updated;
      });
      setLoadedItemsCount(prev => prev + response.docs.length);
    } catch (err) {
      console.error('Error loading more items:', err);
    } finally {
      setIsLoadingMore(false);
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

          {isLoading && currentQuery && searchResults.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stripe-surface mb-6">
                <div className="w-10 h-10 border-4 border-stripe-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-lg text-stripe-text-subtle">
                Searching for "{currentQuery}"...
              </p>
            </div>
          )}

          {(searchResults.length > 0 || (isLoading && searchResults.length > 0)) && (
            <div>
              <div className="mb-8 text-stripe-text-secondary text-center">
                <span className="font-medium text-stripe-text">{totalItems.toLocaleString()}</span> books found for "{currentQuery}"
                {loadedItemsCount < totalItems && (
                  <span className="text-stripe-text-subtle ml-2">
                    (Showing {loadedItemsCount} of {totalItems.toLocaleString()})
                  </span>
                )}
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-3xl border border-stripe-border/10 p-6 sm:p-8 shadow-xl">
                <VirtualizedBookGrid
                  ref={gridRef}
                  items={searchResults}
                  totalItems={totalItems}
                  loadedItemsCount={loadedItemsCount}
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