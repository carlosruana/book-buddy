import React from 'react';
import { Link } from 'react-router-dom';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverId?: number;
  publishYear?: number;
}

export const BookCard: React.FC<BookCardProps> = ({ id, title, author, coverId, publishYear }) => {
  const coverUrl = coverId 
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : '/placeholder-book.png';

  // Ensure we extract the core ID (e.g., OL45804W) from the key (e.g., /works/OL45804W)
  const bookRouteKey = id.includes('/') ? id.split('/').pop() : id;

  return (
    <Link 
      to={`/book/${bookRouteKey}`} 
      className="group block h-full"
    >
      <article className="h-full flex flex-col bg-white rounded-2xl overflow-hidden
                       shadow-stripe-sm hover:shadow-stripe-lg
                       border border-stripe-border/10 hover:border-stripe-border/30
                       transform-gpu transition-all duration-300 ease-out">
        <div className="relative pb-[142%] overflow-hidden bg-stripe-surface">
          <img 
            src={coverUrl} 
            alt={`Cover of ${title}`}
            className="absolute inset-0 w-full h-full object-cover object-center
                     transform-gpu transition-all duration-300 ease-out
                     group-hover:scale-105 group-hover:brightness-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="flex flex-col flex-grow p-5">
          <h3 className="font-semibold text-lg text-stripe-text line-clamp-2 mb-2 
                       group-hover:text-stripe-primary transition-colors duration-200">
            {title}
          </h3>
          <p className="text-base text-stripe-text-secondary line-clamp-1 mb-3">
            {author}
          </p>
          {publishYear && (
            <div className="mt-auto pt-3 border-t border-stripe-border/10">
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