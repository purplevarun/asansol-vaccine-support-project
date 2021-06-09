const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyparser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./models/User');
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(flash());
app.use(express.static(__dirname+"/public"));
app.use(session({
	secret: "hehe boi",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
mongoose.set('useUnifiedTopology',true);
mongoose.set('useNewUrlParser',true);
mongoose.set('useCreateIndex',true);
mongoose.connect('mongodb://localhost',(err)=>{
	if (err) console.log(err);
	else console.log("Connected to MongoDB");
});

const indexRoutes = require('./routes/indexRoutes');
app.use('/', indexRoutes);
app.listen(port,(err)=>{
	console.log(`server started on ${port}`);
});