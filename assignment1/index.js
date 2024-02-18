var createError = require('http-errors'); //imports http errors 
var express = require('express'); //imports express
const mongoose = require('mongoose'); //imports mongo

var app = express();//storing the express function in app

app.use(express.json());//to enable data in json format
app.use(express.urlencoded({ extended:false}));


(async () => {//connecting to mongodb
    try{
        await mongoose.connect("mongodb+srv://shahmeerkm:saadan10@cluster0.pxswkmj.mongodb.net/test")
        console.log('connected successfully');//successful connection
    }catch(error){
        console.error('',error);//unsuccessful connection
    }
})()

const router = require ('./routes/index(routes)');//brings all the merged routes from the index file in routes
app.use('/', router);

app.use(function(req,res,next){//generate for error 404
    next(createError(404));
});

const PORT = 5600;//will listen on this port
app.listen(PORT,console.log(`Server running port ${PORT}`));//listens and if successful prints this message