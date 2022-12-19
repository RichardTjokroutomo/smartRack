const express = require("express");
const bcrypt = require("bcrypt");
const Router = express.Router();

const userDB = require("../models/userDB");

const bcryptSalt = 10;
const breaker = "=====================================================";

Router.get("/", (req, resp)=>{
    resp.render("signup");
});

Router.post("/", async (req, resp)=>{
    const {username, password} = req.body;
    const User = await userDB.findOne({username : username});
    if(!User){
        console.log("this is a new user!");
        const hash = await bcrypt.hashSync(password, bcryptSalt);
        const newUser = new userDB({username: username, password: hash});
        await newUser.save();

        console.log("new user saved!");
        console.log(newUser);
        console.log(breaker);

        resp.redirect("/login");
    }
    else{
        resp.send("user already exist!");
    }
});

module.exports = Router;