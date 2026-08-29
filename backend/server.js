const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const sequelize = require("./utils/dbConfig")
const userRoute = require("./routes/userRoute")

const port = 4500
const app = express()
app.use(express.json())

app.get("/", (req,res)=>{
    res.send("server is working")
})

app.use("/", userRoute)
sequelize.sync().then(()=>{
   app.listen(port , ()=>{
    console.log("server is connected")
})
}).catch((error)=>{
    console.log(error)
})
