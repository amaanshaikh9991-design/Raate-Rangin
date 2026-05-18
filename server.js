require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
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

// POSTGRESQL CONNECTION
const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect()
.then(() => {
    console.log("Supabase PostgreSQL Connected");
})
.catch((err) => {
    console.log("DATABASE CONNECTION ERROR:");
    console.log(err);
});

// CREATE USERS TABLE
db.query(`
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
)
`)
.then(() => {
    console.log("Users table ready");
})
.catch((err) => {
    console.log("TABLE CREATION ERROR:");
    console.log(err);
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
            "INSERT INTO users (email,password) VALUES ($1,$2)",
            [email,hashedPassword]
        )
        .then(() => {
            return res.redirect("/login.html");
        })
        .catch((err) => {

            console.log("SIGNUP DATABASE ERROR:");
            console.log(err);

            return res.send("User already exists or DB error");

        });

    }catch(error){

        console.log("SIGNUP ERROR:");
        console.log(error);

        return res.send("Signup Error");

    }

});

// LOGIN
app.post("/login", async (req,res)=>{

    try{

        const email = req.body.email.trim();
        const password = req.body.password.trim();

        const result = await db.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if(result.rows.length > 0){

            const user = result.rows[0];

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

    }catch(err){

        console.log("LOGIN DATABASE ERROR:");
        console.log(err);

        return res.send("Database Error");

    }

});

app.listen(3000,()=>{
    console.log("Server Started On Port 3000");
});