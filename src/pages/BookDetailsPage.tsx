import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookDetails, type BookDetailsResult } from '../services/api';
import { addToReadingList, removeFromReadingList, isInReadingList } from '../services/readingListStorage';

export function BookDetailsPage() {
  const { bookKey } = useParams<{ bookKey: string }>();
  const [bookDetails, setBookDetails] = useState<BookDetailsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (bookKey) {
      const fetchDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const details = await getBookDetails(bookKey);
          setBookDetails(details);
          // Use the core id for reading list
          const coreId = bookKey.includes('/') ? bookKey.split('/').pop() || bookKey : bookKey;
          setIsSaved(isInReadingList(coreId));
        } catch (err) {
          setError('Failed to fetch book details.');
          console.error(err);
        }
        setIsLoading(false);
      };
      fetchDetails();
    }
  }, [bookKey]);

  const handleToggleSave = () => {
    if (!bookDetails) return;
    const coreId = (bookKey && bookKey.includes('/') ? bookKey.split('/').pop() : bookKey) ?? '';
    if (isSaved) {
      removeFromReadingList(coreId);
      setIsSaved(false);
    } else {
      addToReadingList({
        key: coreId,
        title: bookDetails.title,
        author_name: bookDetails.authors?.map(a => a.name) || [],
        cover_i: bookDetails.covers?.[0],
        first_publish_year: bookDetails.first_publish_date ? parseInt(bookDetails.first_publish_date) : undefined
      });
      setIsSaved(true);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20">Loading book details...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  if (!bookDetails) {
    return <div className="text-center py-20">Book not found.</div>;
  }

  const getCoverUrl = (coverId?: number) => {
    return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : 'https://placehold.co/400x600.png?text=No+Cover';
  };
  
  const description = typeof bookDetails.description === 'string' ? bookDetails.description : bookDetails.description?.value;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-stripe-primary hover:text-stripe-primary-dark transition-colors duration-200 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Search Results
        </Link>
      </div>
      <div className="bg-white/60 backdrop-blur-lg shadow-xl rounded-3xl p-8 md:p-12 border border-stripe-border/10">
        <div className="md:flex">
          <div className="md:w-1/3 mb-8 md:mb-0 md:mr-8 text-center relative">
            <img 
              src={getCoverUrl(bookDetails.covers?.[0])} 
              alt={`Cover for ${bookDetails.title}`} 
              className="rounded-lg shadow-2xl mx-auto w-full max-w-xs object-cover aspect-[2/3] hover:shadow-stripe-primary/30 transition-shadow duration-300"
            />
            <button
              onClick={handleToggleSave}
              className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-2 shadow hover:bg-white"
              aria-label={isSaved ? 'Remove from reading list' : 'Add to reading list'}
            >
              {isSaved ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="#e11d48" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#e11d48" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#e11d48" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z" />
                </svg>
              )}
            </button>
          </div>
          <div className="md:w-2/3">
            <h1 className="text-3xl sm:text-4xl font-bold text-stripe-text mb-3 leading-tight">{bookDetails.title}</h1>
            
            {bookDetails.authors && bookDetails.authors.length > 0 && (
              <p className="text-xl text-stripe-text-secondary mb-6">
                by {bookDetails.authors.map(author => author.name).join(', ')}
              </p>
            )}

            {bookDetails.first_publish_date && (
              <p className="text-stripe-text-subtle mb-2">First Published: {bookDetails.first_publish_date}</p>
            )}
            
            {description && (
              <div className="mt-6 prose prose-stripe max-w-none text-stripe-text-secondary leading-relaxed">
                <h2 className="text-xl font-semibold text-stripe-text mb-2">Description</h2>
                <p>{description.substring(0,500)}{description.length > 500 ? '...' : ''}</p>
              </div>
            )}

            {bookDetails.subjects && bookDetails.subjects.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-stripe-text mb-3">Subjects</h2>
                <div className="flex flex-wrap gap-2">
                  {bookDetails.subjects.slice(0, 15).map((subject: string) => (
                    <span key={subject} className="bg-stripe-surface text-stripe-text-secondary px-3 py-1 rounded-full text-sm border border-stripe-border/20 shadow-sm">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 