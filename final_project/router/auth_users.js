const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return true;
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ data: username }, "fingerprint_customer", {
      expiresIn: "1h",
    });
    req.session.authorization = {
      token,
    };
    return res.status(200).send({ message: "User successfully logged in" });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const { username } = req;
  console.log(isbn, review, username);

  const book = books[isbn];
  if (!book) {
    return res.status(404).send({ messsage: "Book not found" });
  }
  if (!review) {
    return res.status(400).send({ messsage: "Review is required" });
  }
  if (!username) {
    return res.status(400).send({ messsage: "Username is required" });
  }
  book.reviews[username] = review;
  res.status(200).send({
    message: `The review for the book with ISBN ${isbn} has been added/updated.`,
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req;
  const book = books[isbn];
  if (!book) {
    return res.status(404).send("Book not found");
  }
  if (!username) {
    return res.status(400).send("Username is required");
  }
  delete book.reviews[username];
  res.status(200).send({
    message: `The review for the book with ISBN ${isbn} has been deleted.`,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
