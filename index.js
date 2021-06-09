var express = require('express');
var app = express();
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`server running at ${port}`);
});

app.set('view engine', 'ejs');

app.use(express.static('public'));


