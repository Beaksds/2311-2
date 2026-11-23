"use strict";

const express = require("express");
const path = require("node:path");

const app = express();

let books = [
  { id: 1, title: "JavaScript для начинающих", author: "A. Author" },
  { id: 2, title: "Node.js на практике", author: "B. Author" },
  { id: 3, title: "Веб-разработка", author: "C. Author" }
];
let nextId = 4;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// TODO 1. Добавьте middleware-логгер.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// TODO 2. GET /api/books
app.get("/api/books", (req, res) => {
  const query = req.query.q;
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    const filteredBooks = books.filter(
      book => book.title.toLowerCase().includes(lowerQuery) || 
              book.author.toLowerCase().includes(lowerQuery)
    );
    return res.json(filteredBooks);
  }
  
  res.json(books);
});

// TODO 3. GET /api/books/:id
app.get("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find(b => b.id === id);
  
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  
  res.json(book);
});

// TODO 4. POST /api/books
app.post("/api/books", (req, res) => {
  const { title, author } = req.body;
  
  if (!title || !author || String(title).trim() === "" || String(author).trim() === "") {
    return res.status(400).json({ error: "title and author are required" });
  }
  
  const newBook = {
    id: nextId++,
    title: title,
    author: author
  };
  
  books.push(newBook);
  res.status(201).json(newBook);
});

// TODO 5. PATCH /api/books/:id
app.patch("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const bookIndex = books.findIndex(b => b.id === id);
  
  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }
  
  const { title, author } = req.body;
  const book = books[bookIndex];
  
  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  
  res.json(book);
});

// TODO 6. DELETE /api/books/:id
app.delete("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const bookIndex = books.findIndex(b => b.id === id);
  
  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }
  
  books.splice(bookIndex, 1);
  res.status(204).send();
});

module.exports = app;