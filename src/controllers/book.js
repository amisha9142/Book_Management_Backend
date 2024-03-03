const Book  = require("../models/book")

exports.createBook = async(req,res)=>{
    try{
        const{title,excerpt,userId,ISBN,category,subCategory,reviews,} = req.body;

        if(!userId){
            return res.status(400).json({status:true,message:"userId is required"})
        }

        const checkId = await Book.findOne({
            _id: userId
        })        
        if(checkId){
            return res.status(400).json({status:false,message:"userid already exist"})
        }

        const createdBook = await Book.create({
            title,
            excerpt,
            userId,
            ISBN,
            category,
            subCategory,
            reviews
        })
        return res.status(201).json({status:true,message:"book created successfully",data:createdBook})
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({status:false,message:"internal server error"})
    }
}


// get books by query
exports.getBooks = async(req,res)=>{
    try{
        const{userId,category,subCategory,excerpt} = req.query;
        const query = {isDeleted:false}

        if(userId){
            query.userId = userId
        }

        if(category){
            query.category = category
        }

        if(subCategory){
            query.subCategory = subCategory
        }

        const sortOption = {};
        if (excerpt) {
            sortOption.excerpt = parseInt(excerpt);
        }

        const bookData = await Book.find(query).sort(sortOption);
      
        if(bookData){
            return res.status(200).json({status:true,message:"get your book",data:bookData})
        }
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({status:false,message:"internal server error"})
    }
}



// get book by book_id
exports.getNotebook = async(req,res)=>{
    try{
        const{bookId} = req.params
        const getAllBooks = await Book.findById({
            _id:bookId
        })

        // if(getAllBooks.reviews == 0){
        //     return []
        // }
        return res.status(200).json({status:true,message:"book fetched ",data:getAllBooks})
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({status:false,message:"internal server error"})
    }
}



// update book by id
exports.updateBooks = async(req,res)=>{
    try{
        const{bookId} = req.params;
        const{title,excerpt,releasedAt,ISBN}  = req.body;

        const existingBooks = await Book.findOne({_id:bookId,isDeleted:false})
        if(!existingBooks){
            return res.status(404).json({status:false,message:"book not found or already deleted."})
        }

// isbn k value unqiue h modal m to hme update krne k time dusre isbn k value ni dalna h phle isbn k value m , agr vo match kr jayega dusra isbn k value s to ye error fek dega hme update krne k time p v koi unique isbn dena hoga. 
        const duplicateISBN = await Book.findOne({ ISBN : ISBN });

        if (duplicateISBN) {
            return res.status(400).json({ status: false, message: "ISBN already exists for another book" });
        }

        existingBooks.title = title,
        existingBooks.excerpt = excerpt,
        existingBooks.releasedAt = releasedAt,
        existingBooks.ISBN = ISBN

        const result = await existingBooks.save();

        return res.status(200).json({status:true,message:"book data updated",data:result})

    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({status:false,message:"internal server error"})
    }
}


// delete user
exports.deleteBook = async(req,res)=>{
    try{
        const{bookId} = req.params;

        const deleteData = await Book.findOneAndUpdate({
            _id: bookId,
            isDeleted:false
        },{
            $set:{isDeleted:true}
        },{
            new:true
        })

        if(!deleteData){
            return res.status(400).json({status:false,message:"data not found or already deleted"})
        }

        return res.status(200).json({status:true,message:"book data deleted successfully" ,data:deleteData})

    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({status:false,message:"internal server error"})
    }
}


