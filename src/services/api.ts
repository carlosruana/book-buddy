import axios from 'axios';

const BASE_URL = 'https://openlibrary.org';

export interface BookSearchResult {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
}

export interface SearchResponse {
  numFound: number;
  start: number;
  docs: BookSearchResult[];
}

export interface BookDetailsResult {
  title: string;
  authors?: Array<{ name: string; key: string; /* Other potential author fields */ }>;
  covers?: number[];
  description?: string | { type: string; value: string };
  subjects?: string[];
  subject_places?: string[];
  subject_people?: string[];
  subject_times?: string[];
  first_publish_date?: string; // Sometimes available as a string
  // Add other fields you might need from the /works/{OLID}.json endpoint
}

export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
}

export const searchBooks = async ({ query, page = 1, limit = 20 }: SearchParams): Promise<SearchResponse> => {
  try {
    const offset = (page - 1) * limit;
    const response = await axios.get(`${BASE_URL}/search.json`, {
      params: {
        q: query,
        fields: 'key,title,author_name,cover_i,first_publish_year',
        limit,
        offset,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

export const getBookDetails = async (bookId: string): Promise<BookDetailsResult> => {
  try {
    // The bookId from search results is typically like "/works/OL45804W"
    // We need to ensure we're passing just "OL45804W" to the API if that's what it expects,
    // or the full path if the function handles it. The current function seems to expect just the ID.
    const actualBookId = bookId.startsWith('/works/') ? bookId.split('/').pop() : bookId;
    const response = await axios.get(`${BASE_URL}/works/${actualBookId}.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
}; 