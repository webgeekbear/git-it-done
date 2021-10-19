var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function (user) {
    // format the github api url
    let apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayRepos(data, user);
                });
            } else {
                alert("Error: GitHub User Not Found");
            }
        })
        .catch(function (error) {
            // Notice this `catch()` getting chained onto the end of the `.then()`
            alert("Unable to connect to GitHub");
        });
};

var displayRepos = function (repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found";
        return;
    }

    // Clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (let i = 0; i < repos.length; i++) {
        // Format repo name
        let repoName = repos[i].owner.login + "/" + repos[i].name;

        // Create a container for each repo
        let repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        // Create a span element to hold repository name
        let titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // Append to container
        repoEl.appendChild(titleEl);

        // Create a status element
        let statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check to see if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" +
                repos[i].open_issues_count +
                " issue(s)";
        } else {
            statusEl.innerHTML =
                "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // Append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};

var formSubmitHandler = function (event) {
    event.preventDefault();
    let username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);