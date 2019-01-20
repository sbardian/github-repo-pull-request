const getPullRequests = async (user, token, repoName) =>
  await fetch(`https://api.github.com/repos/${user}/${repoName}/pulls`, {
    headers: {
      Authorization: `token ${token}`
    }
  });

var repos = document.querySelectorAll("[data-filterable-for] li h3 a");

repos.forEach(async li => {
  const repoName = li.innerHTML.trim();
  const token = ""; // TODO: Update to be entered token
  const user = "sbardian";
  const PRUrl = `https://github.com/${user}/${repoName}/pulls`;
  const result = await getPullRequests(user, token, repoName);
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
});

/**
 * TODO: bring user and token in using some setting in the extension.
 * User supplies their own person access token.
 */
