document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const playerName = params.get("player");

    if (!playerName) {
        console.error("No player name provided in the URL.");
        document.getElementById("player-name").innerText = "Player has not joined!";
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
    colorify(nameElement, data.prefix, name, data.suffix);

    const skinElement = document.getElementById("player-skin");
    const uuid = data.uuid.replace('-', '')
    const blob = await fetchBlob(`https://api.mineatar.io/body/full/${uuid}?scale=10`);
    const blobUrl = URL.createObjectURL(blob);
    skinElement.src = blobUrl;

    document.getElementById("bedwars-wlr").innerText += data.bedwars.wlr;
    document.getElementById("bedwars-fkdr").innerText += data.bedwars.fkdr;
    document.getElementById("bedwars-kills").innerText += data.bedwars.kills;
    document.getElementById("bedwars-deaths").innerText += data.bedwars.deaths;
}

async function fetchBlob(url) {
    const response = await fetch(url);

    return response.blob();
}

function colorify(element, prefix, name, suffix) {
    // Combine prefix, name, and suffix into a single string
    let str = prefix + name + suffix;

    // Regular expression to find color and formatting codes (e.g., §4 for color, §l for bold, etc.)
    let colorRegex = /§[0-9a-fk-or]/g;

    // Clear existing content
    element.innerHTML = "";

    // Initialize styles
    let currentColor = "";
    let isBold = false;
    let isItalic = false;
    let isUnderlined = false;
    let isStrikethrough = false;

    // Iterate over each character in the string
    for (let i = 0; i < str.length; i++) {
        // Check if the current character is part of a Minecraft formatting code
        if (str[i] === '§' && i + 1 < str.length) {
            let code = str[i + 1]; // Get the formatting code (color or style)
            i++; // Skip the next character as it is part of the formatting code

            switch (code) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case 'a':
                case 'b':
                case 'c':
                case 'd':
                case 'e':
                case 'f':
                    // Color codes (reset styles with new color)
                    currentColor = '§' + code;
                    isBold = false;
                    isItalic = false;
                    isUnderlined = false;
                    isStrikethrough = false;
                    break;
                case 'k':
                    // Obfuscated (we will skip it, as it's a more complex effect to implement)
                    break;
                case 'l':
                    // Bold
                    isBold = true;
                    break;
                case 'm':
                    // Strikethrough
                    isStrikethrough = true;
                    break;
                case 'n':
                    // Underline
                    isUnderlined = true;
                    break;
                case 'o':
                    // Italic
                    isItalic = true;
                    break;
                case 'r':
                    // Reset all styles
                    currentColor = "";
                    isBold = false;
                    isItalic = false;
                    isUnderlined = false;
                    isStrikethrough = false;
                    break;
            }
        } else {
            // Create a span for each character and apply the current styles
            let span = document.createElement("span");
            span.textContent = str[i];

            // Apply color
            if (currentColor) {
                span.classList.add(currentColor);
            }

            // Apply formatting styles
            if (isBold) {
                span.style.fontWeight = "bold";
            }
            if (isItalic) {
                span.style.fontStyle = "italic";
            }
            if (isUnderlined) {
                span.style.textDecoration = "underline";
            }
            if (isStrikethrough) {
                span.style.textDecoration = span.style.textDecoration ?
                    span.style.textDecoration + " line-through" :
                    "line-through";
            }

            // Append the span to the element
            element.appendChild(span);
        }
    }
}