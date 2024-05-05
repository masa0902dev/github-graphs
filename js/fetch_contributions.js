// node.js環境。つまりサーバーサイドで実行
const axios = require('axios');


// 環境変数からGITHUB_TOKEN取得
const token = process.env.GITHUB_TOKEN;
if (!token) {
    console.error('GitHub token is not set in environment variables');
    process.exit(1);
}

// GraphQL query
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
// query variables
const queryVariables = {
    login: "masa0902dev",
    from: "2024-01-01T00:00:00Z",
    to: "2024-05-05T20:00:00Z",
}


const baseUrl = 'https://api.github.com/graphql';

try {
    const response = await axios.post(baseUrl, {
        headers: {
            'Authorization': 'bearer ' +  token,
            'Content-Type': 'application/json',
        },
        data: {
            query: query,
            variables: queryVariables,
        }
    })

    console.log(response.data.data.user.contributionsCollection.contributionCalendar.totalContributions);

} catch (err) {
    console.error(err);
    process.exit(1);
}
