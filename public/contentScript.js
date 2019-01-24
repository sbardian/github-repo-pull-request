/**
 * TODO: Update extension default Icon.
 * TODO: Tests?
 * TODO: Bundle for release
 *
 */

// Update localStorage with username and token
window.chrome.storage.sync.get(["GHRPR"], function(result) {
  const { username, token } = JSON.parse(result.GHRPR);
  insertPullRequests(username, token);
});

// Get username and token message from popup
window.chrome.runtime.onMessage.addListener(function(
  request,
  sender,
  sendResponse
) {
  if (request.data) {
    const { username, token } = request.data;
    window.chrome.storage.sync.set({
      GHRPR: JSON.stringify({ username, token })
    });
    insertPullRequests(username, token);
    sendResponse({ error: false });
  }
});

// Fetch PRs from api.github.com
const getPullRequests = async (username, token, repoName) =>
  await fetch(`https://api.github.com/repos/${username}/${repoName}/pulls`, {
    headers: {
      Authorization: `token ${token}`
    }
  });

// Inject PRs into Github Repositories page
const insertPullRequests = (username, token) => {
  const repos = document.querySelectorAll("[data-filterable-for] li h3");

  repos.forEach(async repo => {
    const repoName = repo.querySelector("a:first-child").innerHTML.trim();
    if (username && token) {
      const PRUrl = `https://github.com/${username}/${repoName}/pulls`;
      const result = await getPullRequests(username, token, repoName);
      const pullRequests = await result.json();

      const prSelector = `#ghrpr-${repoName}-container`;
      const doesExist = repo.parentElement.querySelectorAll(prSelector);
      if (!doesExist.length) {
        const toAppend = document.createElement("div");
        toAppend.setAttribute("id", `ghrpr-${repoName}-container`);

        const PRLink = document.createElement("a");
        PRLink.setAttribute("href", PRUrl);
        PRLink.innerHTML = `Pull Requests: <b id="ghrpr-${repoName}-count">${
          pullRequests.length
        }</b>`;
        PRLink.style.color = "green";
        PRLink.style.fontSize = "10pt";

        toAppend.append(PRLink);

        if (pullRequests[0]) {
          repo.after(toAppend);
        }
      }
    } else {
      console.log("No username or token");
    }
  });
};
