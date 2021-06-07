const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.listen(port,(err)=>{
	console.log(`server started on ${port}`);
});
app.get('/',(req,res)=>{
	res.send('<h1>hello world</h1>');
});