const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  let { username, password } = req.body;
  if (username && password) {
    let prvUser = users.some((user) => user.username == username);
    if (prvUser)
      return res.send({ message: "Already User With that Username Exists" });

    users.push({ username, password });
    res.send({
      message: "Customer successfully registered. Now you can login",
    });
  } else {
    res.status(400).send({ message: "username and password must be provided" });
  }
});

public_users.get("/", async function (req, res) {
  try {
    await new Promise((resolve, reject) => {
      resolve(res.send(books));
    });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    await new Promise((resolve, reject) => {
      resolve(res.send(books[req.params.isbn]));
    });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

public_users.get("/author/:author", async function (req, res) {
  let author = req.params.author.toLowerCase();
  try {
    await new Promise((resolve, reject) => {
      let booksByAuthor = Object.entries(books)
        .filter((book) => book[1].author?.toLowerCase() === author)
        .map((book) => {
          delete book[1].author;
          book[1].isbn = book[0];
          return book[1];
        });
      resolve(
        res.send({
          booksbyauthor: booksByAuthor,
        })
      );
    });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

public_users.get("/title/:title", async function (req, res) {
  let title = req.params.title.toLowerCase();
  try {
    await new Promise((resolve, reject) => {
      let booksByTitle = Object.entries(books)
        .filter((book) => book[1].title.toLowerCase() == title)
        .map((book) => {
          delete book[1].title;
          book[1].isbn = book[0];
          return book[1];
        });

      resolve(
        res.send({
          booksbytitle: booksByTitle,
        })
      );
    });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

public_users.get("/review/:isbn", function (req, res) {
  let index = req.params.isbn;
  res.send(books[index].reviews);
});

module.exports.general = public_users;
