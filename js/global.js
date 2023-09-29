document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("copy-ip").addEventListener("click", () => {
    copyTextToClipboard("ocebedwars.com")
  })
})

function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text).then(function() {
    alert(`Copied ${text}!`)
  }, function(err) {
    console.error('Async: Could not copy text: ', err)
  })
}