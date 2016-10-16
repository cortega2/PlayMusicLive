'use strict'

var model = require('../models/track');

//save badges from model
// exports.save = function(req, res, next){
exports.save = function(track, res){
  //TODO: might need to clone the body, not sure
  model.save(track, function(err){
    if(err) {
      console.log('error saving');
      return res.status(503).json({error:true});
    }
    else{
      model.trim();
      return res.status(200).json({error:false});
    }
  });
}

// gets badges from redis
exports.get = function(req, res){
  model.get(function(err, data){
    if(err)
      return res.json(503, {error: true });
    return res.json(200, data);
  });
};

// TODO:implement the send function to send/broadcast songs to clients/server 2
//      Might not be needed
// export.send = function(){
// }
