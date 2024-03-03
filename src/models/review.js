const mongoose = require("mongoose")
const reviewSchema = new mongoose.Schema({
    bookId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Book",
        required: true 
    },
    reviewedBy:{
        type:String,
        required:true,
        default:'Guest'
    },
    reviewedAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    review:{
        type:String,
        required:false   //bcz it is optional
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})
const Review = mongoose.model("Review",reviewSchema)
module.exports = Review


// // Review Model (Books review)
// // {
// //   bookId: {ObjectId, mandatory, refs to book model},
// //   reviewedBy: {string, mandatory, default 'Guest', value: reviewer's name},
// //   reviewedAt: {Date, mandatory},
// //   rating: {number, min 1, max 5, mandatory},
// //   review: {string, optional}
// //   isDeleted: {boolean, default: false},
// // }
