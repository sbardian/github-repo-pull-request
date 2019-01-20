/* eslint-disable no-undef */

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: "github.com",
              queryContains: "tab=repositories"
            }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

// function someFunction({ username, token }) {
//   console.log("username = ", username, ", token = ", token);

//   chrome.storage.sync.set(
//     { GHRPR: JSON.stringify({ username, token }) },
//     function() {
//       console.log("Background localStorage is set to " + value);
//     }
//   );

//   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, { data: { username, token } }, function(
//       response
//     ) {
//       console.log(response.error);
//     });
//   });
// }

// chrome.storage.sync.get(["GHRPR"], function(result) {
//   console.log("Background localStorage currently is " + result.GHRPR);
//   const { username, token } = result.GHRPR;
//   chrome.runtime.sendMessage({ data: { username, token } }, function(response) {
//     console.log(response);
//   });
// });
