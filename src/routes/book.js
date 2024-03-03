const express = require("express");
const { createBook, getBooks, getNotebook, updateBooks, deleteBook } = require("../controllers/book");
const { isAuthenticated } = require("../middleware/auth");
const route = express.Router()

route.post("/createbook",isAuthenticated,createBook);
route.get("/getbook",getBooks);
route.get("/getnotebook/:bookId",getNotebook);
route.put("/updatebook/:bookId",updateBooks);
route.put("/deletebook/:bookId",deleteBook);

module.exports = route;
