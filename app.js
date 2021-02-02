//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());


app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);


passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", (req, res) => {
    res.render("home");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.get("/logout",(req,res)=>{
req.logout();
res.redirect("/");
});
app.get("/secrets",function(req,res){
if(req.isAuthenticated()){
    res.render("secrets");
}
else{
    res.redirect("login");
}
});
app.post("/register", (req, res) => {
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        }
        else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });
});
app.post("/login", (req, res) => {



});
app.listen(3000, () => {
    console.log("Server is running Sucessfully!....");
});