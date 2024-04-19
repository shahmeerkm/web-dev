//auth file(routes folder)

const bcrypt = require("bcrypt")//import bcrypt
var express = require("express")//import express
var router = express.Router()//define router
const jwt = require("jsonwebtoken")//import json web token
const users = require("../models/users")//import user schema
const recipes = require("../models/recipes")//use recipe schedma model
const ingredients = require("../models/ingredients")//use ingredients schedma model

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

        let user = await users.findOne({email});//checks if there is one instance of that email in the db
        if (user) return res.json({msg : "User already exists"});//replies with this message if email taken

        await users.create({...req.body, password: await bcrypt.hash(password,5)});//uses bcrypt hashing encryption( 5 means five rounds of hashing )
        return res.json({msg: "Successfully created"});//new user successfully created

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});

    router.post("/login", async (req, res) => {
        try {
            const { email, password } = req.body//gets email and password entered
    
            const user = await users.findOne({ email })//checks if the email exists
            if (!user) return res.json({ msg: "user not found" })
    
            const passwordCheck = await bcrypt.compare(password, user.password);//compares password
            if (!passwordCheck) return res.json({ msg: "Password incorrect" })
    
            const token = jwt.sign({//generates token signature
                email,
                createdAt: new Date(),
                age: user.age,
            }, "MY_SECRET", { expiresIn: "1d" });//MY_SECRET here is the secret key used with signature
    
            res.json({
                msg: "Login successful", token//successful login message
            })
        } catch (error) {
            console.error(error)
        }
    });
    
    router.post("/AddIngredient", async (req, res) => {
        try {
            const { ingredientid, name, description, email } = req.body; // Extracting fields from the request body
            const user = await users.findOne({ email }); // Finding user by email
    
            if (!user) {
                return res.json({ msg: "User not found" });
            }
            if (!user.isadmin) {
                return res.status(403).json({ error: "Access denied. User is not an admin." });
            }
            try {
                const token = req.headers.authorization;
                const decodedUser = jwt.verify(token.split(" ")[1], "MY_SECRET");
    
                await ingredients.create({ ingredientid, name, description});
                res.json({ msg: "Ingredient created successfully" });
            } catch (e) {
                return res.json({ msg: "Token not found/incorrect" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Server Error" });
        }
    }); /*
    router.post("/AddIngredientToRecipe", async (req, res) => {
        try {
            const { recipeid,ingredient} = req.body; // Extracting fields from the request body
            const user = await users.findOne({ email }); // Finding user by email
    
            if (!user) {
                return res.json({ msg: "User not found" });
            }
            if (!user.isadmin) {
                return res.status(403).json({ error: "Access denied. User is not an admin." });
            }
            try {
                const token = req.headers.authorization;
                const decodedUser = jwt.verify(token.split(" ")[1], "MY_SECRET");
    
                await ingredients.create({ ingredient, name, description});
                res.json({ msg: "Ingredient created successfully" });
            } catch (e) {
                return res.json({ msg: "Token not found/incorrect" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Server Error" });
        }
    });
*/

    router.post("/AddRecipe", async (req, res) => {
        try {
            const { recipeid, name, description, email,ingredient } = req.body; // Extracting fields from the request body
            const user = await users.findOne({ email }); // Finding user by email
    
            if (!user) {
                return res.json({ msg: "User not found" });
            }
            if (!user.isadmin) {
                return res.status(403).json({ error: "Access denied. User is not an admin." });
            }
            try {
                const token = req.headers.authorization;
                const decodedUser = jwt.verify(token.split(" ")[1], "MY_SECRET");
    
                await recipes.create({ recipeid, ingredient, name, description});
                res.json({ msg: "Recipe created successfully" });
            } catch (e) {
                return res.json({ msg: "Token not found/incorrect" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Server Error" });
        }
    });
    
    router.post("/GetAllRecipes", async (req, res) => {
        try {
            let recipe = await recipes.find(); // Fetch all recipes

            if (!recipe || recipe.length === 0) {
                return res.json({ msg: "No recipes found" }); // No recipes found
            }
            
            res.json({ msg: "Recipes found", data: recipes }); // Recipes found
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Server Error" }); // Server error
        }
    });
    
    router.post("/GetRecipeWithIngredients", async (req, res) => {
        try {
            const recipe = await recipes.findOne({ recipeid: req.body.recipeid }).populate("Ingredients")
            if (!recipe) return res.json({ msg: "Recipe not found" })
            res.json({ msg: "Recipe found", data: recipe })
        } catch (error) {
            console.error(error)
        }
    });


module.exports=router;

