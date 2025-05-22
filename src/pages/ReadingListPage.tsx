import { useState, useEffect } from 'react';
import { getReadingList } from '../services/readingListStorage';
import { VirtualizedBookGrid } from '../components/Books/VirtualizedBookGrid';
import type { BookSearchResult } from '../services/api';

export default function ReadingListPage() {
  const [books, setBooks] = useState<BookSearchResult[]>([]);

  useEffect(() => {
    const update = () => setBooks(getReadingList());
    update(); // initial load
    window.addEventListener('reading-list-changed', update);
    return () => window.removeEventListener('reading-list-changed', update);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-stripe-primary via-purple-600 to-stripe-primary bg-clip-text text-transparent animate-gradient bg-300% leading-tight">
          Your Reading List
        </h1>
        <p className="text-lg sm:text-xl text-stripe-text-secondary mb-12 max-w-xl mx-auto">
          All your saved books in one place.
        </p>
      </div>
      {books.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stripe-surface mb-6">
            <span className="text-4xl">📚</span>
          </div>
          <p className="text-lg text-stripe-text-subtle">Your reading list is empty.</p>
        </div>
      ) : (
        <div>
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl border border-stripe-border/10 shadow-xl overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-hidden">
              <VirtualizedBookGrid
                items={books}
                totalItems={books.length}
                loadedItemsCount={books.length}
                isItemLoaded={() => true}
                loadMoreItems={() => Promise.resolve()}
                isLoading={false}
                error={null}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 