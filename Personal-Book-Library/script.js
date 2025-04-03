const books = [
    { title: "1984", author: "George Orwell", category: "Dystopian", borrowed: false },
    { title: "To Kill a Mockingbird", author: "Harper Lee", category: "Classic", borrowed: true },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Classic", borrowed: false }
];

const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const borrowedToggle = document.getElementById("borrowed-toggle");

function displayBooks(filteredBooks) {
    bookList.innerHTML = "";
    filteredBooks.forEach(book => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>${book.borrowed ? "Borrowed" : "Available"}</td>
        `;
        bookList.appendChild(row);
    });
}

function filterBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const showBorrowed = borrowedToggle.checked;

    let filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.category.toLowerCase().includes(searchTerm)
    );

    if (selectedCategory !== "All") {
        filteredBooks = filteredBooks.filter(book => book.category === selectedCategory);
    }

    if (showBorrowed) {
        filteredBooks = filteredBooks.filter(book => book.borrowed);
    }

    displayBooks(filteredBooks);
}

// Populate category filter dropdown
function populateCategories() {
    const categories = Array.from(new Set(books.map(book => book.category)));
    categoryFilter.innerHTML = `<option value="All">All</option>`;
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Initial setup
populateCategories();
displayBooks(books);

// Event listeners
searchInput.addEventListener("input", filterBooks);
categoryFilter.addEventListener("change", filterBooks);
borrowedToggle.addEventListener("change", filterBooks);
