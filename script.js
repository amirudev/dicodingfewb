let books = [];

if (localStorage.getItem('booksData')){
	books = JSON.parse(localStorage.getItem('booksData'));
}

// Element
var el_title = document.getElementById('title');
var el_writer = document.getElementById('writer');
var el_year = document.getElementById('year');
var el_pagestotal = document.getElementById('pages_total');
var el_pagesreaded = document.getElementById('pages_readed');
var el_isreaded = document.getElementById('isReaded');
var el_buttonaddbook = document.getElementById('button_addbook');
var el_notReadedList = document.getElementById('notReadedList');
var el_readedList = document.getElementById('readedList');

function addBook(title, author, year, isComplete, pagesTotal = 0, pagesReaded = 0){
  books.push({
  	id: Date.now(),
	title: title,
	author: author,
	year: year,
	isComplete: isComplete,
	pagesTotal: parseInt(pagesTotal),
	pagesReaded: parseInt(pagesReaded),
  });
}

function checkBookToAdd(){
	if(el_title.value == '' || el_title.value.length > 100){
		el_title.nextElementSibling.classList.remove('hidden');
		return false;
	} else if(el_writer.value == '' || el_writer.value.length > 100){
		el_writer.nextElementSibling.classList.remove('hidden');
		return false;
	} else if(el_year.value == '' || el_year.value.length > 4){
		el_year.nextElementSibling.classList.remove('hidden');
		return false;
	} else {
		return true;
	}
}

function showAllBooks(){
  	localStorage.setItem('booksData', JSON.stringify(books));

	el_readedList.innerHTML = '';
	el_notReadedList.innerHTML = '';
	books.forEach((book) => {
		let bookContainer = document.createElement('div');
		let percentageReaded = Math.min(Math.floor(book.pagesReaded / book.pagesTotal * 100), 100);

		bookContainer.innerHTML = `
		<div class="card w-full shadow px-4 py-2 my-2">
			<div>
				<h3 class="font-bold text-xl">${book.title}</h3>
				<p class="mt-2">Penulis : <span class="font-bold">${book.author}</span></p>
				<p class="mt-2">Tahun Penerbitan : <span class="font-bold">${book.year}</span></p>
			</div>
			<div class="text-right mt-2">
				<div>
				<button class="bg-green-600 text-white px-4 py-2 rounded" onclick="editBookList(${book.id})">Edit Buku</button>
				<button class="bg-blue-600 text-white px-4 py-2 rounded" onclick="updateBookList(${book.id})">Perbarui Kemajuan</button>
				<button class="bg-red-600 text-white px-4 py-2 rounded button_delete" onclick="deleteBookList(${book.id})">Hapus</button>
			</div>
		</div>
		`;

		let progressBlock = document.createElement('div');
		if(percentageReaded >= 100){
			progressBlock.innerHTML = `
			<div class="my-2">
				<span class="text-green-600">Telah selesai dibaca</span>
			</div>
			`;
		} else {
			progressBlock.innerHTML = `
			<div class="relative pt-1 mt-3">
			  <div class="flex mb-2 items-center justify-between">
			    <div>
			      <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
			        Kemajuan Membaca
			      </span>
			    </div>
			    <div class="text-right">
			      <span class="text-xs font-semibold inline-block text-blue-600">
			        ${percentageReaded}%
			      </span>
			    </div>
			  </div>
			  <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
			    <div style="width:${percentageReaded}%" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
			  </div>
			</div>
			`;
		}
		bookContainer.firstElementChild.children[1].prepend(progressBlock)

		if(book.isComplete == true || percentageReaded >= 100){
			el_readedList.prepend(bookContainer);
		} else {
			el_notReadedList.prepend(bookContainer);
		}
	});
}

function deleteBookList(bookId){
	let indexOfBook = books.findIndex(book => book.id == bookId);
	let isPrompted = confirm(`${books[indexOfBook].title} - ${books[indexOfBook].author} akan dihapus, apakah anda yakin ?`);
	if(isPrompted){
		books.splice(indexOfBook, 1);
	}
	showAllBooks();
}

