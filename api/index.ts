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


app.post("/api/contributions", async (req, res) => {
    const { username, period } = req.body;
    let today = new Date();
    const toDate = today.toISOString();
    const fromDate = new Date(today.setMonth(today.getMonth() - period)).toISOString();

    const variables = {
        login: username,
        from: fromDate,
        to: toDate,
    };
    const query = `
    query GetUserContributions($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
            contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                    totalContributions
                    weeks {
                        contributionDays {
                            contributionCount
                            date
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
    res.send(data);
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
