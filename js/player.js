document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const playerName = params.get("player");

    if (!playerName) {
        console.error("No player name provided in the URL.");
        return;
    }

    createPlayer(playerName);
});

async function createPlayer(name) {
    const response = await fetch(`https://api.ocebedwars.com/player/?player=${name}`);
    const data = await response.json();

    console.log(data);

    if (data.error) {
        console.error(data.error);
        return;
    }

    const nameElement = document.getElementById("player-name");
    nameElement.innerText = name;

    const skinElement = document.getElementById("player-skin");
    const uuid = data.uuid.replace('-', '')
    const blob = await fetchBlob(`https://skins.mcstats.com/body/${uuid}?scale=1&disableCosmeticType=all`);
    const blobUrl = URL.createObjectURL(blob);
    skinElement.src = blobUrl;
}

async function fetchBlob(url) {
    const response = await fetch(url);

    return response.blob();
}