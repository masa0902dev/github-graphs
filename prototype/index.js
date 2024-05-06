document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("count-contribution");
    button.addEventListener("click", fetchContributions);
});
async function fetchContributions() {
    const userName = document.getElementById("username").value;
    const period = document.getElementById("period").value;
    console.log("userName:", userName, "\nperiod:", period, "months");
    // TODO: fix the fetch URL for production environment
    const response = await fetch("http://localhost:3000/api/contributions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, period }),
    });
    const data = await response.json();
    // save data to localStorage
    localStorage.setItem("data", JSON.stringify(data));
    RenderContributionGraph(data, period);
}


function RenderContributionGraph(data, period) {
    const result = document.getElementById("result");
    result.innerHTML = ""; // clear old data
    console.log(data, period);
    const weeks = data.user.contributionsCollection.contributionCalendar.weeks;
    const contributions = weeks.flatMap(week => week.contributionDays.map(day => day.contributionCount));
    const dates = weeks.flatMap(week => week.contributionDays.map(day => day.date));

    // total
    const total = contributions.reduce((acc, cur) => acc + cur, 0);
    result.innerHTML = `<p class="total">Total Contributions: ${total}</p>`;
    
    // make empty table
    const table = document.createElement("table");
    // TODO: add "this year" period option
    const numberOfCols = period === "6" ? 27 : 53;
    for (let i = 0; i < 7; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < numberOfCols; j++) {
            const cell = document.createElement("td");
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "table-wrapper";
    result.appendChild(tableWrapper)
    tableWrapper.appendChild(table);

    // 1. check and fill the lack of days in the first week
    const firstDay = new Date(dates[0]).getDay();
    let daysCount = firstDay;
    let weekCount = 0;
    for (let i = 0; i < firstDay; i++) {
        let cell = table.rows[i].cells[0];
        cell.style.background = getColor(0);
    }
    // 2. fill the table
    for (let i = 0; i < dates.length; i++) {
        const dateInstance = new Date(dates[i]);
        const day = dateInstance.getDay();

        let cell = table.rows[day].cells[weekCount];
        cell.style.background = getColor(contributions[i]);
        cell.title = contributions[i] === undefined ? "" : contributions[i];

        daysCount++;
        if (daysCount === 7) {
            weekCount++;
            daysCount = 0;
        }
    }
    // 3. fill the lack of days in the last week
    for (let i = daysCount; i < 7; i++) {
        let cell = table.rows[i].cells[weekCount];
        cell.style.background = getColor(0);
    }
}


function getColor(number) {
    const colors = [
        "rgb(0 0 0 / .03)", //gray (empty or 0)
        "rgb(0 255 0 / .33)", //green
        "rgb(0 255 0 / .66)",
        "rgb(0 255 0)",
        "rgb(255 255 0 / .33)", //yellow
        "rgb(255 255 0 / .66)",
        "rgb(255 255 0)",
        "rgb(255 165 0 / .33)", //orange
        "rgb(255 165 0 / .66)",
        "rgb(255 165 0)",
        "rgb(255 0 0 / .33)", //red
        "rgb(255 0 0 / .66)",
        "rgb(255 0 0)",
        "linear-gradient(135deg, rgb(0 255 255 / .8), rgb(255 0 255 / .8), rgb(255 255 0 / .8)" //rainbow
    ];
    for (let i = 0; i < colors.length; i++) {
        if (number === undefined || number === 0) {
            return colors[0];
        } else if (number < i*5  && number >= (i-1)*5) {
            return colors[i];
        }

        if (number >= 60) {
            return colors[colors.length - 1];
        }
    }
}


