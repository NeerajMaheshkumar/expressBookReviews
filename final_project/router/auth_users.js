const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: "john", password: "1234" },
    { username: "alice", password: "password" },
    { username: "bob", password: "qwerty" }
];

const isValid = (username)=>{ //returns boolean
 return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({ username }, "access", { expiresIn: 60 * 60 });

        // Save token in session (assumes session middleware is used in index.js)
        req.session.authorization = {
            accessToken,
            username
        };

        return res.status(200).json({ message: "User successfully logged in", accessToken });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;  // review passed as query parameter
    const username = req.session?.authorization?.username;

    // Check if user is logged in
    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }

    // Check if review is provided
    if (!review) {
        return res.status(400).json({ message: "Review text is required in query parameters" });
    }

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }

    // Add or update the review for the user
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        book: books[isbn]
    });
});

regd_users.delete("/auth/delete/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session?.authorization?.accessToken;

    // Check if user is logged in
    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }

    if (books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username]; // delete only this user's review
        return res.status(200).json({ message: "Review deleted successfully.", reviews: books[isbn].reviews });
    } else {
        return res.status(200).json({ message: "Review deleted successfully" });
    }  

    });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
