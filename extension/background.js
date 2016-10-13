'use strict';

// chrome.runtime.onSuspend.addListener(function callback)
//close message ports here

//messages
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.messageType === 'song' || request.messageType === 'podcast'){
      //TODO: figure out way to remove the return status since it is not needed anymore
      sendResponse({status : 1});
      sendToDatabase(request);
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
  var trackInfo = {
    type: song.messageType,
    title: song.titleText,
    artist: song.artistText,
    album: song.albumText,
    albumURL: song.albumArtText
  };

  //connection to pubsub server
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:8000');
  xhr.setRequestHeader( 'Content-Type', 'application/json' );
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4){
      //TODO if response is an error then stop sending things to database
      console.log(xhr.responseText);
    }
  }
  xhr.send(JSON.stringify(trackInfo));
}

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

      //make sure we know when a tab closes
      chrome.tabs.onRemoved.addListener(function (tabID, removeInfo){
        getSavedTabId(function (savedID){
          if(tabID == savedID){
            saveTabId(-1, disconnect());
          }
        });
      });

      //listener for new tabs
      chrome.tabs.onCreated.addListener(function (newTab){
        chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
          if(changeInfo.status = 'complete')
            updatedTab(tabID, tab.url);
        });
      });

      //listen for replaced tabs, neede because the tab id might change
      chrome.tabs.onReplaced.addListener(function (addedTabId, removedTabId){
        getSavedTabId(function(savedID){
          if(removedTabId == savedID){
            saveTabId(addedTabId);
          }
        });
      });
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
function executeLive(tabID){
  //avoid executing script multiple times and insert to correct tab
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
