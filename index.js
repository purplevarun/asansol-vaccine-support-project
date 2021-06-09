const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyparser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(flash());

mongoose.set('useUnifiedTopology',true);
mongoose.set('useNewUrlParser',true);
mongoose.set('useCreateIndex',true);
mongoose.connect('mongodb://localhost',(err)=>{
	if (err) console.log(err);
	else console.log("Connected");
});

app.get('/', (req,res) => {
	req.flash('hemlo');
	res.render('homepage');
});
app.get ('/login', (req,res) => {
	res.render('login');
});
app.get ('/register', (req,res) => {
	res.render('register');
});
app.listen(port,(err)=>{
	console.log(`server started on ${port}`);
});