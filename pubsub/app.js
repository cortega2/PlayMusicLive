'use strict'

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){

});

app.pos('/', function(req, res){

});

io.on('connection', function(socket){
  //send messages here when something happens
})
