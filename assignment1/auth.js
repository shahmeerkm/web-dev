//auth file(routes folder)

const bcrypt = require("bcrypt")//import bcrypt
const Employees = require("../models/employee")//use employee schema model
var express = require("express")//import express
var router = express.Router()//define router
const jwt = require("jsonwebtoken")//import json web token

router.post("/signup", async(req,res)=>{//req takes user input
    try{
        const{email,password,name} = req.body;//collects email and password from req

        // Regular expressions for password requirements
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

        // Check if password meets requirements
        if (!passwordRegex.test(password)) {
            return res.json({ error: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character" });
        }

        // Check if name is at least 3 characters long
        if (name.length < 3) {
            return res.json({ error: "Name should be at least 3 characters long" });
        }

        let Employee = await Employees.findOne({email});//checks if there is one instance of that email in the db
        if (Employee) return res.json({msg : "Employee already exists"});//replies with this message if email taken

        await Employees.create({...req.body, password: await bcrypt.hash(password,5)});//uses bcrypt hashing encryption( 5 means five rounds of hashing )
        return res.json({msg: "Successfully created"});//new emp successfully created
    } catch(error){
        console.error(e);
    }
});

    router.post("/login", async (req, res) => {
        try {
            const { email, password } = req.body//gets email and password entered
    
            const employee = await Employees.findOne({ email })//checks if the email exists
            if (!employee) return res.json({ msg: "Employee not found" })
    
            const passwordCheck = await bcrypt.compare(password, employee.password);//comoares password
            if (!passwordCheck) return res.json({ msg: "Password incorrect" })
    
            const token = jwt.sign({//generates token signature
                email,
                createdAt: new Date(),
                age: employee.age,
            }, "MY_SECRET", { expiresIn: "1d" });//MY_SECRET here is the secret key used with signature
    
            res.json({
                msg: "Login successful", token//successful login message
            })
        } catch (error) {
            console.error(error)
        }
    });
    

module.exports=router;

