'use strict'

var app = require('express')();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
// app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

var http = require('http').Server(app);
var io = require('socket.io')(http);
var tracks = require('./controllers/tracks');

app.get('/', tracks.get);

app.post('/', function(req, res){
  var track = req.body;
  //check if track is valid
  if(track.type != undefined && track.title != undefined && track.artist != undefined
    && track.album != undefined && track.albumURL != undefined){
    //give url a larger iamage to use
    var splitString = track.albumURL.split('=');
    track.albumURL = splitString[0] + '=s500-c-e100'

    io.emit('track', track);
    tracks.save(track, res);
  }
  else
    return res.status(503).json({error:true});
});

io.on('connection', function(socket){
  //send messages here when connected
  console.log('Connected to socket');
  // io.emit('tracks', tracks.get());
  // socket.on('my other event', function (data) {
    // console.log(data);
  // });
})

//TODO: look for better way of storing the port numbers
http.listen(8000, function(){
  console.log('PubSub listening on port 8000');
});

function broadcast(){

}
