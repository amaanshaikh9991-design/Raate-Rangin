require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// MYSQL CONNECTION
const db = mysql.createConnection({
    uri: process.env.DATABASE_URL
});

db.connect((err) => {

    if(err){
        console.log("DATABASE CONNECTION ERROR:");
        console.log(err);
    } else {
        console.log("MySQL Connected");
    }

});

// CREATE USERS TABLE
db.query(`
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
)
`, (err) => {

    if(err){
        console.log("TABLE CREATION ERROR:");
        console.log(err);
    } else {
        console.log("Users table ready");
    }

});

// HOME ROUTE
app.get("/", (req,res)=>{
    res.redirect("/login.html");
});

// SIGNUP
app.post("/signup", async (req,res)=>{

    try{

        const email = req.body.email.trim();
        const password = req.body.password.trim();

        const hashedPassword = await bcrypt.hash(password,10);

        db.query(
            "INSERT INTO users (email,password) VALUES (?,?)",
            [email,hashedPassword],
            (err,result)=>{

                if(err){

                    console.log("SIGNUP DATABASE ERROR:");
                    console.log(err);

                    return res.send("User already exists or DB error");
                }

                return res.redirect("/login.html");

            }
        );

    }catch(error){

        console.log("SIGNUP ERROR:");
        console.log(error);

        return res.send("Signup Error");

    }

});

// LOGIN
app.post("/login",(req,res)=>{

    const email = req.body.email.trim();
    const password = req.body.password.trim();

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err,result)=>{

            if(err){

                console.log("LOGIN DATABASE ERROR:");
                console.log(err);

                return res.send("Database Error");

            }

            if(result.length > 0){

                const user = result[0];

                const match = await bcrypt.compare(
                    password,
                    user.password
                );

                if(match){

                    req.session.user = user;

                    return res.redirect("/index.html");

                }else{

                    return res.send("Wrong Password");

                }

            }else{

                return res.send("User not found");

            }

        }
    );

});

app.listen(3000,()=>{
    console.log("Server Started On Port 3000");
});