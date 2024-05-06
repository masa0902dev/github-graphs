// nodejs側の処理を呼び出す
import { fetchContributions } from './fetch_contributions.js';


// DOM要素
const userNameInput = document.querySelector('#user-name');
const processBtn = document.querySelector('#count-contribution');
const userCount = document.querySelector('#user-count');


const today = new Date();
const yearsAgo = new Date(new Date().setFullYear(today.getFullYear() - 1));

function formatDate(dateStruct) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = days[dateStruct.getDay()];
    const date = dateStruct.getDate().toString().padStart(2, '0');
    const month = (dateStruct.getMonth() + 1).toString().padStart(2, '0');
    const year = dateStruct.getFullYear();
    const formatted = day + ", " + month + "-" + date + "-" + year;
    return formatted;
}
// www, MM-DD-YYYYの形式
const periodEnd = formatDate(today);
const periodStart = formatDate(yearsAgo);


// ユーザ名を入力して、ボタンを押すと、ユーザの1日ごとのコントリビューション数を取得する
processBtn.addEventListener('click', async () => {
    const userName = userNameInput.value;
    const { data: { user: { contributionsCollection: { contributionCalendar: { totalContributions, weeks }} }} } = await fetchContributions(userName)
    const contributionDays = weeks.reduce((prev, cur) => {
        return prev.concat(cur.contributionDays)
    });
    // return {
    //     userName,
    //     totalContributions,
    //     contributionDays
    // }

    const contributions = data.data.user.contributionsCollection.contributionCalendar.totalContributions;
    userCount.textContent = contributions;
});
