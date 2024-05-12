document.addEventListener("DOMContentLoaded", async () => {
    await fetchContributions();
});

async function fetchContributions() {
    const organization = document.getElementById("username").value;
    const period = document.getElementById("period").value;
    console.log("fetchContributions() - organization", "\norganization:", organization, "\nperiod:", period);
    // PRODUCTION: fix the fetch URL for production environment
    const response = await fetch("http://localhost:3000/api/repos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ organization, period }),
    });
    const data = await response.json();
    RenderContributionGraph(data, period);
}

async function RenderContributionGraph(data, period) {
    console.log('data.data.organization.repositories', data.data.organization.repositories);
    console.log('period', period);
    const repos = data.data.organization.repositories.edges;
    for (let i = 0; i < repos.length; i++) {
        const repo = repos[i].node;
        const commits = repo.defaultBranchRef.target.history.edges;
        console.log('');
        console.log('repo', repo);
        console.log('commits', commits);
        console.log('commits[0].node.committedDate ->', commits[0].node.committedDate);
    }
}
