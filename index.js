const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({path : "./.env"})
const userRoute = require("./src/routes/user")
const bookRoute = require("./src/routes/book")
const reviewRoute = require("./src/routes/reviews")
const cors = require("cors")

const app = express()
app.use(cors());  // cors always express.json k phle hi use hoga otherwise error dega.
app.use(express.json());
app.use("/api/user",userRoute)
app.use("/api/book",bookRoute)
app.use("/api/review",reviewRoute);


mongoose.connect(process.env.DB).then(()=>{
    console.log("mogoDb is connected")
}).catch((error)=>{
    console.log(error)
})

port = process.env.PORT
app.listen(port,function(){
    console.log(`app is listening on port ${port}`)
})


