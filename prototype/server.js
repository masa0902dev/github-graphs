import express from "express";
import fetch from "node-fetch";
import { config } from "dotenv";
import cors from 'cors'; // 開発環境でのみ使用(3000と5500)
config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5500' // このオリジンのみ許可
}));


const TOKEN = process.env.GITHUB_TOKEN;


app.post("/api/contributions", async (req, res) => {
    const { userName, period } = req.body;
    const today = new Date();
    const toDate = today.toISOString();
    const fromDate = new Date(today.setMonth(today.getMonth() - period)).toISOString();

    const queryVariables = {
        login: userName,
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

    // const variables = JSON.stringify({ userName, from, to });
    const response = await fetch("https://api.github.com/graphql",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + TOKEN,
        },
        body: JSON.stringify({ query, variables: queryVariables }),
    });
    const data = await response.json();
    res.send(data);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
