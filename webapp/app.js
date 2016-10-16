'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
// app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

var http = require('http').Server(app);
var io = require('socket.io')(http);
var pubsub_io = require("socket.io-client")('http://localhost:8000');


app.use(express.static('public'));  //server static files

app.get('/', function(req, res){
  res.sendfile('./public/index.html');
});

app.post('/', function(req, res){
  console.log('Not implemented yet');
});

//TODO: look for better way of storing the port numbers
http.listen(8080, function(){
  console.log('PubSub listening on port 8080');
});

//connected to pubsub_io
pubsub_io.on("connect",function(){
  pubsub_io.on('track',function(data){
    // We received a message from Server 2
    console.log(data);

    //send messages to client
    io.emit('track', data);


  });
});

io.on('connection', function(socket){
  //send messages here when something happens
  console.log('connected to the client');
})
