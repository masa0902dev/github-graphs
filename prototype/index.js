const countContributionBtn = document.getElementById("countContribution");




async function fetchContributions() {
    const userName = document.getElementById("username").value;
    const period = document.getElementById("period").value;
    console.log("userName:", userName, "\nperiod:", period, "months");
    const response = await fetch("http://localhost:3000/api/contributions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, period }),
    });
    const data = await response.json();
    // // データを localStorage に保存
    // localStorage.setItem("data", JSON.stringify(data));
    RenderContributionGraph(data);
}


function RenderContributionGraph(data) {
    const result = document.getElementById("result");
    result.innerHTML = ""; // 古い内容をクリア
    const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
    const contributions = weeks.flatMap(week => week.contributionDays.map(day => day.contributionCount));
    const dates = weeks.flatMap(week => week.contributionDays.map(day => day.date));

    const total = contributions.reduce((acc, cur) => acc + cur, 0);
    result.innerHTML = `<p class="total">Total Contributions: ${total}</p>`;

    // table
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    // table.style.border = "1px solid black";

    // for (let i = 0; i < 7; i++) { // 7日ごとの行
    //     const row = document.createElement("tr");
    //     for (let j = 0; j < 52; j++) { // 52週ごとの列
    //         const index = i * 52 + j;
    //         const cell = document.createElement("td");
    //         cell.style.width = "2rem";
    //         cell.style.height = "2rem";
    //         cell.style.border = "1px solid black";

    //         const num = contributions[index];
    //         if (num === undefined) cell.style.backgroundColor = "white";
    //         else if (num === 0) cell.style.backgroundColor = "white";
    //         else if (num < 5) cell.style.backgroundColor = "lightgreen";
    //         else if (num < 10) cell.style.backgroundColor = "green";
    //         else if (num < 20) cell.style.backgroundColor = "darkgreen";
    //         else {
    //             console.log("num:", num);
    //             cell.style.backgroundColor = "black";
    //         }

    //         // cell.style.backgroundColor = contributions[index] === 0 ? "white" : "green";
    //         cell.textContent = dates[index];
    //         cell.style.fontSize = "8px";
    //         row.appendChild(cell);
    //     }
    //     table.appendChild(row);
    // }
    // result.appendChild(table);



    // 6months or 1year
    const numberOfCols = period === "6" ? 27 : 53;

    // make empty table
    for (let i = 0; i < 7; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < numberOfCols; j++) {
            const cell = document.createElement("td");
            cell.style.width = "20px";
            cell.style.height = "20px";
            cell.style.border = "1px solid black";
            // cell.style.backgroundColor = "white";
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    result.appendChild(table);

    // fill table
    // 1. check the first day of the week
    const firstDate = new Date(dates[0]);
    const firstDay = firstDate.getDay();
    console.log("firstDate:", firstDate);
    console.log("firstDay:", firstDay);


    // 2. put following days
}