function updateBookList(bookId){
	let indexOfBook = books.findIndex(book => book.id == bookId);
	let newProgress = prompt(`Halaman terakhir bacaan buku ${books[indexOfBook].title} - ${books[indexOfBook].author} ( ${books[indexOfBook].pagesTotal} Halaman)`);
	if(newProgress != null && newProgress != ''){
		books[indexOfBook].pagesReaded = newProgress;
	}
	showAllBooks();
}

el_buttonaddbook.addEventListener('click', () => {
	if(checkBookToAdd()){
		if(el_isreaded.checked == true){
			el_pagesreaded = el_pagestotal;
		}
		addBook(el_title.value, el_writer.value, el_year.value, el_isreaded.checked, el_pagestotal.value, el_pagesreaded.value);
		el_title.value = '';
		el_writer.value = '';
		el_year.value = '';
		el_isreaded.checked = false;
		el_pagestotal.value = '';
		el_pagesreaded.value = '';
	}
	showAllBooks();
});

// Fitur Tambahan

// Fitur cari buku
function findBooks(keyword){
	if(keyword.length >= 1){
		return books.filter(book => book.title.includes(keyword) || book.author.includes(keyword));
	}
}

var el_booktofindinput = document.getElementById('bookToFind');
el_booktofindinput.addEventListener('change', () => {
	document.getElementById('findBookBlock').innerHTML = '';
	let filteredBooks = findBooks(el_booktofindinput.value);
	filteredBooks.forEach((book) => {
		let bookContainer = document.createElement('div');
		let percentageReaded = Math.min(Math.floor(book.pagesReaded / book.pagesTotal * 100), 100);

		bookContainer.innerHTML = `
		<div class="card w-full shadow px-4 py-2 my-2">
			<div>
				<h3 class="font-bold text-xl">${book.title}</h3>
				<p class="mt-2">Penulis : <span class="font-bold">${book.author}</span></p>
				<p class="mt-2">Tahun Penerbitan : <span class="font-bold">${book.year}</span></p>
			</div>
			<div class="text-right mt-2">
				<div>
				<button class="bg-blue-600 text-white px-4 py-2 rounded" onclick="updateBookList(${book.id})">Perbarui Kemajuan</button>
				<button class="bg-red-600 text-white px-4 py-2 rounded button_delete" onclick="deleteBookList(${book.id})">Hapus</button>
			</div>
		</div>
		`;

		let progressBlock = document.createElement('div');
		if(percentageReaded >= 100){
			progressBlock.innerHTML = `
			<div class="my-2">
				<span class="text-green-600">Telah selesai dibaca</span>
			</div>
			`;
		} else {
			progressBlock.innerHTML = `
			<div class="relative pt-1 mt-3">
			  <div class="flex mb-2 items-center justify-between">
			    <div>
			      <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
			        Kemajuan Membaca
			      </span>
			    </div>
			    <div class="text-right">
			      <span class="text-xs font-semibold inline-block text-blue-600">
			        ${percentageReaded}%
			      </span>
			    </div>
			  </div>
			  <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
			    <div style="width:${percentageReaded}%" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
			  </div>
			</div>
			`;
		}

		document.getElementById('findBookBlock').prepend(bookContainer);
	});
});

// Edit Buku
function editBookList(bookId){
	let indexOfBook = books.findIndex(book => book.id == bookId);
	let book = books[indexOfBook];

	el_title.value = book.title;
	el_writer.value = book.author;
	el_year.value = book.year;
	el_pagestotal.value = book.pagesTotal;
	el_pagesreaded.value = book.pagesReaded;

	books.splice(indexOfBook, 1);
	alert(`Silahkan edit buku ${book.title} - ${book.author} pada tempat entry buku`);
	showAllBooks();
}

showAllBooks();