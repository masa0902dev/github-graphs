import { RenderContributionGraph } from "./render_contribution_graph.js";

document.addEventListener("DOMContentLoaded", async () => {
    await fetchContributions();
});

async function fetchContributions() {
    const username = document.getElementById("username").value;
    const period = document.getElementById("period").value;
    console.log("fetchContributions() - user", "\nusername:", username, "\nperiod:", period, "months");
    // DEV: http://localhost:3000/api/contributions
    // const response = await fetch("http://localhost:3000/api/contributions", {
    const response = await fetch("https://github-contribution-graphs.vercel.app/api/contributions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, period }),
    });
    const data = await response.json();
    RenderContributionGraph(data, period);
}

const inputName = document.getElementById("username");
const button = document.getElementById("count-contribution");
button.addEventListener("click", fetchContributions);
// focus on the username input when the page is loaded
inputName.focus();
