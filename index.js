const mysql = require('mysql');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');

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
app.listen(port, ()=>{
    console.log("Server Connected!");
});
app.get('/', (req,res) => {
    res.render('home');
});
