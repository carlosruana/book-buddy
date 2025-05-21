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

const CARD_HEIGHT = 460;
const GAP = 24;
const CONTAINER_PADDING = 64;
const HEADER_HEIGHT = 200;
const MAX_WIDTH = 1280;
const MIN_VISIBLE_ROWS = 2;

const BREAKPOINTS = [
  { max: 640, columns: 1 },    // mobile
  { max: 868, columns: 2 },    // tablet
  { max: 1120, columns: 3 },   // laptop
  { max: Infinity, columns: 4 } // desktop
];

export const VirtualizedBookGrid = forwardRef<FixedSizeList, VirtualizedBookGridProps>((
  props,
  parentRef
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
  const contentAreaWidth = Math.min(windowSize.width - 64, MAX_WIDTH) - (CONTAINER_PADDING * 2);
  const breakpoint = BREAKPOINTS.find(bp => contentAreaWidth < bp.max);
  const columns = breakpoint ? breakpoint.columns : 1;
  const cardWidth = Math.floor((contentAreaWidth - (GAP * (columns - 1))) / columns);
  const gridWidth = (cardWidth * columns) + (GAP * (columns - 1));
  const rows = Math.ceil(totalItems / columns);
  const minHeight = (CARD_HEIGHT + GAP) * MIN_VISIBLE_ROWS;
  const availableHeight = windowSize.height - HEADER_HEIGHT - (CONTAINER_PADDING * 2);
  const listHeight = Math.max(minHeight, availableHeight);

  const Row: React.FC<ListChildComponentProps> = ({ index, style }) => {
    const startIndex = index * columns;
    const items_in_row = [];
    for (let i = 0; i < columns; i++) {
      const itemIndex = startIndex + i;
      if (itemIndex >= totalItems) break;
      items_in_row.push(
        <div key={i} style={{ width: cardWidth, height: CARD_HEIGHT, padding: '0 1px' }}>
          {isItemLoaded(itemIndex) && items[itemIndex] ? (
            <BookCard
              id={items[itemIndex].key.split('/').pop() || ''}
              title={items[itemIndex].title}
              author={items[itemIndex].author_name?.[0] || 'Unknown Author'}
              coverId={items[itemIndex].cover_i}
              publishYear={items[itemIndex].first_publish_year}
              cardWidth={cardWidth - 2}
              cardHeight={CARD_HEIGHT}
            />
          ) : (
            <BookCardSkeleton cardWidth={cardWidth - 2} cardHeight={CARD_HEIGHT} />
          )}
        </div>
      );
    }
    return (
      <div
        style={{
          ...style,
          width: gridWidth,
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, ${cardWidth}px)`,
          gap: GAP,
          boxSizing: 'border-box',
          padding: 0,
          margin: 0,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {items_in_row}
      </div>
    );
  };

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6">
          <span className="text-4xl">❌</span>
        </div>
        <p className="text-red-600 font-medium mb-2">{error}</p>
        <p className="text-stripe-text-subtle">Please try again later</p>
      </div>
    );
  }

  if (isLoading && items.length === 0) {
    return (
      <div style={{ width: '100%', maxWidth: MAX_WIDTH, margin: '0 auto', padding: `0 ${CONTAINER_PADDING}px` }}>
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, ${cardWidth}px)`,
            gap: GAP,
          }}
        >
          {Array.from({ length: columns * 2 }).map((_, i) => (
            <BookCardSkeleton key={i} cardWidth={cardWidth} cardHeight={CARD_HEIGHT} />
          ))}
        </div>
      </div>
    );
  }

  if (!isLoading && items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stripe-surface mb-6">
          <span className="text-4xl">📚</span>
        </div>
        <p className="text-lg text-stripe-text-subtle">No books found matching your search</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 0 }}>
      <div style={{ width: gridWidth, position: 'relative' }}>
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={rows}
          loadMoreItems={loadMoreItems}
          minimumBatchSize={columns * 2}
        >
          {({ onItemsRendered, ref: infiniteLoaderRef }) => {
            const listRefCallback = (listInstance: FixedSizeList | null) => {
              if (typeof infiniteLoaderRef === 'function') {
                infiniteLoaderRef(listInstance);
              } else if (infiniteLoaderRef) {
                (infiniteLoaderRef as { current: FixedSizeList | null }).current = listInstance;
              }
              if (typeof parentRef === 'function') {
                parentRef(listInstance);
              } else if (parentRef && parentRef.current !== undefined) {
                parentRef.current = listInstance;
              }
            };
            return (
              <List
                ref={listRefCallback}
                height={listHeight}
                itemCount={rows}
                itemSize={CARD_HEIGHT + GAP}
                width={gridWidth}
                onItemsRendered={onItemsRendered}
                className="scrollbar-thin scrollbar-thumb-stripe-border/60 scrollbar-track-stripe-surface hover:scrollbar-thumb-stripe-border/80"
                style={{ overflowX: 'hidden' }}
              >
                {Row}
              </List>
            );
          }}
        </InfiniteLoader>
      </div>
    </div>
  );
});

VirtualizedBookGrid.displayName = 'VirtualizedBookGrid'; 