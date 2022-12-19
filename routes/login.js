const express = require("express");
const bcrypt = require("bcrypt");

const userDB = require("../models/userDB");

const Router = express.Router();
const breaker = "======================================================";


// ROUTING STUFF
// ===========================================================================================================
Router.get("/", (req, resp)=>{
    let loginFailed = false;
    resp.render("login", {loginFailed});
});

Router.post("/", async (req, resp) =>{
    const {username, password} = req.body;
    const getUser = await userDB.findOne({username: username});

    if(getUser){
        const validPass = await bcrypt.compare(password, getUser.password);
    if(validPass){
        req.session.userId = await getUser.username;
        console.log("User session: ", req.session.userId);
        resp.redirect("/");
    }
    else{
        resp.redirect("/signup");
    }
    }
    else{
        resp.redirect("/signup");
    }
}
);


module.exports = Router;