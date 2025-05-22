import { addToReadingList, removeFromReadingList, getReadingList, isInReadingList, READING_LIST_KEY } from '../readingListStorage';

describe('readingListStorage', () => {
  const mockBook = {
    key: 'test-book-1',
    title: 'Test Book',
    author_name: ['Test Author'],
    cover_i: 12345,
    first_publish_year: 2020
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Mock the storage event
    window.dispatchEvent = jest.fn();
  });

  describe('addToReadingList', () => {
    it('adds a book to an empty reading list', () => {
      addToReadingList(mockBook);
      
      const storedBooks = JSON.parse(localStorage.getItem(READING_LIST_KEY) || '[]');
      expect(storedBooks).toHaveLength(1);
      expect(storedBooks[0]).toEqual(mockBook);
    });

    it('adds a book to an existing reading list', () => {
      const existingBook = { ...mockBook, key: 'test-book-2' };
      localStorage.setItem(READING_LIST_KEY, JSON.stringify([existingBook]));

      addToReadingList(mockBook);
      
      const storedBooks = JSON.parse(localStorage.getItem(READING_LIST_KEY) || '[]');
      expect(storedBooks).toHaveLength(2);
      expect(storedBooks).toContainEqual(mockBook);
      expect(storedBooks).toContainEqual(existingBook);
    });

    it('does not add duplicate books', () => {
      addToReadingList(mockBook);
      addToReadingList(mockBook);
      
      const storedBooks = JSON.parse(localStorage.getItem(READING_LIST_KEY) || '[]');
      expect(storedBooks).toHaveLength(1);
      expect(storedBooks[0]).toEqual(mockBook);
    });

    it('dispatches storage event when adding a book', () => {
      addToReadingList(mockBook);
      
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'reading-list-changed'
        })
      );
    });
  });

  describe('removeFromReadingList', () => {
    beforeEach(() => {
      localStorage.setItem(READING_LIST_KEY, JSON.stringify([mockBook]));
    });

    it('removes a book from the reading list', () => {
      removeFromReadingList(mockBook.key);
      
      const storedBooks = JSON.parse(localStorage.getItem(READING_LIST_KEY) || '[]');
      expect(storedBooks).toHaveLength(0);
    });

    it('handles removing non-existent books', () => {
      removeFromReadingList('non-existent-key');
      
      const storedBooks = JSON.parse(localStorage.getItem(READING_LIST_KEY) || '[]');
      expect(storedBooks).toHaveLength(1);
      expect(storedBooks[0]).toEqual(mockBook);
    });

    it('dispatches storage event when removing a book', () => {
      removeFromReadingList(mockBook.key);
      
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'reading-list-changed'
        })
      );
    });
  });

  describe('getReadingList', () => {
    it('returns an empty array when no books are stored', () => {
      const result = getReadingList();
      expect(result).toEqual([]);
    });

    it('returns stored books', () => {
      localStorage.setItem(READING_LIST_KEY, JSON.stringify([mockBook]));
      
      const result = getReadingList();
      expect(result).toEqual([mockBook]);
    });

    it('handles invalid JSON in localStorage', () => {
      localStorage.setItem(READING_LIST_KEY, 'invalid-json');
      
      const result = getReadingList();
      expect(result).toEqual([]);
    });
  });

  describe('isInReadingList', () => {
    it('returns true for books in the reading list', () => {
      localStorage.setItem(READING_LIST_KEY, JSON.stringify([mockBook]));
      
      const result = isInReadingList(mockBook.key);
      expect(result).toBe(true);
    });

    it('returns false for books not in the reading list', () => {
      const result = isInReadingList('non-existent-key');
      expect(result).toBe(false);
    });
  });
}); 