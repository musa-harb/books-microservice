const express = require("express");

const app = express();

const PORT = 50000;

const MAXRESULTS = 3; // 40 is max allowed by Google Books api, change this number to the number of results you want up to 40.

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

async function searchBooks(keyword) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${keyword}&maxResults=${MAXRESULTS}`;
  const options = { method: "GET" };
  const response = await fetch(url, options);
  const searchResults = await response.json();
  console.dir(searchResults.items);
  return searchResults;
}

//This function takes the books search results (the items property)  
//and put it in an arr of objects with the following properties,
//feel free to edit or delete this function if you prefer to use
//the search results directly and edit it on your end.
function sortResult(data) {
  const books = [];
  for (const book of data) {
    console.log(book.volumeInfo.industryIdentifiers, book.volumeInfo.title);
    books.push({
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors,
      description: book.volumeInfo.description,
      thumbnail: book.volumeInfo.imageLinks,                    // arr of objects containing links to book cover images of diff sizes
      industryIdentifiers: book.volumeInfo.industryIdentifiers, //arr of objects containing ISBN 10 and 13, old books have PSU #
      infoLink: book.volumeInfo.infoLink,
      language: book.volumeInfo.language,
      publishedDate: book.volumeInfo.publishedDate,
      publisher: book.volumeInfo.publisher,
      categories: book.volumeInfo.categories,
      snippet: book.searchInfo.textSnippet,
    });
  }
  console.log(books);
  return books;
}

app.get("/", async (req, res) => {
  const keyword = req.query.keyword;
  const searchResults = await searchBooks(keyword);
  const books = sortResult(searchResults.items);
  res.json(books);
});

app.listen(PORT);
