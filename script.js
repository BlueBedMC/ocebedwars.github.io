// Get the copy button and server IP input field
const copyButton = document.getElementById("copy-button");
const serverIpInput = document.getElementById("server-ip-input");

// Add a click event listener to the copy button
copyButton.addEventListener("click", () => {
    // Select the text in the input field
    serverIpInput.select();
    serverIpInput.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text to the clipboard
    document.execCommand("copy");

    // Deselect the text
    serverIpInput.setSelectionRange(0, 0);
});

document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggle-mobile-buttons");
    const overlayMenu = document.getElementById("overlay-menu");
    const cancelMenu = document.getElementById("cancel-menu");
  
    toggleButton.addEventListener("click", function () {
      overlayMenu.style.display === "block"
        ? (overlayMenu.style.display = "none")
        : (overlayMenu.style.display = "block");
    });

    cancelMenu.addEventListener("click", function () {
        overlayMenu.style.display = "none";
    });
});
  


//Search Player Bar
function getPlayer() {
    const playerName = document.getElementById("searchBar").value;
    location.href = "search.html?player=" + playerName;
    console.log(playerName)
}
