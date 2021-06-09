var express = require('express');
var router = express.Router();
var passport = require('passport');
var nodemailer = require('nodemailer');
var multer = require ('multer');

var User = require ('../models/User');

router.get('/', (req,res) => {
	req.flash('hemlo');
	res.render('homepage');
});
router.get ('/login', (req,res) => {
	res.render('login');
});
router.get ('/register', (req,res) => {
	res.render('register');
});

module.exports = router;