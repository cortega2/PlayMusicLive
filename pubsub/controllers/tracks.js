'use strict'

var model = require('../models/track');

//send badges to model
// exports.save = function(req, res, next){
exports.save = function(req, res){
  //TODO: do some data checks to make sure that
  //TODO: might need to clone the body, not sure

  console.log(req.body);

  model.save(req.body, function(err){
    if(err) {
      console.log('error saving');
      return res.status(503).json({error:true});
    }
    else{
      return res.status(200).json({error:false});
    }

    //used when we have another function
    // next();

    //TODO: implement trim function to only keep 10 or 20 tracks at a time
    // model.trim();
  });
}

// TODO:implement the send function to send/broadcast songs to clients/server 2
//      Might not be needed
// export.send = function(){
// }
