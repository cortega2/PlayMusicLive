'use strict'

var redis = require('../lib/redis');
// var broadcast = require('../lib/broadcast'); to be done later, place holder

//save badges to redis database
//track is a json object of track data
exports.save = function(track, callback){
  //verify track is valid
  if(track.type != undefined && track.title != undefined && track.artist != undefined
    && track.album != undefined && track.albumURL != undefined){
    //give url a larger iamage to use
    var splitString = track.albumURL.split('=');
    track.albumURL = splitString[0] + '=s500-c-e100'
    console.log(track);

    // save the track to database
    redis.lpush('tracks', JSON.stringify(track), function(err){
      if(err)
        return callback(err, null);
      else
        return callback(null,null);
    });
  }
  else {
    //TODO: consider making a error to pass instead of just true
    return callback(true, null);
  }
}

//only keep the last ten
exports.trim = function(){
  redis.ltrim('tracks', 0, 9);
}
