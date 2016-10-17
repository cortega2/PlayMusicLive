'use strict'

var redis = require('../lib/redis');

//save badges to redis database
//track is a json object of track data
exports.save = function(track, callback){
  redis.lpush('tracks', JSON.stringify(track), function(err){
    if(err)
      return callback(err, null);
    else
      return callback(null,null);
  });
}

//get track info from redis
exports.get = function(callback){
  redis.lrange('tracks', 0, -1, function(err, data){
    if(err)
      return callback(err, null)
    else
      return callback(null, data.map(JSON.parse));
  });
}

//only keep the last ten
exports.trim = function(){
  redis.ltrim('tracks', 0, 12);
}
