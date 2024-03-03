const Reviews = require("../models/review")
const Book = require("../models/book")

exports.createReview = async(req,res)=>{
    try{
        const{bookId} = req.params;
        const{review,rating,reviewedBy} = req.body;
        if(!rating){
            return res.status(404).json({status:false,message:"rating is mandatory."})
        }
        if(!review){
            return res.status(404).json({status:false,message:"review is mandatory"})
        }
        if(!reviewedBy){
            return res.status(404).json({status:false,message:"reviewedBy is mandatory"})
        }
        if(rating < 1 || rating > 5){
            return res.status(400).json({status:false,message:"rating should be an integer between 1 and 5"})
        }

        if(!reviewedBy){
            reviewedBy = "Guest"
        }

        let createReview = await Reviews.create({
            bookId,
            review,
            rating,
            reviewedBy
        })
        let bookData = await Book.findOneAndUpdate({_id:bookId,isDeleted:false},{
            $inc : {reviews:1}
        })
        console.log(bookData)
        return res.status(201).json({status:true,message:"success",data:bookData})
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({status:false,message:"internal server error"})
    }
}
       

// POST /books/:bookId/review
// Add a review for the book in reviews collection.
// Check if the bookId exists and is not deleted before adding the review. Send an error response with appropirate status code like this if the book does not exist
// Get review details like review, rating, reviewer's name in request body.
// Update the related book document by increasing its review count
// Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like this


// update review by id
exports.updateReview = async(req,res)=>{
    try{
        const{bookId,reviewId} = req.params;
        const{review,rating,reviewedBy} = req.body
        const checkBook = await Book.findOne({_id:bookId,isDeleted:false})
        if(!checkBook){
            return res.status(404).json({status:false,message:"book not found or deleted"})
        }

        const existingReview = await Reviews.findOne({_id:reviewId})
        if(!existingReview){
            return res.status(404).json({status:false,message:"review not found."})
        }

        existingReview.review = review  || existingReview.review;
        existingReview.rating = rating   || existingReview.rating;
        existingReview.reviewedBy = reviewedBy || existingReview.reviewedBy;

        const updatedReview = await existingReview.save()

        return res.status(200).json({status:true,message:"review updated successfully" , data:updatedReview})
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({status:false,message:"internal server error"})
    }
}

// PUT /books/:bookId/review/:reviewId
// Update the review - review, rating, reviewer's name.
// Check if the bookId exists and is not deleted before updating the review. Check if the review exist before updating the review. Send an error response with appropirate status code like this if the book does not exist
// Get review details like review, rating, reviewer's name in request body.
// Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like this


// delete review
exports.deleteReview = async(req,res)=>{
    try{
        const{reviewId,bookId} = req.params;
        const checkBooks = await Book.findOne({_id:bookId,isDeleted:false})
        if(!checkBooks){
            return res.status(400).json({status:false,message:"books not found."})
        }

        const checkReviews = await Reviews.findOne({_id:reviewId,isDeleted:false})
        if(!checkReviews){
            return res.status(404).json({status:false,message:"reviews not found"})
        }

        await Reviews.findOneAndUpdate({ _id: reviewId }, { isDeleted: true });

        // Decrease the review count of the book
        await Book.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } });

        return res.status(200).json({status:true,message:"review deleted successfully"})
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({status:false,message:"internal server error"})
    }
}

// DELETE /books/:bookId/review/:reviewId
// Check if the review exist with the reviewId. Check if the book exist with the bookId. Send an error response with appropirate status code like this if the book or book review does not exist
// Delete the related reivew.
// Update the books document - decrease review count by one
// Authentication
// Make sure all the book routes are protected.
// Authorisation
// Make sure that only the owner of the books is able to create, edit or delete the book.
// In case of unauthorized access return an appropirate error message.

