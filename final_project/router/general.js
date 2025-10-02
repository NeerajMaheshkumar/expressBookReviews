const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
 const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop without promise
// public_users.get('/books',function (req, res) {
// return res.status(200).send(JSON.stringify(books, null, 4));
// });

// Get the book list available in the shop with promise
public_users.get('/books', async function (req, res) {
    let getBooks = new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("No books available");
        }
    });

    getBooks
        .then(result => {
            return res.status(200).send(JSON.stringify(result, null, 4));
        })
        .catch(error => {
            return res.status(500).json({ message: "Error fetching books", error: error });
        });
});


// Get book details based on ISBN without promise
// public_users.get('/isbn/:isbn',function (req, res) {
//     const isbnNo = req.params.isbn;
//     let bookFound = null;
    
//     // Iterate through the books object
//     for (let key in books) {
//         if (books[key].isbn === isbnNo) {
//             bookFound = books[key];
//           } 
//         }
// return res.status(200).send(JSON.stringify(bookFound, null, 4))
// });

// Get book details based on ISBN with promise
public_users.get('/isbn/:isbn', function (req, res) {
    const isbnNo = req.params.isbn;

    // Wrap lookup in a Promise
    let findBook = new Promise((resolve, reject) => {
        let bookFound = null;

        for (let key in books) {
            if (books[key].isbn === isbnNo) {
                bookFound = books[key];
                break;
            }
        }

        if (bookFound) {
            resolve(bookFound);
        } else {
            reject("Book not found");
        }
    });

    // Handle success and error
    findBook
        .then(result => {
            return res.status(200).send(JSON.stringify(result, null, 4));
        })
        .catch(error => {
            return res.status(404).json({ message: error });
        });
});

  
// Get book details based on author without promise
// public_users.get('/author/:author',function (req, res) {
//     const author = req.params.author;
//     let bookFound = null;
    
//     // Iterate through the books object
//     for (let key in books) {
//         if (books[key].author === author) {
//             bookFound = books[key];
//           } 
//         }
// return res.status(200).send(JSON.stringify(bookFound, null, 4))
// });

// Get book details based on author with promise
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    let findBooksByAuthor = new Promise((resolve, reject) => {
        let booksByAuthor = [];

        for (let key in books) {
            if (books[key].author === author) {
                booksByAuthor.push(books[key]);
            }
        }

        if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
        } else {
            reject("No books found for this author");
        }
    });

    findBooksByAuthor
        .then(result => {
            return res.status(200).send(JSON.stringify(result, null, 4));
        })
        .catch(error => {
            return res.status(404).json({ message: error });
        });
});


// Get all books based on title without promise
// public_users.get('/title/:title',function (req, res) {
//     const title = req.params.title;
//     let bookFound = null;
    
//     // Iterate through the books object
//     for (let key in books) {
//         if (books[key].title === title) {
//             bookFound = books[key];
//           } 
//         }
// return res.status(200).send(JSON.stringify(bookFound, null, 4))
// });

// Get all books based on title with promise
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    let findBookByTitle = new Promise((resolve, reject) => {
        let bookFound = null;

        for (let key in books) {
            if (books[key].title === title) {
                bookFound = books[key];
                break;
            }
        }

        if (bookFound) {
            resolve(bookFound);
        } else {
            reject("Book not found with the given title");
        }
    });

    findBookByTitle
        .then(result => {
            return res.status(200).send(JSON.stringify(result, null, 4));
        })
        .catch(error => {
            return res.status(404).json({ message: error });
        });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbnNo = req.params.isbn;
    let bookReviewFound = null;
    
    // Iterate through the books object
    for (let key in books) {
        if (books[key].isbn === isbnNo) {
            bookReviewFound = books[key].reviews;
          } 
        }
return res.status(200).send(JSON.stringify(bookReviewFound, null, 4))
});

module.exports.general = public_users;
