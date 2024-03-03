const express = require("express");
const { createUser, loginUser } = require("../controllers/user");
const route = express.Router();

route.post("/createuser", createUser);
route.post("/loginuser",loginUser);

// route.post("/createuser",createUser)

module.exports = route;

