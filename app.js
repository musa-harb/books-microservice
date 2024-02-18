const express = require("express");

const app = express();

const PORT = 50000;

async function searchBooks(keyword) {
  const url = `https://openlibrary.org/search.json?q=${keyword}`;
  const options = { method: "GET" };

  let response = await fetch(url, options);
  const books = await response.json();
  return books;
}

app.get("/", async (req, res) => {
  const keyword = req.query.keyword;
  const books = await searchBooks(keyword);
  res.json(books.docs[0]);
});

app.listen(PORT);
