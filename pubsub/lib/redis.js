'use strict'

var redis = require('redis');
var client = redis.createClient(); //defaults redis options, port 3579

//handle errors
client.on('error', function(err){
  throw err;
});

module.exports = client;
