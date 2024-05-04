// GitHub APIからデータを取得する関数
async function fetchContributions(endpoint) {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        // コントリビューション数を計算
        // const contributions = data.filter((event) => event.type === "PushEvent").length;
        // const contributions = data.filter((event) => event.type === "PushEvent");
        const contributions = data;

        return contributions;
    } catch (error) {
        console.error("データの取得中にエラーが発生しました:", error);
        return null;
    }
}



const inputField = document.querySelector("#user-name");
const outputField = document.querySelector("#user-count");
const processBtn = document.querySelector("#count-contribution");

// inputでEnterが押されたらボタンを押す
inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        processBtn.click();
    }
});

processBtn.addEventListener("click", async () => {
    const username = inputField.value;
    // const endpoint = `https://api.github.com/users/${username}/events`;
    // const endpoint = `https://api.github.com/users/${username}/repos`;
    // const endpoint = `https://api.github.com/${username}/repos`;
    // const endpoint = `https://api.github.com/users/${username}/repos`;
    const endpoint = `https://api.github.com/repos/${username}/csv-control-nodejs/activity`;



    // コントリビューション数を取得して出力
    let contributions = await fetchContributions(endpoint);
    if (contributions !== null) {
        console.log(contributions);
        // console.log(`ユーザー '${username}' のコントリビューション数は ${contributions} 回です。`);
        outputField.value = contributions + " contributions";
    } else {
        console.log("コントリビューション数を取得できませんでした。")
        outputField.value = "Error";
        outputField.style.color = "red";
    }
});
