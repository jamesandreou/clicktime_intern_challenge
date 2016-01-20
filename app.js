var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 5000;


app.use(express.static('views'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/views/index.html');
});

server.listen(5000, function(){
	console.log('Starting James Andreou\'s drawing app');
});

io.on('connection', function(socket){
	socket.on('line', function(line){
		io.emit('line', line);
	});
});