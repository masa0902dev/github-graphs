document.addEventListener("DOMContentLoaded", async () => {
    await fetchContributions();
});

async function fetchContributions() {
    // PRODUCTION: fix the fetch URL for production environment
    const response = await fetch("http://localhost:3000/api/repos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();

    // console.log("data.data.repository.name\n", data.data.repository.name);

    console.log("data\n", data);
    // console.log("data.data\n", data.data);
    console.log("data.data.repository\n", data.data.repository);
    console.log("data.data.repository.object\n", data.data.repository.object);
    console.log("data.data.repository.object.text\n", data.data.repository.object.text);
}
