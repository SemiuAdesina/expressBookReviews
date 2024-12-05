const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Check if the username is already registered
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  // Check if username and password match
  const user = users.find(user => user.username === username && user.password === password);
  return !!user;
};


//only registered users can login
// Only registered users can log in
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required!" });
    }

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "2h" });
        req.session.authorization = { accessToken: token, username };
        return res.status(200).json({ message: "Login successful", token });
    } else {
        return res.status(403).json({ message: "Invalid username or password" });
    }
});



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.session.authorization.username;

  if (books[isbn]) {
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review added successfully" });
  } else {
      return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Extract ISBN from the request URL

    // Extract token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({ message: "Unauthorized access! Token required." });
    }

    const token = authHeader.split(" ")[1]; // Extract the Bearer token

    // Verify the token
    jwt.verify(token, "fingerprint_customer", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token!" });
        }

        const username = decoded.username; // Retrieve username from the decoded token

        // Check if the book exists
        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found!" });
        }

        // Check if the user has a review for the specified ISBN
        if (!books[isbn].reviews || !books[isbn].reviews[username]) {
            return res.status(404).json({ message: "No review found for this user!" });
        }

        // Delete the review for the user
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: `Review for ISBN ${isbn} deleted successfully!` });
    });
});





module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
