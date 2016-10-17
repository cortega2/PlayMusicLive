'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var http = require('http').Server(app);
var io = require('socket.io')(http);
var pubsub_io = require("socket.io-client")('http://localhost:8000');
var request = require('request')

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
    //send messages to client
    io.emit('track', data);
  });
});

io.on('connection', function(socket){
  //send messages here when something happens
  console.log('connected to the client');

  //get badges from the server
  getTracks(function(err, data){
    if(err) return;
    data.reverse();
    data.forEach(function(track){
      socket.emit('track', track);
    });
  });
})

function getTracks(callback){
  request('http://localhost:8000/tracks', function(err, response, body){
    callback(err, JSON.parse(body));
  });
}
