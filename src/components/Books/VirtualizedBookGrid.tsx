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
  loadedItemsCount: number;
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
const MAX_BUFFER_ROWS = 4;
const VIRTUAL_WINDOW_SIZE = 100;
const ITEMS_PER_PAGE = 20;

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
    loadedItemsCount,
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
  
  const rowHeight = CARD_HEIGHT + GAP;
  const availableHeight = windowSize.height - HEADER_HEIGHT - (CONTAINER_PADDING * 2);
  const visibleRows = Math.floor(availableHeight / rowHeight);
  
  const totalRows = Math.ceil(totalItems / columns);
  const displayRows = Math.min(
    totalRows,
    visibleRows + MAX_BUFFER_ROWS
  );
  
  const listHeight = Math.max(
    rowHeight * MIN_VISIBLE_ROWS,
    Math.min(
      rowHeight * displayRows,
      availableHeight
    )
  );

  const virtualRows = Math.min(VIRTUAL_WINDOW_SIZE, totalRows);

  // Memoize the Row component to prevent unnecessary re-renders
  const Row = React.useMemo(() => {
    const RowComponent: React.FC<ListChildComponentProps> = ({ index, style }) => {
      const startIndex = index * columns;
      const items_in_row = [];
      
      for (let i = 0; i < columns; i++) {
        const itemIndex = startIndex + i;
        if (itemIndex >= totalItems) break;
        
        const isLoaded = isItemLoaded(itemIndex);
        const item = items[itemIndex];
        
        // Memoize each item in the row to prevent re-renders
        const itemContent = React.useMemo(() => {
          if (!isLoaded || !item) {
            return <BookCardSkeleton cardWidth={cardWidth} cardHeight={CARD_HEIGHT} />;
          }
          return (
            <BookCard
              id={item.key.split('/').pop() || ''}
              title={item.title}
              author={item.author_name?.[0] || 'Unknown Author'}
              coverId={item.cover_i}
              publishYear={item.first_publish_year}
              cardWidth={cardWidth}
              cardHeight={CARD_HEIGHT}
            />
          );
        }, [isLoaded, item, cardWidth]);

        items_in_row.push(
          <div key={i} style={{ width: cardWidth, height: CARD_HEIGHT }}>
            {itemContent}
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
          }}
        >
          {items_in_row}
        </div>
      );
    };
    return RowComponent;
  }, [columns, cardWidth, gridWidth, items, isItemLoaded, totalItems]);

  // Batch load more items
  const handleLoadMore = useCallback(async (startIndex: number, stopIndex: number) => {
    // Convert from row indices to item indices
    const firstVisibleItemIndex = startIndex * columns;
    const lastVisibleItemIndex = (stopIndex + 1) * columns - 1;

    // If we're already loading or have loaded all items, don't load more
    if (loadedItemsCount >= totalItems) {
      return Promise.resolve();
    }

    // Load more when approaching the end of loaded items
    // We want to load more when we're 2 rows away from the last loaded item
    const rowsBeforeLoad = 2;
    const itemsBeforeLoad = rowsBeforeLoad * columns;
    
    if (firstVisibleItemIndex > loadedItemsCount - itemsBeforeLoad) {
      // Calculate next batch to load
      const nextBatchStart = loadedItemsCount;
      const batchSize = ITEMS_PER_PAGE;

      console.log('Loading more items:', {
        firstVisibleItemIndex,
        lastVisibleItemIndex,
        loadedItemsCount,
        nextBatchStart,
        batchSize,
        columns,
        currentRow: startIndex,
        lastLoadedRow: Math.floor(loadedItemsCount / columns)
      });

      return loadMoreItems(
        nextBatchStart,
        Math.min(nextBatchStart + batchSize - 1, totalItems - 1)
      );
    }

    return Promise.resolve();
  }, [columns, loadedItemsCount, loadMoreItems, totalItems]);

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
    <div className="w-full flex justify-center relative overflow-hidden">
      <div className="relative w-full" style={{ maxWidth: gridWidth }}>
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={totalItems} // Use total items instead of rows
          loadMoreItems={handleLoadMore}
          minimumBatchSize={ITEMS_PER_PAGE}
          threshold={ITEMS_PER_PAGE / 2} // Load when halfway through the current page
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

            // Convert item-based indices to row-based for the List
            const handleItemsRendered = (props: any) => {
              const itemProps = {
                overscanStartIndex: props.overscanStartIndex * columns,
                overscanStopIndex: (props.overscanStopIndex + 1) * columns - 1,
                visibleStartIndex: props.visibleStartIndex * columns,
                visibleStopIndex: (props.visibleStopIndex + 1) * columns - 1,
              };
              onItemsRendered(itemProps);
            };

            return (
              <List
                ref={listRefCallback}
                height={listHeight}
                itemCount={virtualRows}
                itemSize={rowHeight}
                width={gridWidth}
                onItemsRendered={handleItemsRendered}
                className="scrollbar-thin scrollbar-thumb-stripe-border/60 scrollbar-track-stripe-surface hover:scrollbar-thumb-stripe-border/80"
                style={{ overflowX: 'hidden' }}
                overscanCount={2}
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