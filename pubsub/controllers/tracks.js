'use strict'

var model = require('../models/track');

//send badges to model
// exports.save = function(req, res, next){
exports.save = function(req, res){
  //TODO: might need to clone the body, not sure
  model.save(req.body, function(err){
    if(err) {
      console.log('error saving');
      return res.status(503).json({error:true});
    }
    else{
      model.trim();
      return res.status(200).json({error:false});
    }
    //used when we have another function
    // next();
  });
}

// TODO:implement the send function to send/broadcast songs to clients/server 2
//      Might not be needed
// export.send = function(){
// }
