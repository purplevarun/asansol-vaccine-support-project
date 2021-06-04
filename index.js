const mysql = require('mysql');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyparser = require('body-parser');
const session = require('express-session')
app.set('view engine', 'ejs');
app.use (bodyparser.json());
app.use (bodyparser.urlencoded({extended:false}));
app.use (session({
    secret : 'purplevarun',
    resave : true,
    saveUninitialized : false

}));
const conn = mysql.createConnection({
    'host':'localhost',
    'user':'root',
    'password':'',
});
conn.connect((err) => {
    if (err)
        console.log(err);
    else
        console.log("Connected to Database Server!");
    
});
conn.query("create database if not exists vaccine_db;", (err) => {
    if (err)
        console.log(err);
    else
        console.log("DB Created!");
}); 
conn.query("use vaccine_db;");
conn.query(
    "create table if not exists info\
    (id int not null auto_increment primary key, \
    email text, \
    username text, \
    password text);"
);
app.listen(port, ()=>{
    console.log("Server Connected!");
});
app.get('/', (req,res) => {
    res.render('home');
});
app.get ('/login', (req,res) => {
    res.render ('login',{'msg':login_errors});
    login_errors="";
});
app.get ('/register', (req,res) => {
    res.render ('register');
});
var current_user = -1;
app.post('/login', (req,res) => {
    var info = req.body;
    var un = info['username'];
    var pw = info['password'];
    conn.query(`select * from info where username='${un}' and password='${pw}'`, (err, result)=>{
        if (err)
            console.log(err);
        else 
            console.log(result);
        if (result.length == 0){
            res.render ('login', {'msg':'Wrong Username or Password!'});
        }
        else {
            current_user = result;
            res.redirect('/welcome');
        }
            
    });
});
var login_errors = "";
app.get ('/welcome', (req,res) => {
    console.log("current = ",current_user);
    if (current_user == -1){
        login_errors = "Please login first..";
        res.redirect('/login');
    }
    res.render('welcome',{'info':current_user[0]});
    current_user=-1;
});