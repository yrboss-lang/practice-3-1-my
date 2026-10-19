import { Book } from './task1-types';
import { BookCatalog } from './task6-classes';

export class Wishlist {

  private favoriteIds: string[] = [];

  constructor(initialIds: string[] = []) {
    this.favoriteIds = initialIds;
  }

  toggle(id: string): void {
    if (this.has(id)) {
      this.favoriteIds = this.favoriteIds.filter(favId => favId !== id);
    } else {
      this.favoriteIds = [...this.favoriteIds, id];
    }
  }

  has(id: string): boolean {
    return this.favoriteIds.includes(id);
  }

  getFavorites(catalog: BookCatalog): Book[] {
    const allBooks = catalog.getBooks();
    // Возвращаем книги в порядке их появления в каталоге
    return allBooks.filter(book => this.has(book.id));
  }

  get count(): number {
    return this.favoriteIds.length;
  }

  getIds(): string[] {
    return [...this.favoriteIds];
  }
}