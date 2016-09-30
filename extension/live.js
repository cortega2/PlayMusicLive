'use strict'

var currentPlay = document.getElementById('playerSongInfo');
var lastSong = '';
var switchStatus = false;

// create an observer instance
var observer = new MutationObserver(function(mutations) {
    if(switchStatus)
      getCurrentSong();
});

// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true }

// pass in the target node, as well as the observer options
observer.observe(currentPlay, config);

//TODO: clean this function up
function getCurrentSong(){
  var titleDiv = document.getElementById('currently-playing-title');
  var artistDiv = document.getElementById('player-artist');
  var albumDiv = document.getElementsByClassName('player-album')[0];
  var albumArtText = document.getElementById('playerBarArt').src;

  var titleText = titleDiv.innerText;
  var artistText = artistDiv.innerText;
  var albumText = '';

  var type = 'podcast'

  if(albumDiv != undefined){
    albumText = albumDiv.innerText;
    type = 'song';
  }

  //TODO consider making a hash or id for the songs
  var curSong = titleText + artistText + albumText;

  var message = {
    messageType: type,
    titleText: titleText,
    artistText: artistText,
    albumText: albumText,
    albumArtText: albumArtText
  }

  if(curSong != lastSong){
    lastSong = curSong;
    chrome.runtime.sendMessage(message, function(response) {
      //TODO: figure out if I need the status
      console.log('status: ' + response.status);
    });
  }
}


// messages
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.messageType === 'running'){
      switchStatus = request.status;
    }
  }
);

// later, you can stop observing
// observer.disconnect();
