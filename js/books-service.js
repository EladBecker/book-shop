'use strict';

const STORAGE_KEY = 'books';
const PAGE_SIZE = 4;
const gbooksTitles = [
    { name: 'Harry Potter and the Philosophers\'s Stone', img: 'hp1.jpg' },
    { name: 'Harry Potter and the Chamber of Secrets', img: 'hp2.jpg' },
    { name: 'Harry Potter and the Prisoner of Azkaban', img: 'hp3.jpg' },
    { name: 'Harry Potter and the Goblet of Fire', img: 'hp4.jpg' },
    { name: 'Harry Potter and the Order of the Phoenix', img: 'hp5.jpg' },
    { name: 'Harry Potter and the Half-Blood Prince', img: 'hp6.jpg' },
    { name: 'Harry Potter and the Deathly Hallows', img: 'hp7.jpg' }
]

var gBooks;
var gPageIdx = 0;

_createBooks();

function getCurrPage() {
    return gPageIdx + 1;
}

function getCurrPageBooks() {
    var displayIdx = PAGE_SIZE * gPageIdx;
    return gBooks.slice(displayIdx, displayIdx + PAGE_SIZE);
}

function changePage(diff) {
    gPageIdx += diff;
    if (gPageIdx >= gBooks.length / PAGE_SIZE) gPageIdx = 0;
    if (gPageIdx < 0) gPageIdx = Math.floor((gBooks.length - 1) / PAGE_SIZE);
}


function deleteBook(bookId) {
    var bookIdx = getBookIdxById(bookId);
    gBooks.splice(bookIdx, 1);
    _saveBooksToStorage();
}

function addBook(bookName, bookPrice, imgURL = 'hp1.jpg') {
    var newBook = _createBook(bookName, bookPrice, imgURL);
    // newBook.price = bookPrice;
    gBooks.unshift(newBook);
    _saveBooksToStorage();
}

function updateBook(bookId, bookPrice) {
    var bookIdx = getBookIdxById(bookId);
    gBooks[bookIdx].price = bookPrice;
    _saveBooksToStorage();
}

function getBookIdxById(bookId) {
    return gBooks.findIndex(function (book) {
        return book.id === bookId;
    });
}

function getbookById(bookId) {
    return gBooks.find(function (book) {
        return book.id === bookId;
    });
}

function updateRating(bookId, newRating) {
    if (newRating > 10 || newRating < 0) return;
    var bookIdx = getBookIdxById(bookId);
    gBooks[bookIdx].rate = newRating;
    _saveBooksToStorage();
}

function sortBy(byCol) {
    gBooks.sort(function (book, nextBook) {
        return (book[byCol] > nextBook[byCol]) ? 1 : -1;
    });
}

// -----------------------------------------------------------------------

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY);
    if (!books || !books.length) {
        books = [];
        for (var i = 0; i < 7; i++) {
            // var bookLib = gbooksTitles;
            var currBook = gbooksTitles[i];
            books.push(_createBook(currBook.name, getRandomPrice(10, 100), currBook.img));
        }
    }
    gBooks = books;
    _saveBooksToStorage();
}

function _createBook(name = 'aaa', price = getRandomPrice(10, 100), imgURl = 'hp1.jpg') {
    return {
        id: makeId(),
        name: name,
        price: price,
        imgURl: 'img/' + imgURl,
        rate: 0
    };
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks);
}