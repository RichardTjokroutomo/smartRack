if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const loginRoute = require("./routes/login");
const signupRoute = require("./routes/signup");

const app = express();
const port = process.env.PORT || 3000;
const DBURL = process.env.DB_URL || 'mongodb://localhost:27017/rack-user-database';
const breaker = "======================================================";

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
    console.log(breaker);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/public")));
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

// passport stuff
// =========================================================================================================
// SETTING UP PASSPORT
// ===============================================================================
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    store: MongoStore.create({
      mongoUrl: DBURL,
      dbName: 'MyDatabaseName',
      touchAfter: 24 * 3600 // time period in seconds
    })
  }));

// ROUTING
// =========================================================================================================
app.get("/", (req, resp)=>{
    let session = false;
    if(req.session.userId){
        session = req.session.userId;
    }
    resp.render("home", {session});
});
app.use("/login", loginRoute);
app.use("/signup", signupRoute);

app.get("/logout", (req, resp)=>{
    req.session.userId = false;

    resp.redirect("/");
})