//place the app.js, package-lock.json, and package.json in a directory
//run 'npm install' (need to install node and npm on your machine first if you don't have them installed already)
//to run the server: npm start
//to send a query: http://localhost:PORT/?keyword="search query" 

const express = require("express");

const app = express();

const PORT = 50000;

const MAXRESULTS = 40; // 40 is max allowed by Google Books api, change this number to the number of results you want up to 40.

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
  //console.dir(searchResults.items);
  return searchResults;
}

//This function takes the books search results (the items property)
//and put it in an arr of objects with the following properties,
//feel free to edit or delete this function if you prefer to use
//the search results directly and edit it on your end.
async function sortResult(data) {
  const books = [];
  for (const book of data) {
    books.push({
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors,
      description: book.volumeInfo.description,
      imageLinks: await getImages(book.selfLink), // an object containing links to book cover images of diff sizes
      industryIdentifiers: book.volumeInfo.industryIdentifiers, //arr of objects containing ISBN 10 and 13, old books have PSU #
      infoLink: book.volumeInfo.infoLink,
      language: book.volumeInfo.language,
      publishedDate: book.volumeInfo.publishedDate,
      publisher: book.volumeInfo.publisher,
      categories: book.volumeInfo.categories,
      snippet: book.searchInfo,
    });
  }
  console.log(books);
  return books;
}

//This function uses the selfLink url for each book to get images of different 
//sizes. The issue with Google books API is that the search query only returns
// a link to a  small thumbnail. To get all image sizes of the book cover, you need
//to query the book info link. This slows down the results, it took about 3 seconds
//with 40 search results on my end. If you want, you can have this fetch done on the front end
//if the user wants to see the book's details and use the small thumbnail in the results list, just a suggestion.
async function getImages(bookInfoUrl) {
  const options = { method: "GET" };
  const response = await fetch(bookInfoUrl, options);
  const searchResults = await response.json();
  return searchResults.volumeInfo.imageLinks;
}

app.get("/", async (req, res) => {
  const keyword = req.query.keyword;
  const searchResults = await searchBooks(keyword);
  const books = await sortResult(searchResults.items);
  res.json(books);
});

app.listen(PORT);
