const express = require('express')
const app = express()


require('dotenv').config()
const PORT = process.env.PORT

//importing route
const fileUploaderRoute = require('./route/fileUpload')

app.use(express.json())
app.use(express.urlencoded({extended:false}))



app.use('/file',fileUploaderRoute)









// not found handler
app.use((req,res)=>{
    res.status(400).json({error:`${req.originalUrl} is not found on this server`})
})


//error handler
app.use((err,req,res,next)=>{
 res.status(500).json({err : err.message})
})



app.listen(PORT, ()=>{
    console.log(`Server is running on PORT: ${PORT} `)
})