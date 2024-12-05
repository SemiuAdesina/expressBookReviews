const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required!" });
    }
  
    if (isValid(username)) {
        return res.status(400).json({ message: "Username already exists!" });
    }
  
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully!" });
  });
  
  
  // Get all books using async/await
public_users.get("/", async (req, res) => {
    try {
        // Simulating fetching data from a database or external service
        const booksData = await axios.get("https://your-api-url/books");
        const books = booksData.data;

        // Respond with the list of books in a neatly formatted JSON
        res.status(200).send(`<pre>${JSON.stringify(books, null, 4)}</pre>`);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Error fetching books!" });
    }
});
    
  // Get book details by ISBN using async/await
public_users.get("/isbn/:isbn", async (req, res) => {
    try {
        const isbn = req.params.isbn;

        // Simulating fetching data from a database or external service
        const bookData = await axios.get(`https://your-api-url/books/isbn/${isbn}`);
        const book = bookData.data;

        if (!book) {
            return res.status(404).json({ message: "Book not found!" });
        }

        // Respond with the book details
        res.status(200).json(book);
    } catch (error) {
        console.error("Error fetching book details by ISBN:", error);
        res.status(500).json({ message: "Error fetching book details by ISBN!" });
    }
});

  
    
  // Get book details by author using async/await
public_users.get("/author/:author", async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();

        // Simulating fetching data from a database or external service
        const booksData = await axios.get("https://your-api-url/books");
        const books = booksData.data;

        // Filter books by author
        const filteredBooks = Object.values(books).filter(
            (book) => book.author.toLowerCase() === author
        );

        if (filteredBooks.length === 0) {
            return res.status(404).json({ message: "No books found by this author!" });
        }

        // Respond with the filtered books
        res.status(200).json(filteredBooks);
    } catch (error) {
        console.error("Error fetching books by author:", error);
        res.status(500).json({ message: "Error fetching books by author!" });
    }
});

  
  /// Get book details by title using async/await
public_users.get("/title/:title", async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();

        // Simulating fetching data from a database or external service
        const booksData = await axios.get("https://your-api-url/books");
        const books = booksData.data;

        // Filter books by title
        const filteredBooks = Object.values(books).filter(
            (book) => book.title.toLowerCase() === title
        );

        if (filteredBooks.length === 0) {
            return res.status(404).json({ message: "No books found with this title!" });
        }

        // Respond with the filtered books
        res.status(200).json(filteredBooks);
    } catch (error) {
        console.error("Error fetching books by title:", error);
        res.status(500).json({ message: "Error fetching books by title!" });
    }
});

  
  //  Get book review
  public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
  });
  
  
  module.exports.general = public_users;
  