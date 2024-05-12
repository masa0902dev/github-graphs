import express from "express";
// import fetch from "node-fetch"; // build-in fetch() is stable in nodeJS-v22 ~
import { config } from "dotenv";
import cors from 'cors'; // only dev environment (3000 vs 5500)
import path from 'path';

// load .env file in the root directory
// __dirname is not available in ES6 modules. Use import.meta (nodeJS-v21.2.0 ~)
const ENV_PATH = path.join(import.meta.dirname, "../.env");
config({ path: ENV_PATH });

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));


const TOKEN = process.env.GITHUB_TOKEN;


app.post("/api/repos", async (req, res) => {
    console.log(TOKEN);

    const variables = {
        organization: "hirata-heatstroke",
        repo: "Puppeteer-Test",
        branch: "main",
        directory: "Aichi",
        file: "weelky_2024.csv",
    };
    variables.expression = `${variables.branch}:${variables.directory}/${variables.file}`;

    const query = `
    query getOrgRepoFile($organization: String!, $repo: String!, $expression: String!) {
        repository(owner: $organization, name: $repo) {
            object(expression: $expression) {
                ... on Blob {
                    text
                }
            }
        }
    }`;

    const response = await fetch("https://api.github.com/graphql",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + TOKEN,
        },
        body: JSON.stringify({ query, variables: variables }),
    });
    const data = await response.json();
    console.log(data);
    res.send(data);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
