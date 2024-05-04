

// GitHub APIからデータを取得する関数
async function fetchContributions(endpoint) {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        // コントリビューション数を計算
        const contributions = data.filter((event) => event.type === "PushEvent").length;

        return contributions;
    } catch (error) {
        console.error("データの取得中にエラーが発生しました:", error);
        return null;
    }
}


// 実行ボタン
const processBtn = document.querySelector("#count-contribution");

processBtn.addEventListener("click", async () => {
    // GitHubのユーザー名
    const username = document.querySelector("#user-name").value;
    // GitHub APIエンドポイント
    const endpoint = `https://api.github.com/users/${username}/events`;

    // コントリビューション数を取得して出力
    let contributions = await fetchContributions(endpoint);
    if (contributions !== null) {
        console.log(`ユーザー '${username}' のコントリビューション数は ${contributions} 回です。`);
    } else {
        console.log("コントリビューション数を取得できませんでした。");
    }
});
