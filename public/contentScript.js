window.chrome.runtime.onMessage.addListener(function(
  request,
  sender,
  sendResponse
) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.data) {
    const { username, token } = request.data;
    window.chrome.storage.sync.set(
      { GHRPR: JSON.stringify({ username, token }) },
      function(response) {
        console.log(
          "Background localStorage is set to ",
          response.username,
          ", - ",
          response.token
        );
      }
    );
    insertPullRequests(username, token);
    sendResponse({ error: false });
  }
});

const getPullRequests = async (username, token, repoName) =>
  await fetch(`https://api.github.com/repos/${username}/${repoName}/pulls`, {
    headers: {
      Authorization: `token ${token}`
    }
  });

const insertPullRequests = (username, token) => {
  var repos = document.querySelectorAll("[data-filterable-for] li h3 a");

  repos.forEach(async li => {
    const repoName = li.innerHTML.trim();
    if (username && token) {
      const PRUrl = `https://github.com/${username}/${repoName}/pulls`;
      const result = await getPullRequests(username, token, repoName);
      const pullRequests = await result.json();

      const toAppend = document.createElement("div");
      const PRLink = document.createElement("a");

      PRLink.setAttribute("href", PRUrl);
      PRLink.innerText = `Pull Requests: ${pullRequests.length}`;
      PRLink.style.color = "green";
      PRLink.style.fontSize = "10pt";

      toAppend.append(PRLink);

      if (pullRequests[0]) {
        li.after(toAppend);
      }
    } else {
      console.log("No username or token");
    }
  });
};

window.chrome.storage.sync.get(["GHRPR"], function(result) {
  console.table(result);
  const { username, token } = JSON.parse(result.GHRPR);
  console.log("bg username = ", username, " = ", token);
  insertPullRequests(username, token);
});

/**
 * TODO: bring user and token in using some setting in the extension.
 * User supplies their own person access token.
 */
