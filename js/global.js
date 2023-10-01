import { API_URL } from "./global_config.js"

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


const login = document.getElementById("login")
fetch(API_URL + "/api/login_info", {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token")
  }
})
  .then(res => res.json())
  .then(json => {
    if (!json.loggedin) {
      login.href = json.url
      login.hidden = false
      return
    }
    window.user = json.user
    login.innerText = `${json.user.name} [${json.user.rank}]`
    login.style.fontSize = "15px"
    login.removeAttribute("hef")
    login.hidden = false
  })
  .catch(error => {
    console.error(error)
    login.href = "#error"
    login.innerText = "Error"
    login.hidden = false
  })