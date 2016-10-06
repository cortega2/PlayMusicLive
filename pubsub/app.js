'use strict'

var app = require('express')();
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var http = require('http').Server(app);
var io = require('socket.io')(http);
var tracks = require('./controllers/tracks');

app.get('/', function(req, res){
  console.log('Not implemented yet');
});

app.post('/', tracks.save);

// io.on('connection', function(socket){
//   //send messages here when something happens
// })

//TODO: look for better way of storing the port numbers
app.listen(8000, function(){
  console.log('PubSub listening on port 8000');
});
