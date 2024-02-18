//department file (routes folder)

const Departments = require("../models/department")//use department schedma model
const Employees = require("../models/employee")//use employee schema model
const bcrypt = require("bcrypt")//import bcrypt
var express = require("express")//import express
var router = express.Router()//define router
const jwt = require("jsonwebtoken")//imports json webtoken

//create job API
//job Ids are unique for every employee
router.post("/CreateJob", async(req,res)=>{
    try{
        const employee = await Employees.findOne({email: req.body.email})//stores the input email in the email variable and checks the db for one instance of this email
        if (!employee) return res.json({msg : "Employee not found"});//incase employee not found
        try{
            const token = req.headers.authorization//reads the token from authorization part in headers
            const employee = jwt.verify(token.split(" ")[1],"MY_SECRET")
            if(employee.age<18) return res.json({msg: "Must be 18 and above"})//check to see that all employees must be 18+
        }catch(e){
            return res.json({msg : "Token not found/incorrect"})//make sure edited tokens are not accepted
        }
        await Departments.create({...req.body,employee:employee.id})//creates job with the necessary details
        res.json({msg : "job created"})//successful message
}catch(error){
    console.error(error)
}
});

//delete emloyee API based on jobid
router.post("/DeleteById", async (req, res) => {
    try {
        const employee = await Employees.findOne({ jobid: req.body.jobid });//stores and checks the db for one instance of this id
        if (!employee) return res.json({ msg: "Employee not found" })//incase employee is not found
        await Employees.deleteOne({ jobid: req.body.jobid });//deletes employee from Employees database
        await Departments.deleteOne({ jobid: req.body.jobid });////deletes employee from department database
        res.json({ msg: "Employee deleted" });//successful deletion
    } catch (error) {
        console.error(error)
    }
});

//update employee API
router.post("/UpdateEmp", async (req, res) => {
    try {
        const { idno, jobid, name, email, password, age } = req.body;//gets all details to update accordingly

        // Check if employee with given id exists
        const employee = await Employees.findOne({ idno });
        if (!employee) {return res.status(404).json({ msg: "Employee not found" });
    }
        const job = await Departments.findOne({ jobid });//to also update in departments table

        //updating job
        if (jobid) {
            employee.jobid = jobid;
            job.jobid = jobid;
        }
        //updating name
        if (name) {
            employee.name = name;
        }
        //updating email
        if (email) {
            employee.email = email;
        }
        //updating age
        if (age) {
            employee.age = age;
        }
        //updating password
        if (password) {
            // Check password requirements to make sure new password also aligns
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
            if (!passwordRegex.test(password)) {
                return res.json({ error: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character" });
            }
            // Hash and update password
            employee.password = await bcrypt.hash(password, 5);
        }

        await employee.save();//save changes in employees table
        await job.save();

        res.json({ msg: "Employee data updated" });//sucessful updating
    } catch (error) {
        console.error(error);
    }
});

//read data API
router.post("/GetById", async (req, res) => {
    try {
        const employee = await Employees.findOne({ idno: req.body.idno });//find given id
        if (!employee) return res.json({ msg: "Employee Not Found" })//unsuccsessful
        res.json({ msg: "Employee found", data: employee });//display successful message and data accordingly
    } catch (error) {
        console.error(error);
    }
});

router.post("/getByIdWithJob", async (req, res) => {
    try {
        const job = await Departments.findOne({ jobid: req.body.jobid }).populate("employee")
        if (!job) return res.json({ msg: "Job/employee not found" })
        res.json({ msg: "Job/employee found", data: job })
    } catch (error) {
        console.error(error)
    }
});



module.exports=router