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
    window.chrome.storage.sync.set({
      GHRPR: JSON.stringify({ username, token })
    });
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

// TODO: Still need to handle duplication. . .
const insertPullRequests = (username, token) => {
  const repos = document.querySelectorAll("[data-filterable-for] li h3");

  repos.forEach(async repo => {
    const repoName = repo.querySelector("a:first-child").innerHTML.trim();
    console.log("repoName = ", repoName);
    if (username && token) {
      const PRUrl = `https://github.com/${username}/${repoName}/pulls`;
      const result = await getPullRequests(username, token, repoName);
      const pullRequests = await result.json();

      const prSelector = `#ghrpr-${repoName}-container`;
      const doesExist = repo.parentElement.querySelectorAll(prSelector);
      if (doesExist.length) {
        console.log("doesExist");
        const currentCount = document.getElementById(`ghrpr-${repoName}-count`);
        console.log("html length = ", parseInt(currentCount.innerHTML, 10));
        console.log("pr.length = ", pullRequests.length);
        if (parseInt(currentCount.innerHTML, 10) !== pullRequests.length) {
          console.log("!equal");
          document.getElementById(`ghrpr-${repoName}-count`).innerHTML =
            pullRequests.length;
        }
      } else {
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
