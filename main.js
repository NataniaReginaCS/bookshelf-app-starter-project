console.log("Hello, world!");

const books = [];
const RENDER_EVENT = "render-books";
const LOCALKEY = "BOOKSHELF_APPS";

document.addEventListener("DOMContentLoaded", function () {
	const submitForm = document.getElementById("bookForm");
	submitForm.addEventListener("submit", function (event) {
		event.preventDefault();
		addBook();
	});

	const cariBuku = document.getElementById("searchBook");
	cariBuku.addEventListener("submit", function (event) {
		event.preventDefault();
		searchBooks();
	});

	if (isStorageExist()) {
		loadDataFromStorage();
	}
});

document.addEventListener(RENDER_EVENT, function () {
	console.log(books);
	const uncompletedBookList = document.getElementById("incompleteBookList");
	uncompletedBookList.innerHTML = "";

	const completedBookList = document.getElementById("completeBookList");
	completedBookList.innerHTML = "";

	for (const bookItem of books) {
		const bookElement = makeBooks(bookItem);
		if (!bookItem.isComplete) uncompletedBookList.append(bookElement);
		else completedBookList.append(bookElement);
	}
});

function addBook() {
	const title = document.getElementById("bookFormTitle").value;
	const author = document.getElementById("bookFormAuthor").value;
	const year = parseInt(document.getElementById("bookFormYear").value);
	const isComplete = document.getElementById("bookFormIsComplete").checked;

	const id = generateId();
	const bookObject = generateBooksObject(id, title, author, year, isComplete);
	books.push(bookObject);

	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function generateId() {
	return +new Date();
}

function generateBooksObject(id, title, author, year, isComplete) {
	return {
		id,
		title,
		author,
		year,
		isComplete,
	};
}

function makeBooks(bookObject) {
	const textTitle = document.createElement("h3");
	textTitle.innerText = bookObject.title;
	textTitle.setAttribute("data-testid", "bookItemTitle");

	const textauthor = document.createElement("p");
	textauthor.innerText = `Penulis: ${bookObject.author}`;
	textauthor.setAttribute("data-testid", "bookItemAuthor");

	const textYear = document.createElement("p");
	textYear.innerText = `Tahun: ${bookObject.year}`;
	textYear.setAttribute("data-testid", "bookItemYear");

	const isCompleteButton = document.createElement("button");
	isCompleteButton.classList.add("selesai");
	isCompleteButton.setAttribute("data-testid", "bookItemIsCompleteButton");

	if (bookObject.isComplete) {
		isCompleteButton.innerText = "Belum Selesai dibaca";
	} else {
		isCompleteButton.innerText = "Selesai dibaca";
	}

	const hapusButton = document.createElement("button");
	hapusButton.innerText = "Hapus buku";
	hapusButton.classList.add("hapus");
	hapusButton.setAttribute("data-testid", "bookItemDeleteButton");

	const editButton = document.createElement("button");
	editButton.innerText = "Edit buku";
	editButton.classList.add("edit");
	editButton.setAttribute("data-testid", "bookItemEditButton");

	const buttonContainer = document.createElement("div");
	buttonContainer.append(isCompleteButton, hapusButton, editButton);

	const container = document.createElement("div");
	container.append(textTitle, textauthor, textYear, buttonContainer);
	container.setAttribute("data-bookid", bookObject.id);
	container.setAttribute("class", "borderBookList");
	container.setAttribute("data-testid", "bookItem");

	isCompleteButton.addEventListener("click", function () {
		if (isCompleteButton.innerText === "Selesai dibaca") {
			isCompleteBooks(bookObject.id);
		} else {
			belumisCompleteBooks(bookObject.id);
		}
	});

	hapusButton.addEventListener("click", function () {
		removeBooks(bookObject.id);
	});

	return container;
}

function isCompleteBooks(bookId) {
	const bookTarget = findBookIndex(bookId);

	if (bookTarget == null) return;

	books[bookTarget].isComplete = true;
	saveData();
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function belumisCompleteBooks(bookId) {
	const bookTarget = findBookIndex(bookId);

	if (bookTarget == null) return;

	books[bookTarget].isComplete = false;
	saveData();
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeBooks(bookId) {
	const bookTarget = findBookIndex(bookId);

	if (bookTarget === -1) return;

	books.splice(bookTarget, 1);
	saveData();
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBookIndex(bookId) {
	for (const index in books) {
		if (books[index].id === bookId) {
			return index;
		}
	}

	return -1;
}

function searchBooks() {
	const searchInput = document.getElementById("searchBookTitle").value;
	const searchResult = books.filter((book) =>
		book.title.toLowerCase().includes(searchInput.toLowerCase())
	);
	const uncompletedBookList = document.getElementById("incompleteBookList");
	uncompletedBookList.innerHTML = "";

	const completedBookList = document.getElementById("completeBookList");
	completedBookList.innerHTML = "";

	for (const bookItem of searchResult) {
		const bookElement = makeBooks(bookItem);
		if (!bookItem.isComplete) uncompletedBookList.append(bookElement);
		else completedBookList.append(bookElement);
	}
}

function saveData() {
	if (isStorageExist()) {
		const parsed = JSON.stringify(books);
		localStorage.setItem(LOCALKEY, parsed);
		document.dispatchEvent(new Event(RENDER_EVENT));
	}
}

function loadDataFromStorage() {
	const serializedData = localStorage.getItem(LOCALKEY);
	let data = JSON.parse(serializedData);

	if (data !== null) {
		for (const book of data) {
			books.push(book);
		}
	}

	document.dispatchEvent(new Event(RENDER_EVENT));
}

function isStorageExist() {
	if (typeof Storage === undefined) {
		alert("Browser yang Anda gunakan tidak mendukung Web Storage");
		return false;
	}
	return true;
}
