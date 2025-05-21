import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addToReadingList, removeFromReadingList, isInReadingList } from '../../services/readingListStorage';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverId?: number;
  publishYear?: number;
  cardWidth: number;
  cardHeight: number;
}

export const BookCard: React.FC<BookCardProps> = ({ id, title, author, coverId, publishYear, cardWidth, cardHeight }) => {
  const [imageError, setImageError] = useState(false);
  const coreId = id.includes('/') ? id.split('/').pop() || id : id;
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(isInReadingList(coreId));
  }, [coreId]);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSaved) {
      removeFromReadingList(coreId);
      setIsSaved(false);
    } else {
      addToReadingList({ key: coreId, title, author_name: [author], cover_i: coverId, first_publish_year: publishYear });
      setIsSaved(true);
    }
  };

  const coverUrl = coverId && !imageError
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : '/placeholder-book.svg';

  const bookRouteKey = id.includes('/') ? id.split('/').pop() : id;
  const imageHeight = Math.round(cardHeight * 0.6);

  return (
    <Link 
      to={`/book/${bookRouteKey}`} 
      className="group block h-full"
      style={{ width: cardWidth, minWidth: cardWidth, maxWidth: cardWidth, height: cardHeight }}
    >
      <article className="h-full flex flex-col bg-white rounded-xl overflow-hidden
                       shadow-stripe-sm hover:shadow-stripe-lg
                       border border-stripe-border/10 hover:border-stripe-border/30
                       transform-gpu transition-all duration-300 ease-out"
               style={{ width: cardWidth, height: cardHeight }}>
        <div className="relative bg-stripe-surface flex items-center justify-center"
             style={{ width: cardWidth, height: imageHeight }}>
          <img 
            src={coverUrl} 
            alt={`Cover of ${title}`}
            onError={() => setImageError(true)}
            className={`w-full h-full ${!coverId || imageError ? 'object-contain p-4' : 'object-cover'}
                       transition-all duration-300 group-hover:scale-105 group-hover:brightness-105`}
            loading="lazy"
            style={{ borderRadius: 0 }}
          />
          <button
            onClick={handleToggleSave}
            className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-2 shadow hover:bg-white"
            aria-label={isSaved ? 'Remove from reading list' : 'Add to reading list'}
          >
            {isSaved ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="#e11d48" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#e11d48" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#e11d48" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z" />
              </svg>
            )}
          </button>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="flex flex-col flex-grow p-4" style={{ height: cardHeight - imageHeight }}>
          <h3 className="font-semibold text-base text-stripe-text line-clamp-2 mb-2 
                       group-hover:text-stripe-primary transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-stripe-text-secondary line-clamp-1 mb-3">
            {author}
          </p>
          {publishYear && (
            <div className="mt-auto pt-2 border-t border-stripe-border/10">
              <p className="text-sm text-stripe-text-subtle flex items-center">
                <svg className="w-4 h-4 mr-1.5 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Published {publishYear}
              </p>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}; 