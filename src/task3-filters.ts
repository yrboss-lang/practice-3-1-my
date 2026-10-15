// Задание 3: Фильтрация
// Использование функций высшего порядка и предикатов для поиска данных

import { Book, BookFilter } from "./task1-types";

// фильтр по имени автора
export const filterByAuthor = (authorName: string): BookFilter => {
  return (book: Book) =>
    book.authors.some((author) =>
      author.toLowerCase().includes(authorName.toLowerCase())
    );
};

// фильтр по минимальному году издания
export const filterByMinYear = (year: number): BookFilter => {
  return (book: Book) => book.year !== undefined && book.year >= year;
};

// фильтр по минимальному рейтингу
export const filterByMinRating = (rating: number): BookFilter => {
  return (book: Book) => book.rating !== undefined && book.rating >= rating;
};

// Применение массива фильтров к массиву книг
export const applyFilters = (
  books: Book[],
  filters: BookFilter[]
): Book[] => {
  return books.filter((book) => filters.every((filter) => filter(book)));
};