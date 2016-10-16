'use strict';

$(function(){
  var trackCount = 0;
  var rowCount = 0;
  var colCount = 0;

  var socket = io.connect(); //connects to same host
  socket.on('track', function(track){
    if(trackCount%3 == 0){
      var $row = $('<div class=row id="row' + rowCount + '"></div>');
      $('.container').prepend($row);
    }

    var $col = $(
      '<div class="col-sm-4">' +
      '<img src="' + track.albumURL + '" alt="Track album art">' +
      '<div class="track-info">' +
        '<h2>' + track.title + '</h2>' +
        '<h3>' + track.artist + ((track.type != 'podcast')? ' - ' : ' ') + track.album + '</h3>' +
      '</div>' +
      '</div>'
    );

    $('#row' + rowCount).prepend($col);
    trackCount ++;
  });
});
