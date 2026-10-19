import './styles.css';
import { Book } from './task1-types';
import { applyFilters, filterByAuthor, filterByMinYear } from './task3-filters';
import { createBookFromForm } from './task4-integration';
import { filterByTitle, sortBooks } from './task5-utils';
import { BookCatalog } from './task6-classes';
// TODO: Импортируем класс Wishlist
import { Wishlist } from './task7-wishlist';

// Каталог — экземпляр класса BookCatalog
let catalog = new BookCatalog('main', [
  { id: '1', title: 'TypeScript Guide', authors: ['John Doe'], year: 2024 },
  { id: '2', title: 'JavaScript Basics', authors: ['Jane Smith'], year: 2022 },
]);

// Восстановление каталога из localStorage
const saved = localStorage.getItem('catalog');
if (saved) {
  const parsed = JSON.parse(saved);
  catalog = new BookCatalog(parsed.id, parsed.books);
}

// Задание 4: Инициализация Wishlist с восстановлением из localStorage
const savedWishlist = localStorage.getItem('wishlist');
const initialIds = savedWishlist ? JSON.parse(savedWishlist) : [];
const wishlist = new Wishlist(initialIds);

// сохранение в localStorage
function saveCatalog() {
  localStorage.setItem('catalog', JSON.stringify({
    id: catalog.id,
    books: catalog.getBooks(),
  }));
}

// Задание 4: сохранение вишлиста
function saveWishlist() {
  localStorage.setItem('wishlist', JSON.stringify(wishlist.getIds()));
}

// DOM-элементы
const bookList = document.querySelector('#bookList') as HTMLDivElement;
const form = document.querySelector('#bookForm') as HTMLFormElement;
const filterBtn = document.querySelector('#applyFilters') as HTMLButtonElement;
const authorInput = document.querySelector('#filterAuthor') as HTMLInputElement;
const yearInput = document.querySelector('#filterYear') as HTMLInputElement;
const errorMessage = document.querySelector('#errorMessage') as HTMLDivElement;
const searchInput = document.querySelector('#searchInput') as HTMLInputElement;
const sortBySelect = document.querySelector('#sortBy') as HTMLSelectElement;
const wishlistContainer = document.querySelector('#wishlistContainer') as HTMLDivElement;

// Задание 3: Выносим создание карточки в отдельную функцию
function createBookCard(book: Book): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'book-card';

  const titleEl = document.createElement('h3');
  titleEl.textContent = `${book.title} — ${book.authors.join(', ')}${book.year ? `, ${book.year}` : ''}`;
  card.append(titleEl);

  if (book.rating !== undefined) {
    const ratingEl = document.createElement('p');
    ratingEl.textContent = `Рейтинг: ${book.rating}`;
    card.append(ratingEl);
  }

  // Кнопка «Удалить»
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Удалить';
  deleteBtn.addEventListener('click', () => {
    catalog.removeBook(book.id);
    saveCatalog();
    // Перерисовываем и каталог, и вишлист (так как книга могла быть в избранном)
    renderBooks(catalog.getBooks());
    renderWishlist();
  });
  card.append(deleteBtn);

  // Задание 2: Кнопка «Избранное»
  const favBtn = document.createElement('button');
  // Проверяем, в избранном ли книга
  favBtn.textContent = wishlist.has(book.id) ? '❤️ В избранном' : '🤍 В избранное';
  favBtn.addEventListener('click', () => {
    wishlist.toggle(book.id);
    saveWishlist();
    // Перерисовываем основной список (чтобы обновить текст кнопки) и вишлист
    renderBooks(catalog.getBooks());
    renderWishlist();
  });
  card.append(favBtn);

  return card;
}

// Отрисовка каталога
function renderBooks(books: Book[]) {
  bookList.innerHTML = '';

  if (books.length === 0) {
    bookList.textContent = 'Книги не найдены. Попробуйте изменить фильтры.';
    return;
  }

  books.forEach(book => {
    bookList.append(createBookCard(book));
  });
}

// Задание 3: Отрисовка блока «Избранное»
function renderWishlist() {
  wishlistContainer.innerHTML = '';
  
  // Зависимость: получаем полные объекты книг из каталога через параметр
  const favBooks = wishlist.getFavorites(catalog);

  if (favBooks.length === 0) {
    wishlistContainer.textContent = 'Пока ничего не добавлено';
    return;
  }

  favBooks.forEach(book => {
    // Переиспользуем функцию создания карточки
    wishlistContainer.append(createBookCard(book));
  });
}

// Первичная отрисовка
renderBooks(catalog.getBooks());
renderWishlist();

// обработчик формы
form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorMessage.textContent = '';
  try {
    const formData = new FormData(form);
    const newBook = createBookFromForm(formData);

    catalog.addBook(newBook);
    saveCatalog();
    form.reset();

    renderBooks(catalog.getBooks());
    // Вишлист не меняется при добавлении новой книги, но для порядка можно вызвать
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.textContent = error.message;
    }
  }
});

// фильтры и сортировка
function refreshList() {
  const filters: ((book: Book) => boolean)[] = [];

  if (authorInput.value.trim()) filters.push(filterByAuthor(authorInput.value.trim()));
  if (yearInput.value) filters.push(filterByMinYear(parseInt(yearInput.value, 10)));
  if (searchInput.value.trim()) filters.push(filterByTitle(searchInput.value.trim()));

  const allBooks = catalog.getBooks();
  const filteredBooks = applyFilters(allBooks, filters);

  renderBooks(sortBooks(filteredBooks, sortBySelect.value as 'year' | 'rating'));
}

filterBtn.addEventListener('click', refreshList);
searchInput.addEventListener('input', refreshList);
sortBySelect.addEventListener('change', refreshList);