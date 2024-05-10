document.addEventListener("DOMContentLoaded", async () => {
    await fetchContributions();
});

async function fetchContributions() {
    const userName = document.getElementById("username").value;
    const period = document.getElementById("period").value;
    console.log("fetchContributions()\nuserName:", userName, "\nperiod:", period, "months");
    // PRODUCTION: fix the fetch URL for production environment
    const response = await fetch("http://localhost:3000/api/contributions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, period }),
    });
    const data = await response.json();
    RenderContributionGraph(data, period);
}

function RenderContributionGraph(data, period) {
    console.log("RenderContributionGraph()\ndata:", data, "\nperiod:", period);
    if (data.errors) {
        alert("Github GraphQL API message:\n\n" + data.errors[0].message);
        return;
    }
    const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
    const contributions = weeks.flatMap(week => week.contributionDays.map(day => day.contributionCount));
    const dates = weeks.flatMap(week => week.contributionDays.map(day => day.date));
    
    const totalContribution = contributions.reduce((acc, cur) => acc + cur, 0);

    const resultWrapper = document.getElementById("result-wrapper");
    resultWrapper.innerHTML = ""; // clear old data
    const pTotal = document.createElement("p");
    pTotal.className = "total";
    pTotal.textContent = "Total Contributions: " + totalContribution;
    resultWrapper.appendChild(pTotal);
    const pPeriod = document.createElement("p");
    pPeriod.className = "period";
    const formatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
    const formattedPeriod = [
        new Date(dates[0]).toLocaleDateString("en-US", formatOptions),
        new Date(dates[dates.length - 1]).toLocaleDateString("en-US", formatOptions),
    ];
    pPeriod.textContent = formattedPeriod[0] + " ~ " + formattedPeriod[1];
    resultWrapper.appendChild(pPeriod);
    const pName = document.createElement("p");
    pName.className = "username";
    pName.textContent = inputName.value;
    resultWrapper.appendChild(pName);
    
    // make empty table
    const table = document.createElement("table");
    let numberOfCols = parseInt(period) / 3 * 13 + 1;
    for (let i = 0; i < 7; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < numberOfCols; j++) {
            const cell = document.createElement("td");
            cell.classList.add("tooltip");
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "table-wrapper";
    resultWrapper.appendChild(tableWrapper)
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
        // add tooltip to display date and contribution count
        const tooltipDescription = document.createElement("div");
        tooltipDescription.classList.add("tooltip-description");
        const formatOptions = { weekday: 'short', month: '2-digit', day: '2-digit', year: 'numeric' };
        const formattedDate = new Date(dates[i]).toLocaleDateString("en-US", formatOptions);
        tooltipDescription.textContent = formattedDate + " → " + contributions[i];
        cell.appendChild(tooltipDescription);

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
        } 

        if (number < 20) {
            if (number <= i*3 && number > (i-1)*3) {
                return colors[i];
            }
        } else if (number < (i-6)*5 + 20  && number >= (i-7)*5 + 20) {
            return colors[i];
        }

        if (number >= 50) {
            return colors[colors.length - 1];
        }
    }
}



const button = document.getElementById("count-contribution");
const inputName = document.getElementById("username");
const inputPeriod = document.getElementById("period");
button.addEventListener("click", fetchContributions);
inputName.addEventListener("keydown", clickButton);
inputPeriod.addEventListener("keydown", clickButton);
// click button when Enter key is pressed in username and period input
function clickButton(e) {
if (e.key === "Enter") {
    button.dispatchEvent(new PointerEvent("click"));
    e.preventDefault();
}
};
// focus on the username input when the page is loaded
inputName.focus();
