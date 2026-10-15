// Задание 1: Интерфейсы и типы
// Описание модели каталога книг

// TODO 1: Объявите интерфейс Book
export interface Book {
  readonly id: string;
  title: string;
  authors: string[];
  year?: number;
  rating?: number;
}


// Объявление типа Catalog как словаря: ключ — id книги, значение — Book
export type Catalog = Record<string, Book>;

// TODO 3: Объявите тип BookFilter как функцию, которая принимает Book и возвращает boolean
export type BookFilter = (book: Book) => boolean;

/**
 * @deprecated пока не используется, задел на фичу "Единое форматирование"
 */
// Функция formatBook(book: Book): string в формате: "Title (Year) — Authors"
export function formatBook(book: Book): string {
  const yearStr = book.year !== undefined ? ` (${book.year})` : "";
  const authorsStr = book.authors.join(", ");
  return `${book.title}${yearStr} — ${authorsStr}`;
}
/**
 * @deprecated пока не используется, задел на фичу "Статистика"
 */
// Функция calculateAverageYear(books: Book[]): number возвращает средний год издания. Если книг нет или у них нет года — вернуть 0.
export function calculateAverageYear(books: Book[]): number {
  const booksWithYear = books.filter((book) => book.year !== undefined);

  if (booksWithYear.length === 0) return 0;

  const sum = booksWithYear.reduce(
    // используем as number так как позже запретим предавать что-то кроме цифр 
    (acc, book) => acc + (book.year as number),
    0
  );

  return sum / booksWithYear.length;
}