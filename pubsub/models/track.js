'use strict'

// var redis = require('../lib/redis');
// var broadcast = require('../lib/broadcast'); to be done later, place holder

//save badges to redis database
//tracks is an array of track/songs objects
exports.save = function(tracks, callback){
  console.log(tracks);
  var error = false;

  tracks.forEach(function(track){
    //verify track is valid
    if(track.type != undefined && track.title != undefined && track.artist != undefined
      && track.album != undefined && track.albumURL != undefine){
      //TODO save track here, but first modify album url to have larger picture
      console.log('Will save here');
    }
    else {
      //TODO: consider making a error to pass instead of just true
      error = true;
    }
  });

  callback(error, null);
}
