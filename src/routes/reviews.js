const express = require("express");
const { createReview, updateReview, deleteReview } = require("../controllers/reviews");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const route = express.Router();

route.post("/createreview/:bookId",isAuthenticated,authorizeRoles("admin"),createReview);
route.put("/updatereview/:bookId/:reviewId",isAuthenticated,authorizeRoles("admin"),updateReview);
route.delete("/deletereview/:bookId/:reviewId",isAuthenticated,authorizeRoles("admin"),deleteReview)

module.exports = route;