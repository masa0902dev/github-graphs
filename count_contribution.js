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


// input, outputフィールド
const inputField = document.querySelector("#user-name");
const outputField = document.querySelector("#user-count");
// 実行ボタン
const processBtn = document.querySelector("#count-contribution");

// inputでEnterが押されたらボタンを押す
document.querySelector("#user-name").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        processBtn.click();
    }
});

processBtn.addEventListener("click", async () => {
    
    // GitHubのユーザー名
    const username = inputField.value;
    // GitHub APIエンドポイント
    const endpoint = `https://api.github.com/users/${username}/events`;

    // コントリビューション数を取得して出力
    let contributions = await fetchContributions(endpoint);
    if (contributions !== null) {
        console.log(`ユーザー '${username}' のコントリビューション数は ${contributions} 回です。`);
        outputField.value = contributions + " contributions";
    } else {
        console.log("コントリビューション数を取得できませんでした。")
        outputField.value = "Error";
        outputField.style.color = "red";
    }

    // 出力
});
