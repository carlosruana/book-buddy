import React from 'react';

export const BookCardSkeleton: React.FC = () => {
  return (
    <div className="h-[480px] flex flex-col bg-white rounded-2xl overflow-hidden
                  shadow-stripe-sm border border-stripe-border/10 animate-pulse">
      <div className="relative pb-[142%] bg-stripe-surface">
        <div className="absolute inset-0 bg-stripe-border/10" />
      </div>
      <div className="flex flex-col flex-grow p-5 space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-stripe-border/10 rounded-lg w-4/5" />
          <div className="h-6 bg-stripe-border/10 rounded-lg w-2/3" />
        </div>
        <div className="h-5 bg-stripe-border/10 rounded-lg w-1/2" />
        <div className="mt-auto pt-3 border-t border-stripe-border/10">
          <div className="h-4 bg-stripe-border/10 rounded-lg w-1/3" />
        </div>
      </div>
    </div>
  );
}; 