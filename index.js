const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.listen(port,(err)=>{
	console.log(`server started on ${port}`);
});
app.get('/',(req,res)=>{
	res.render('homepage');
});
