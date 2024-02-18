//employee file(models folder)

const mongoose = require('mongoose') //imports mongo

const EmpSchema = new mongoose.Schema({//to define mongoose schema
    idno: Number,
    email : String,
    password : String,
    name : String,
    jobid : Number,
    age :{
        type : Number,
        default : 0
    }
})

const Employees = mongoose.model('Employees',EmpSchema)
module.exports = Employees