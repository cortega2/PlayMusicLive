'use strict';

// chrome.runtime.onSuspend.addListener(function callback)
//close message ports here

//messages
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.messageType === 'song' || request.messageType === 'podcast'){
      sendResponse({status : sendToDatabase(request)});
    }

    if (request.messageType === 'switch'){
      if(request.status){
        sendResponse({connected : false});
        checkTabs();
      }
      else{
        disconnect();
        sendResponse({connected : false});
      }
    }
  }
);

function sendToDatabase(song){
  var status = 0;
  //send here using socket io
  console.log(song);
  //need to do some error checking here
  if(true){
    status = 1;
  }
  return status;
}

//attempts to connect to a play music page sends message back with connection status
// function connect(){
//   //TODO: call chektabs and executeLive and return appropriate status
//
//   var message = {
//     messageType: 'connection',
//     connected: true
//   };
//
//   chrome.runtime.sendMessage(message);
//   // , function(response) {
//   //   console.log('status: ' + response.connected);
//   //   if(response.connected)
//   //     setStatus('Connected');
//   //   else if(isOn && !response.connected)
//   //     setStatus('Disconnected');
//   //   else if(!isOn && !response.connected)
//   //     setStatus('Off');
//   // });
// }

function notifyPopup(connected){
  var message = {
    messageType: 'connection',
    connected: connected
  };
  chrome.runtime.sendMessage(message);
}

function notifyLive(status){
  getSavedTabId(function(id){
    var message = {
      messageType: 'running',
      status: status
    };

    if(id > 0)
      chrome.tabs.sendMessage(id, message);
  });
}

//add listeners to open and new tabs to check if the tab is a play music tab
function checkTabs(){
  getSavedStatus(function(status){
    if(!status){
      //save the status so that we dont keep adding listeners
      saveStatus(true);

      //see if the play music tab is open already
      chrome.tabs.query({url: '*://play.google.com/music/listen*', status: 'complete'}, function(tabs){
        if(tabs.length >=1){
          saveTabId(tabs[0].id, executeLive(tabs[0].id));
        }
      });

      //listen to other open tabs
      chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
        if(changeInfo.status = 'complete')
          updatedTab(tabID, tab.url);
      });

      //   //make sure we know when a tab closes
      //   chrome.tabs.onRemoved.addListener(function (tabID, removeInfo){
      //     if(tabID == playTabID){
      //       disconnect();
      //       playTabID = 0;
      //     }
      //   });

      //   //listener for new tabs
      //   chrome.tabs.onCreated.addListener(function (newTab){
      //     chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
      //       if(changeInfo.status = 'complete')
      //         updatedTab(tabID, tab.url);
      //     });
      //   })

      //   //listen for replaced tabs
      //   chrome.tabs.onReplaced.addListener(function (addedTabId, removedTabId){
      //     if(removedTabId == playTabID)
      //       playTabID = addedTabId;
      //   });
    }
    else{
      getSavedTabId(function(id){
        if(id > 0){
          notifyLive(true);
          notifyPopup(true);
        }
        else
          notifyPopup(false);
      });
    }
  });
}

//will inject the live.js file into the play tab
//returns true if there is a music play tab, else false
function executeLive(tabID){
  //avoid executing script multiple times and insert to correct tab
  // if(playTabID != 0 && !isListening){
  console.log('in executeLive');

  chrome.tabs.executeScript(tabID, {file: "live.js"}, function(){
    chrome.storage.local.get('switch', function(items){
      if(items['switch']){
        notifyLive(true);
        notifyPopup(true);
      }
      else{
        notifyLive(false);
        notifyPopup(false);
      }
    });
  });
      // return true;
  // }
  // else
  //  return false;
}

//notify live to stop sending messages, dont need to store this since it is stored by popup.js
function disconnect(){
  console.log('Sending message to live to not send things back');
  notifyLive(false);
  notifyPopup(false);
}

function updatedTab(tabID, url){
  getSavedTabId(function(savedID){
    if(url.includes('play.google.com/music/listen?u=0#') && savedID == -1){
      console.log('HERE');
      saveTabId(tabID, executeLive(tabID));
    }
    //went to a diff page
    else if (!url.includes('play.google.com/music/listen?u=0#') && savedID != -1 && tabID == savedID) {
      saveTabId(-1, disconnect())
    }
  });
}


//storage fucntions need to be used because of the extensions lifetime
//get saved tab id
function saveTabId(id, callback){
  if(callback != undefined)
    chrome.storage.local.set({'tabID': id}, callback);
  else
    chrome.storage.local.set({'tabID': id});
}

//retrieves saved id, need call back since function is async
function getSavedTabId(callback){
  chrome.storage.local.get('tabID', function(items){
      if(items['tabID'] != undefined)
        callback(items['tabID']);
      else
        callback(-1);
  });
}

//storage fucntions need to be used because of the extensions lifetime
function saveStatus(status){
  chrome.storage.local.set({'running': status});
}

//retrieves saved id, need call back since function is async
function getSavedStatus(callback){
  chrome.storage.local.get('running', function(items){
      if(items['running'] != undefined)
        callback(items['running']);
      else
        callback(false);
  });
}
////////////////////////////////////////////////////////////////////////////////
// // this are globals and will need to be stored in storage
// var isOn = false;
// var playTabID = 0;
// var liveSwitchDiv;
// var statusDiv;
// var isListening = false;


// document.addEventListener('DOMContentLoaded', function() {
//   //adding event to a div for now
//   var countButton = document.querySelector('#count-button');
//   countButton.addEventListener('click', getCount);
//
//   liveSwitchDiv = document.querySelector('#live-switch');
//   liveSwitchDiv.click();
//   isOn = false;
//   liveSwitchDiv.addEventListener('click', turnOnOff);
//
//   statusDiv = document.querySelector('#status');
//   setStatus('Off');
//   getSavedSwitchPosition();
//
//   //see if the play music tab is open already
//   chrome.tabs.query({url: '*://play.google.com/music/listen*', status: 'complete'}, function(tabs){
//     if(tabs.length >=1)
//       playTabID = tabs[0].id;
//   });
//
//   //listen to other open tabs
//   chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
//     if(changeInfo.status = 'complete')
//       updatedTab(tabID, tab.url);
//   });
//
//   //make sure we know when a tab closes
//   chrome.tabs.onRemoved.addListener(function (tabID, removeInfo){
//     if(tabID == playTabID){
//       disconnect();
//       playTabID = 0;
//     }
//   });
//
//   //listener for new tabs
//   chrome.tabs.onCreated.addListener(function (newTab){
//     chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
//       if(changeInfo.status = 'complete')
//         updatedTab(tabID, tab.url);
//     });
//   })
//
//   //listen for replaced tabs
//   chrome.tabs.onReplaced.addListener(function (addedTabId, removedTabId){
//     if(removedTabId == playTabID)
//       playTabID = addedTabId;
//   });
// });
//
//

//
//
// function connect(){

//     setStatus('Disconnected');
//   }
// }
//
