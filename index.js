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
conn.query("create database if not exists db1;", (err) => {
    if (err)
        console.log(err);
    else
        console.log("DB Created!");
}); 
conn.query("use db1;");
conn.query("create table if not exists info (email text, username text, password text);")
app.listen(port, ()=>{
    console.log("Server Connected!");
});
app.get('/', (req,res) => {
    res.render('home');
});
app.get ('/login', (req,res) => {
    res.render ('login');
});
app.get ('/register', (req,res) => {
    res.render ('register');
});
app.post('/login', (req,res) => {
    var info = req.body;
    var un = info['username'];
    var pw = info['password'];
    conn.query(`select * from info where username='${un}' and password='${pw}'`, (err, res)=>{
        if (err)
            console.log(err);
        else 
            console.log(res);
        if (res.length == 0)
            console.log("NO DATA");
        else 
            console.log("DATA FOUND",res[0]['email']);
    });
});