/* eslint-disable no-undef */

console.log("background script running");

chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.status === "complete" && tab.url.match(/repositories/)) {
      chrome.pageAction.show(tabId);
    } else {
      chrome.pageAction.hide(tabId);
    }
  });
});
