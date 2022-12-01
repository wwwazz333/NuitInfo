var express = require('express');
path = require('path');
var app = express();

app.set('view engine', 'ejs'); // the render engine
app.set('views', path.resolve( __dirname, 'views') ); 

app.get('/', function (req, res) {
	res.render('index', {}); 
})

var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("Example app listening at http://%s:%s", host, port)
})