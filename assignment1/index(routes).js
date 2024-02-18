//index file(routes folder)
const express = require('express');
const router = express.Router();

const authrouter = require("./auth");
const deprouter = require("./department(routes)");

router.use("/auth", authrouter); // for employee ps,email login
router.use("/department", deprouter); // for dept

module.exports = router;
