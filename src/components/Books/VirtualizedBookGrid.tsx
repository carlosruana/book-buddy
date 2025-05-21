import React, { useCallback, forwardRef } from 'react';
import { FixedSizeList as List, type FixedSizeList } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { BookCard } from './BookCard';
import { BookCardSkeleton } from './BookCardSkeleton';
import type { BookSearchResult } from '../../services/api';
import useWindowSize from '../../hooks/useWindowSize';

interface VirtualizedBookGridProps {
  items: BookSearchResult[];
  totalItems: number;
  isItemLoaded: (index: number) => boolean;
  loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const CARD_HEIGHT = 480;
const GAP = 24;
const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1024;
const GRID_PADDING = 24;
const MAX_WIDTH = 1280;

export const VirtualizedBookGrid = forwardRef<FixedSizeList, VirtualizedBookGridProps>((
  props,
  parentRef // This is gridRef from BookSearchPage
) => {
  const {
    items,
    totalItems,
    isItemLoaded,
    loadMoreItems,
    isLoading = false,
    error = null,
  } = props;
  
  const windowSize = useWindowSize();
  
  const getColumnsForWidth = useCallback((width: number) => {
    if (width < MOBILE_BREAKPOINT) return 1;
    if (width < TABLET_BREAKPOINT) return 3;
    return 4;
  }, []);

  const columns = getColumnsForWidth(windowSize.width);
  const rows = Math.ceil(totalItems / columns);
  const gridWidth = windowSize.width < MAX_WIDTH ? windowSize.width - GRID_PADDING : MAX_WIDTH - GRID_PADDING;
  const columnWidth = (gridWidth - (GAP * (columns - 1))) / columns;

  const Row: React.FC<ListChildComponentProps> = ({ index, style }) => {
    const items_in_row = [];
    const startIndex = index * columns;
    for (let i = 0; i < columns; i++) {
      const itemIndex = startIndex + i;
      if (itemIndex >= totalItems) break;
      const loaded = isItemLoaded(itemIndex);
      const item = items[itemIndex];
      items_in_row.push(
        <div key={i} style={{ width: columnWidth }} className={`transform hover:scale-[1.02] transition-transform duration-200 ${i < columns - 1 ? 'mr-6' : ''}`}>
          {loaded && item ? (
            <BookCard id={item.key.split('/').pop() || ''} title={item.title} author={item.author_name?.[0] || 'Unknown Author'} coverId={item.cover_i} publishYear={item.first_publish_year} />
          ) : (<BookCardSkeleton />)}
        </div>
      );
    }
    return (<div style={{ ...style, display: 'flex' }}>{items_in_row}</div>);
  };
  
  if (error) {
    return <div className="text-center py-16"><div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6"><span className="text-4xl">❌</span></div><p className="text-red-600 font-medium mb-2">{error}</p><p className="text-stripe-text-subtle">Please try again later</p></div>;
  }
  if (isLoading && items.length === 0) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{Array.from({ length: 12 }).map((_, i) => (<div key={i} className="transform hover:scale-[1.02] transition-transform duration-200"><BookCardSkeleton /></div>))}</div>;
  }
  if (!isLoading && items.length === 0) {
    return <div className="text-center py-16"><div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stripe-surface mb-6"><span className="text-4xl">📚</span></div><p className="text-lg text-stripe-text-subtle">No books found matching your search</p></div>;
  }

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={totalItems}
      loadMoreItems={loadMoreItems}
      minimumBatchSize={columns * 2} 
    >
      {({ onItemsRendered, ref: infiniteLoaderRef }) => {
        const listRefCallback = (listInstance: FixedSizeList | null) => {
          // 1. Satisfy InfiniteLoader's ref
          if (typeof infiniteLoaderRef === 'function') {
            infiniteLoaderRef(listInstance);
          } else if (infiniteLoaderRef) { 
            (infiniteLoaderRef as { current: FixedSizeList | null }).current = listInstance;
          }

          // 2. Satisfy the parent's forwarded ref (gridRef)
          if (typeof parentRef === 'function') {
            parentRef(listInstance);
          } else if (parentRef && parentRef.current !== undefined) { 
            // Check parentRef.current !== undefined is a way to hint it's a MutableRefObject
            // and not just null. A more robust check might be `Object.prototype.hasOwnProperty.call(parentRef, 'current')`
            // but that's overly complex for typical React useRef usage.
            parentRef.current = listInstance;
          }
        };

        return (
          <List
            ref={listRefCallback}
            height={windowSize.height - 300}
            itemCount={rows}
            itemSize={CARD_HEIGHT + GAP}
            width={gridWidth}
            onItemsRendered={onItemsRendered}
          >
            {Row}
          </List>
        );
      }}
    </InfiniteLoader>
  );
});

VirtualizedBookGrid.displayName = 'VirtualizedBookGrid'; 