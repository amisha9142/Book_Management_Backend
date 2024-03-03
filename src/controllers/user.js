const User = require("../models/user");
const { validateName, validatePhone, validateEmail, validatePassword } = require("../utilis/validation");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.createUser = async(req,res)=>{
    try{
        const{title,name,phone,email,password,address,role} = req.body;
        const{street,city,pincode} = address

        if(!title){
            return res.status(400).json({status:false,message:"title is required"})
        }
        if(!name){
            return res.status(400).json({status:false,message:"name is required"})
        }
        if(!phone){
            return res.status(400).json({status:false,message:"phone is required"})
        }
        if(!email){
            return res.status(400).json({status:false,message:"email is required"})
        }
        if(!password){
            return res.status(400).json({status:false,message:"password is required"})
        }
        if(!address){
            return res.status(400).json({status:false,message:"address is required"})
        }

        if(!validateName(name)){
            return res.status(400).json({status:false,message:"name is invalid"})
        }
        if(!validatePhone(phone)){
            return res.status(400).json({status:false,message:"phone is invalid"})
        }
        if(!validateEmail(email)){
            return res.status(400).json({status:false,message:"email is invalid"})
        }
        if(!validatePassword(password)){
            return res.status(400).json({status:false,message:"Ensure your password includes a combination of uppercase letters, lowercase letters, numbers, and special characters."})
        }

        const existingEmail = await User.findOne({
            email:email
        })
        if(existingEmail){
            return res.status(400).json({status:false,message:"email already exist"})
        }

        const phoneNo = await User.findOne({
            phone:phone
        })
        if(phoneNo){
            return res.status(400).json({status:false,message:"phone no already exist"})
        }

        const bcryptPassword = await bcrypt.hash(password,10)

        const created = await User.create({
            title,
            name,
            phone,
            email,
            password:bcryptPassword,
            address,
            role
        })
        return res.status(201).json({status:true,message:"user data created successfully" , data: created})
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({status:false,message:"internal server error"})
    }
}


// login
exports.loginUser = async(req,res)=>{
    try{
        const{email , password} = req.body;

        if(!email){
            return res.status(400).json({status:false,message:"email is required"})
        }
        if(!password){
            return res.status(400).json({status:false,message:"password is required"})
        }

        if(!validateEmail(email)){
            return res.status(400).json({status:false,message:"email is invalid"})
        }
        if(!validatePassword(password)){
            return res.status(400).json({status:false,message:"password is invalid"})
        }

        const existingEmail = await User.findOne({
            email:email
        })
        if(!existingEmail){
            return res.status(400).json({status:false,message:"invalid email or password"})
        }

        const pass = await bcrypt.compare(password,existingEmail.password)
        if(!pass){
            return res.status(400).json({status:false,message:"invalid email or password"})
        }

        const token = jwt.sign({userId:existingEmail._id},process.env.JWT_SECRET,{
            expiresIn : "9d"
        })
        return res.status(200).json({status:true,message:"user login successfully",
        token})

    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({status:false,message:"internal server error"})
    }
}
