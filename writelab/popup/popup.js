'use strict';

const URL = 'https://www.writelab.com';
const DOCUMENTS_URL = URL + '/documents/';

const login = document.getElementById('writelab-button');
const learnMore = document.getElementById('learn-more');
const toggleButton = document.getElementById('toggle');

// Link to My Documents if the user is logged in
chrome.cookies.get({url: URL, name: 'sessionid'}, function(cookie) {
  var now = new Date().getTime() / 1000;
  if (cookie && now < cookie.expirationDate) {
    login.textContent = 'View My Documents';
    login.href = DOCUMENTS_URL;
  }
});

// Toggle the button text
function toggle(disabled) {
  toggleButton.textContent = disabled ? 'Enable' : 'Disable';
}

var disabled;

// Check the initial status
chrome.storage.local.get('disabled', function(storage) {
  disabled = storage.disabled;
  toggle(disabled);
});

// Toggle the plugin when the button is clicked
toggleButton.addEventListener('click', function() {
  disabled = !disabled;
  toggle(disabled);

  var message = {disabled: disabled};
  chrome.storage.local.set(message);
  chrome.runtime.sendMessage(message);
});
