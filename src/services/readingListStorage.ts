import type { BookSearchResult } from './api';

export const READING_LIST_KEY = 'bookbuddy_reading_list';

function dispatchChange() {
  window.dispatchEvent(new Event('reading-list-changed'));
}

export function getReadingList(): BookSearchResult[] {
  try {
    const raw = localStorage.getItem(READING_LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReadingList(list: BookSearchResult[]): void {
  localStorage.setItem(READING_LIST_KEY, JSON.stringify(list));
  dispatchChange();
}

export function addToReadingList(book: BookSearchResult): void {
  const list = getReadingList();
  if (!list.find((b: BookSearchResult) => b.key === book.key)) {
    list.push(book);
    saveReadingList(list);
  }
}

export function removeFromReadingList(bookKey: string): void {
  const list = getReadingList().filter((b: BookSearchResult) => b.key !== bookKey);
  saveReadingList(list);
}

export function isInReadingList(bookKey: string): boolean {
  return !!getReadingList().find((b: BookSearchResult) => b.key === bookKey);
} 