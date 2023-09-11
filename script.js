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
