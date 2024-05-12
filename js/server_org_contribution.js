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
    const { organization, period } = req.body;
    console.log('organization', organization);
    const today = new Date();
    const toDate = today.toISOString();
    let fromDate;
    if (period == '1w') {
        fromDate = new Date(today.setDate(today.getDate() - 7)).toISOString();
    } else if (period == '2w') {
        fromDate = new Date(today.setDate(today.getDate() - 14)).toISOString();
    } else if (period == '1m') {
        fromDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString();
    }

    const variables = {
        organization: organization,
        from: fromDate,
        to: toDate,
    };
    const query = `
    query getOrgContributions($organization: String!, $from: GitTimestamp!, $to: GitTimestamp!) {
        organization(login: $organization) {
            name
            repositories(first: 100) {
                edges {
                    node {
                        name
                        defaultBranchRef {
                            target {
                                ... on Commit {
                                    history(since: $from, until: $to) {
                                        totalCount
                                        edges {
                                            node {
                                                committedDate
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
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
