'use strict';

const iconURL = chrome.extension.getURL('icons/icon-32.png');
const spinnerURL = chrome.extension.getURL('content/spinner-32.gif');
const closeURL = chrome.extension.getURL('content/close.svg');

// Create an element with attributes
function createElement(tag, attributes) {
  var element = document.createElement(tag);
  for (var attribute in attributes) {
    element[attribute] = attributes[attribute];
  }
  return element;
}

var textBox;
var intervalID;

// Create the icon
const icon = createElement('img', {id: 'writelab-icon', src: iconURL});

// Create the notification content
const heading = createElement('h4');
const draftLink = createElement('a', {
  id: 'writelab-button', target: '_blank', textContent: 'Click to view'});
const close = createElement('img', {src: closeURL, title: 'Close'});
close.addEventListener('click', function() {
  notification.style.display = 'none';
}, true);

// Create the notification
const notification = createElement('div', {id:'writelab-notification'});
notification.appendChild(heading);
notification.appendChild(draftLink);
notification.appendChild(close);

// Check if the element is a text box
function isTextBox(element) {
  return element.tagName && element.tagName.toLowerCase() === 'textarea';
}

// Show the icon near any editable elements that the user focuses on
function showIcon(event) {
  var element = event.target;
  clearInterval(intervalID);

  if ((isTextBox(element) || element.isContentEditable) &&
      element.getAttribute('role') !== 'combobox') {
    textBox = element;

    // Get the nearest scrollable ancestor
    var container = textBox.parentElement;
    while (container.scrollHeight === container.clientHeight &&
        container !== document.body) {
      container = container.parentElement;
    }

    // Place the icon in the container at the corner of the text box
    function placeIcon() {
      var containerRect = container.getBoundingClientRect();
      var textBoxRect = textBox.getBoundingClientRect();
      icon.style.bottom = (
        containerRect.bottom - textBoxRect.bottom - container.scrollTop +
        5 + 'px');
      icon.style.right = (
        containerRect.right - textBoxRect.right - container.scrollLeft +
        5 + 'px');
    }

    placeIcon();
    intervalID = setInterval(placeIcon, 500);

    if (window.getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }
    container.appendChild(icon);

  } else if (icon.parentElement) {
    icon.parentElement.removeChild(icon);
  }
}

// Send the text for submitting when the icon is clicked
function sendText() {
  var element = textBox;
  var text;

  // Get the text of the element
  if (isTextBox(element)) {
    text = element.value;
  } else if (element.isContentEditable) {
    while (element.getAttribute('contenteditable') !== 'true') {
      element = element.parentElement;
    }
    text = element.innerText;
  }

  // Send the text and show the spinner
  if (text) {
    icon.removeEventListener('mousedown', sendText, true);
    document.removeEventListener('focus', showIcon, true);
    chrome.runtime.sendMessage({text: text});
    icon.src = spinnerURL;
  } else {
    alert('Please enter some text.');
  }
}

// Hide the notification when the user clicks outside of it
function hideNotification(event) {
  var element = event.target;
  while (element) {
    if (element === notification) {
      return;
    }
    element = element.parentElement;
  }
  document.removeEventListener('click', hideNotification, true);
  notification.style.display = 'none';
}

icon.addEventListener('mousedown', sendText, true);

// Toggle showing the icon
function toggle(disabled) {
  if (disabled) {
    document.removeEventListener('focus', showIcon, true);
    icon.style.display = 'none';
  } else {
    document.addEventListener('focus', showIcon, true);
    icon.style.display = 'block';
  }
}

// Replace the spinner with the icon
function replaceSpinner() {
  document.addEventListener('focus', showIcon, true);
  icon.addEventListener('mousedown', sendText, true);
  icon.src = iconURL;
}

// Update the notification and show it
function showNotification(message) {
  // Get the total comment count
  var moduleCounts = message.moduleCounts;
  var commentCount = 0;
  for (var module in moduleCounts) {
    commentCount += moduleCounts[module];
  }

  // Update the notification
  if (commentCount) {
    heading.textContent = 'You have ' + commentCount + ' Comment' + (
      commentCount > 1 ? 's' : '');
    draftLink.href = message.demoURL;
    draftLink.style.setProperty('display', 'inline-block', 'important');
  } else {
    heading.innerHTML = 'You have no comments.<br>Good Job!';
    draftLink.style.setProperty('display', 'none', 'important');
  }

  // Show the notification
  notification.style.bottom = icon.style.bottom;
  notification.style.right = icon.style.right;
  icon.parentElement.appendChild(notification);
  document.addEventListener('click', hideNotification, true);
  notification.style.display = 'block';
}

// Check the initial status
chrome.storage.local.get('disabled', function(storage) {
  toggle(storage.disabled);
});

chrome.runtime.onMessage.addListener(function(message) {
  if (message.demoURL) {  // Done parsing
    showNotification(message);
    replaceSpinner();
  } else if (message.disabled !== undefined) {  // Disabled/enabled
    toggle(message.disabled);
  } else {  // Submit failed
    replaceSpinner();
    alert('Something went wrong, try submitting again.');
  }
});
