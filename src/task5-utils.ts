// ============================================================
// Задание 5: Поиск и сортировка
// ============================================================
import { Book, BookFilter } from "./task1-types";
import { applyFilters } from "./task3-filters";

// ------------------------------------------------------------
// TODO 1: Фильтр по названию — такая же фабрика, как в Задании 3
// ------------------------------------------------------------
export const filterByTitle = (query: string): BookFilter => {
  return (book: Book) =>
    book.title.toLowerCase().includes(query.toLowerCase());
};

// ------------------------------------------------------------
// TODO 2 и TODO 3: Сортировка (новая самостоятельная функция)
// ------------------------------------------------------------
export function sortBooks(books: Book[], sortType: "year" | "rating"): Book[] {
  if (sortType === "year") {
    return [...books].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  }
  
  // Сортировка по рейтингу: от высокого к низкому (по убыванию)
  return [...books].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
}

// ------------------------------------------------------------
// TODO 4: Сборка (композиция). Новой логики здесь НЕТ!
// ------------------------------------------------------------
export function filterAndSortBooks(
  books: Book[],
  query: string,
  sortType: "year" | "rating"
): Book[] {
  const filtered = applyFilters(books, [filterByTitle(query)]);
  return sortBooks(filtered, sortType);
}