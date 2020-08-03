function onInit() {
    renderBooks();
    renderCurrPage();
}

// Rendering --------------------------------------------------------------------

function renderBooks() {
    var books = getCurrPageBooks();
    var strHTMLs = books.map(function (book) {
        return `
        <tr>
        <td>${book.id}</td>
        <td>${book.name}</td>
        <td class="price price-${book.id}">${book.price.toFixed(2)}</td>
        <td class="actions">
            <button class="read" onclick="onReadBook('${book.id}')">
                <i class="fas fa-ellipsis-h"></i>
            </button>
            <button class="update" onclick="onUpdateBook('${book.id}')">
                <i class="fas fa-money-bill-wave"></i>
            </button>
            <button class="delete" onclick="onDeleteBook('${book.id}')">
                <i class="fas fa-trash-alt"></i>
            </button>   
        </td>
        </tr>`});
    strHTMLs.unshift(`
    <table class="books-table">
        <tr>
            <th onclick="onSortBy('id')">ID</th>
            <th onclick="onSortBy('name')">TITLE</th>
            <th onclick="onSortBy('price')">PRICE (NIS)</th>
            <th>ACTIONS</th>
        </tr>`);
    strHTMLs.push('</table>');
    document.querySelector('.book-list-container').innerHTML = strHTMLs.join('');
}

function renderRatingSetter(book) {
    var strHTML = `
        <button onClick="onUpdateRating('${book.id}',${(book.rate === 0) ? 0 : book.rate - 1})">-</button>
        <span class="book-rating"> ${book.rate} </span>
        <button onClick="onUpdateRating('${book.id}',${(book.rate === 10) ? 10 : book.rate + 1})">+</button>`;
    return strHTML;
}

function renderCurrPage() {
    var elCurrPage = document.querySelector('.current-page');
    elCurrPage.innerText = getCurrPage();
}

// Page functionality -----------------------------------------------------------

function toggleAddBookForm() {
    document.querySelector('.add-book-form').classList.toggle('hidden');
}

function closeReadModalWindow() {
    document.querySelector('.modal').hidden = true;
}

function onMovePage(diff) {
    changePage(diff);
    onInit();
}

function onSortBy(byCol) {
    sortBy(byCol);
    renderBooks();
}

// C.R.U.D. --------------------------------------------------------------------

function onDeleteBook(bookId) {
    deleteBook(bookId);
    renderBooks();
}

function onAddBook() {
    var elBookNameTxt = document.querySelector('.book-name-txt');
    var elBookPriceTxt = document.querySelector('.book-price-txt');
    addBook(elBookNameTxt.value, elBookPriceTxt.value);
    renderBooks();
}

function onUpdateBook(bookId) {
    renderBooks();
    var elBookPrice = document.querySelector('.price-' + bookId);
    var strHTML = `
        <input class="price-edit" value="${elBookPrice.innerText}" />`
    elBookPrice.innerHTML = strHTML;
    var elPriceEdit = document.querySelector('.price-edit');
    elPriceEdit.focus();
    elPriceEdit.select();
    elPriceEdit.addEventListener('keyup', function (ev) {
        if (ev.keyCode === 13) {
            ev.preventDefault();
            elBookPrice.innerHTML += `
                <button hidden class="price-edit-btn" onclick="updateBook('${bookId}', ${elPriceEdit.value})"></button>`;
            document.querySelector('.price-edit-btn').click();
            renderBooks();
        }
    });

}

function onReadBook(bookId) {
    var bookToRead = getbookById(bookId);
    var elModalReadWindow = document.querySelector('.modal');
    elModalReadWindow.querySelector('.name').innerText = bookToRead.name;
    elModalReadWindow.querySelector('img').src = bookToRead.imgURl;
    elModalReadWindow.querySelector('.price').innerText = 'NIS ' + bookToRead.price.toFixed(2);
    elModalReadWindow.querySelector('.rating').innerHTML = renderRatingSetter(bookToRead);
    document.querySelector('.modal').hidden = false;
}

function onUpdateRating(bookId, newRating) {
    updateRating(bookId, newRating);
    var bookUpdatedRating = getbookById(bookId);
    var elModalReadWindow = document.querySelector('.modal');
    elModalReadWindow.querySelector('.rating').innerHTML = renderRatingSetter(bookUpdatedRating);
}