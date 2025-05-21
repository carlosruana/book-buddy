import React from 'react';

interface BookCardSkeletonProps {
  cardWidth: number;
  cardHeight: number;
}

export const BookCardSkeleton: React.FC<BookCardSkeletonProps> = ({ cardWidth, cardHeight }) => {
  const imageHeight = Math.round(cardHeight * 0.6);
  return (
    <div
      className="flex flex-col bg-white rounded-xl overflow-hidden shadow-stripe-sm border border-stripe-border/10 animate-pulse"
      style={{ width: cardWidth, minWidth: cardWidth, maxWidth: cardWidth, height: cardHeight }}
    >
      <div
        className="relative bg-stripe-surface"
        style={{ width: cardWidth, height: imageHeight }}
      >
        <div className="absolute inset-0 bg-stripe-border/10" />
      </div>
      <div className="flex flex-col flex-grow p-4 space-y-4" style={{ height: cardHeight - imageHeight }}>
        <div className="space-y-2">
          <div className="h-6 bg-stripe-border/10 rounded-lg w-4/5" />
          <div className="h-6 bg-stripe-border/10 rounded-lg w-2/3" />
        </div>
        <div className="h-5 bg-stripe-border/10 rounded-lg w-1/2" />
        <div className="mt-auto pt-2 border-t border-stripe-border/10">
          <div className="h-4 bg-stripe-border/10 rounded-lg w-1/3" />
        </div>
      </div>
    </div>
  );
}; 