const User = require("../models/user")
const jwt = require("jsonwebtoken")

exports.isAuthenticated = async(req,res,next)=>{
        const token = req.headers["x-api-key"]
        if(!token){
            return res.status(400).json({status:false,message:"token is missing."})
        }
        const decodedData = jwt.verify(token,process.env.JWT_SECRET)
        console.log(decodedData)
        console.log(decodedData.userId)

        req.user = await User.findById(decodedData.userId)
        console.log(req.user)

        next();
}



// authorizaiton
exports.authorizeRoles = (...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(400).json({status:false,message:`${req.user.role} is not allowed to access this resources`})
        }
        next();
    }
}
