import axios from "https://cdn.skypack.dev/axios";


// 環境変数からGITHUB_TOKEN取得
const token = process.env.GITHUB_TOKEN;
if (!token) {
    console.error('GitHub token is not set in environment variables');
    process.exit(1);
}

// クライアント側から呼び出せるようにexport（しない）
export async function fetchContributions(userName) {
    const queryVariables = {
        login: userName,
        from: "2024-01-01T00:00:00Z",
        to: "2024-05-05T20:00:00Z",
    }
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
    }
    `;

    try {
        const response = await axios.post('https://api.github.com/graphql', {
            headers: {
                'Authorization': 'bearer ' +  token,
                'Content-Type': 'application/json',
            },
            data: {
                query: query,
                variables: queryVariables,
            }
        });
        console.log(response.data.data.user.contributionsCollection.contributionCalendar.totalContributions);
        return response
    } catch (err) {
        console.error(err);
        // process.exit(1);
    }
}


