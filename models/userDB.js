if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

const breaker = "=====================================================";
const dbUrl =process.env.DB_URL || 'mongodb://localhost:27017/rack-user-database';

mongoose.connect(dbUrl)
.then(()=>{
    console.log("connected to dbUrl!");
    console.log(breaker);
})
.catch((e)=>{
    console.log(e);
    console.log("oops! and error has occured!");
    console.log(breaker);
});

const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    DryingInProgress: {
        type: Boolean,
        default: false
    }
});

const User = new mongoose.model("User", userSchema);

module.exports = User;