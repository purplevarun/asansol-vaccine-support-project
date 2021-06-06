const mysql = require('mysql');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyparser = require('body-parser');
const session = require('express-session')
const multer = require('multer');
const path = require("path");
const storage = multer.diskStorage({
   destination :  (req,file,cb) => {
    cb(null,"public/uploads")
   },
   filename: (req, file, cb)=>{
        console.log(file);
        cb(null, Date.now()+file.originalname);
   }
});
const upload = multer({
    storage:storage
});
app.set('view engine', 'ejs');;
app.use(express.static('public'))
app.use (bodyparser.json());
app.use (bodyparser.urlencoded({extended:false}));
app.use (session({
    secret : 'purplevarun',
    resave : true,
    saveUninitialized : false

}));
// remote db
// const host = 'remotemysql.com';
// const user = '1vUSJFONyV';
// const password = 'j2KWkjfgS1';
// const db_name = '1vUSJFONyV';


// local db
const host = 'localhost';
const user = 'root';
const password = '';
const db_name = 'test';
const conn = mysql.createConnection({
    'host' : host,
    'user' : user,
    'password' : password,
    'database' : db_name
});
conn.connect((err) => {
    if (err)
        console.log(err);
    else
        console.log("Connected to Database Server!");
    
});
// conn.query("create database if not exists vaccine_db;", (err) => {
//     if (err)
//         console.log(err);
//     else
//         console.log("DB Created!");
// }); 
conn.query(`use ${db_name};`);
conn.query(
    "create table if not exists info\
    (id int not null auto_increment primary key, \
    email text, \
    username text, \
    password text);"
);
conn.query(
    "create table if not exists centers\
    (username text,name text, landmark text, \
    type text, pic text, address text);"
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
    var em = info['email'];
    var pw = info['password'];
    conn.query(`select * from info where email='${em}' and password='${pw}'`, (err, result)=>{
        if (err)
            console.log(err);
        else 
            console.log("result = ",result);
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
    else {
        res.render('welcome',{'info':current_user[0]});
        // current_user=-1; // comment out during development
    }
});
app.post ('/register',(req,res) => {
    var info = req.body;
    // console.log(info);
    var em = info['email'];
    var un = info['username'];
    var pw = info['password'];
    conn.query(`insert into info(email,username,password)\
    values('${em}','${un}','${pw}')`,(err,result)=>{
        if (err) console.log(err);
        // else console.log(result);
        else
            console.log("Data Inserted into Info Table!");
    });
    login_errors="You can login now!";
    res.redirect("/login");
});
app.post ('/logout', (req,res) => {
    current_user = -1;
    res.redirect('/');
});
app.get ('/user/:id', (req,res) => {
    var username = req.params.id;
    conn.query (`select * from info where username = "${username}"`, (err, result)=> {
        if (err) console.log (err);
        res.render ('user',{'info':result[0]});
    });
});
app.get ('/newCenter', (req,res)=>{
    res.render ('newcenter',{'info':current_user[0]});
});
app.post('/newcenter',(upload.single('photo')),(req,res)=>{
    var info = req.body;
    var filepath = req.file.path;
    filepath = filepath.replace("public\\uploads","");
    var username = current_user[0]['username'];
    var name = info['name'];
    var land = info['landmark'];
    var type = info['type'];
    var add = info['address'];
    conn.query(
        `insert into centers values(\
        '${username}',\
        '${name}',\
        '${land}',\
        '${type}',\
        '${filepath}',\
        '${add}');`
    );
    res.redirect('/welcome');
});











