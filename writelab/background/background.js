'use strict';

const BASE_URL = 'https://app.writelab.com';
const API_URL = BASE_URL + '/api/demo/';
const REQUEST_TIMEOUT = 10000;

// Get the browser being used
const userAgent = navigator.userAgent.toLowerCase();
const source = ['chrome', 'firefox'].find(function(browser) {
  return userAgent.indexOf(browser) > -1;
});

// Send a message to the content scripts of certain tabs
function sendToTabs(query, message) {
  chrome.tabs.query(query, function(tabs) {
    tabs.forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, message);
    });
  });
}

// Submit the text and pass on the URL for checking the status
function submitText(text) {
  return new Promise(
    function(resolve, reject) {
      var request = new XMLHttpRequest();
      request.open('POST', API_URL);
      request.timeout = REQUEST_TIMEOUT;

      request.onreadystatechange = function() {
        if (this.readyState === this.HEADERS_RECEIVED) {
          if (this.status === 202) {
            resolve(BASE_URL + this.getResponseHeader('Location'));
          } else {
            reject();
          }
        }
      };
      request.ontimeout = reject;

      request.send(JSON.stringify({text: text, source: source}));
    }
  );
}

// Poll the status URL for completion with an exponential delay. When done,
// stop polling and pass on the JSON response.
function getComments(statusURL) {
  return new Promise(
    function(resolve, reject) {
      var delay = 1000;
      var rejected = false;

      function poll() {
        var request = new XMLHttpRequest();
        request.open('GET', statusURL);
        request.timeout = REQUEST_TIMEOUT;

        request.onreadystatechange = function() {
          if (this.readyState === this.DONE) {
            if (this.status !== 200) {
              reject();
            } else if (this.responseURL !== statusURL) {
              var json = JSON.parse(this.responseText);
              json.demoURL = BASE_URL + json.demoURL;
              resolve(json);
            } else if (!rejected) {
              delay *= 2;
              setTimeout(poll, delay);
            }
          }
        };
        request.ontimeout = function() {
          rejected = true;
          reject();
        };
        request.send();
      }

      setTimeout(poll, delay);
    }
  );
}

// Toggle the toolbar icon
function toggle(disabled) {
  var buttonTitle;
  var icons;

  if (disabled) {
    buttonTitle = 'WriteLab (disabled)';
    icons = {
      19: '../icons/icon-disabled-19.png',
      38: '../icons/icon-disabled-38.png',
    };
  } else {
    buttonTitle = 'WriteLab';
    icons = {
      19: '../icons/icon-19.png',
      38: '../icons/icon-38.png',
    }
  }

  chrome.browserAction.setTitle({title: buttonTitle});
  chrome.browserAction.setIcon({path: icons});
}

// Check the initial status
chrome.storage.local.get('disabled', function(storage) {
  toggle(storage.disabled);
});

chrome.runtime.onMessage.addListener(function(message, sender) {
  // Get the text and submit it
  if (message.text) {
    var tab = sender.tab.id;

    function submitFail() {
      chrome.tabs.sendMessage(tab, {});
    }

    function submitSuccess(json) {
      chrome.tabs.sendMessage(tab, json);
    }

    submitText(message.text).then(getComments).catch(submitFail)
      .then(submitSuccess).catch(submitFail);

  // Toggle the plugin
  } else {
    toggle(message.disabled);
    sendToTabs({}, {disabled: message.disabled});
  }
});
