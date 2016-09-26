'use strict';

// var playTabID = 0;
// var isListening = false;

var isOn = false;
var liveSwitchDiv;
var statusDiv;

//will init things here
document.addEventListener('DOMContentLoaded', function() {
  //adding event to a div for now
  // var countButton = document.querySelector('#count-button');
  // countButton.addEventListener('click', getCount);

  liveSwitchDiv = document.querySelector('#live-switch');
  liveSwitchDiv.click();
  isOn = false;
  liveSwitchDiv.addEventListener('click', turnOnOff);

  statusDiv = document.querySelector('#status');
  setStatus('Off');
  getSavedSwitchPosition();
});

function turnOnOff(){
  if(isOn)
    isOn = false;
  else
    isOn = true;

  //sends status to eventPage
  callBackground();

  //TODO: only save when the popup is closed
  saveSwitchPosition();
}

//setting status text in div
function setStatus(status){
  //TODO: Innsert actual dom element, have color change with status
  statusDiv.innerText = status;
}

//storage fucntions
function saveSwitchPosition(){
  chrome.storage.local.set({'switch': isOn});
}

function getSavedSwitchPosition(){
  chrome.storage.local.get('switch', function(items){
      if(items['switch']){
        liveSwitchDiv.click();
      }
  });
}

//sends a message to eventPage and sets status based on ehat eventPage returns
function callBackground(){
  //send switch status to eventPage
  var message = {
    messageType: 'switch',
    status: isOn
  };

  chrome.runtime.sendMessage(message, function(response) {
    console.log('status: ' + response.connected);
    if(response.connected)
      setStatus('Connected');
    else if(isOn && !response.connected)
      setStatus('Disconnected');
    else if(!isOn && !response.connected)
      setStatus('Off');
  });
}

//messages
chrome.runtime.onMessage.addListener(
  function(request, sender) {
    if (request.messageType === 'connection'){
      // sendResponse({status : sendToDatabase(request)}); TODO: check if i need to use the callback
      if(request.connected)
        setStatus('Connected');
      else
        setStatus('Disconnected');
    }
    return;
  }
);


////////////////////////////////////////////////////////////////////////////////
// //TODO: move this to its own file
// function getCount(){
//   // get current tab
//   chrome.tabs.query({active: true, currentWindow : true}, function(tabs){
//     console.log(tabs[0].url);
//     //logic to check that the url is something like play.google/music or something
//     //if it is then add some listener for the play button, if playing then look at what is playing
//     if(tabs[0].url === 'https://play.google.com/music/listen?u=0#/all'){
//       chrome.tabs.executeScript(null, {file: "counter.js"});
//     }
//   });
// }
//
