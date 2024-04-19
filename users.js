//users file(models folder)

const mongoose = require('mongoose') //imports mongo

const UserSchema = new mongoose.Schema({//to define mongoose schema
    idno: Number,
    email : String,
    password : String,
    name : String,
    jobid : Number,
    isadmin: {
        type: Boolean,
        default: false,
      },
    age :{
        type : Number,
        default : 0
    }
})

const users = mongoose.model('users',UserSchema)
module.exports = users