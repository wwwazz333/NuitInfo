var express = require('express');
require("path");
var app = express();

app.use(express.static('public'))
app.use('/css', express.static(__dirname + "public/css"));
app.use('/font', express.static(__dirname + "public/font"));
app.use('/html', express.static(__dirname + "public/html"));

app.use('/build/', express.static(__dirname + "node_modules/three/build"));
app.use('/jsm/', express.static(__dirname + "node_modules/three/exemples/jsm"));

//app.use('/scripts', express.static(__dirname + "public/scripts"));


app.set('views', './views');
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
	res.render('index', { root: __dirname })
})
app.get('/game', function (req, res) {
	res.render('game', { root: __dirname })
})
app.post('/game', function (req, res) {
	res.redirect("/game");
	// res.render('game', { root: __dirname })
})




var server = app.listen(8080, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("Example app listening at http://localhost:8080")
})