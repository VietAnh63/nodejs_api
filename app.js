const express = require("express")

//Su dung logger de client request len cai gi
const logger = require("morgan")

//Config body-parser
const bodyParser = require("body-parser")


//db Mongoose
const mongoClient = require("mongoose")
// connect mongodb by mongoose
mongoClient.connect("mongodb://localhost/nodejsapi", { useNewUrlParser: true, useUnifiedTopology: true })
     .then(()=>{
          console.log("connect successfully…")
     })
     .catch((error)=>{
          console.error(`connect failed with error : ${error}`)
     })

const app = express()
const routerUser = require("./routes/user")

//Middlewares
app.use(logger("dev"))
app.use(bodyParser.json())

//Routes
app.use("/user", routerUser)


app.get("/",(req,res,next)=>{
     return res.status(200).json({message : "Server is update OK"})
})



//Cath 404 errors
app.use((req,res,next)=>{
     const err = new Error("Not found")
     err.status = 404
     next(err)
})

//Function for handle error
app.use((err, req, res, next)=>{
     //get error
     const error = app.get("env") === "development" ? err : {}

     //get status of error
     const status = err.status || 500

     //response to client
     return res.status(status).json({
          error : {
               message : error.message
          }
     })
})

const port = app.get('port') || 3000
app.listen(port, () => {
     console.log(`Server is listening on port ${port}`)
})