import { time_ago } from "./date_util.js"
import { API_URL } from "./global_config.js"

const newsElement = document.getElementById("news")

fetch(API_URL + "/api/news")
  .then(res => res.json())
  .then(news => renderNews(news))
  .catch(error => {
    console.error(error)
    newsElement.innerText = "Failed to fetch news. Please refresh if this issue continues contact a site administrator."
  })

async function renderNews(news) {
  if (news.length == 0) {
    newsElement.innerText = "There has been no news posted."
    return
  }
  await fetch(API_URL + "/api/users?id=" + [...new Set(news.map(i => i.owner))].join(","))
  .then(res => res.json())
  .then(users => {
    newsElement.innerHTML = ""
    news.forEach(i => renderNewsItem(i, users))
  })
  .catch(error => {
    console.error(error)
    newsElement.innerText = "Failed to fetch users. Please refresh, if this issue continues contact a site administrator."
  })
  
}

/*

      <div class="news-item">
        <div class="user">
          <div>
            <img src="./assets/user/blue_bed.jpg" width="50" height="50" alt="">
            <br>
            <span>Blue_Bed</span>
            <br>
            <span class="badge badge-owner">OWNER</span>
          </div>
        </div>
        <div class="news-content">
          <h2 class="title">Lorem 1</h2>
          <p>Lorem, ipsum.</p>
        </div>
      </div>
*/

function renderNewsItem(newsItem, users) {
  const ownUser = users.find(u => u.id == newsItem.owner)

  const container = document.createElement("div")
  container.classList.add("news-item")

  const user = document.createElement("div")
  user.classList.add("user")

  const innerUserDev = document.createElement("div")
  const img = document.createElement("img")
  img.src = API_URL + ownUser.profile
  img.width = 50
  img.height = 50
  img.draggable = false
  innerUserDev.appendChild(img)
  
  innerUserDev.appendChild(document.createElement("br"))
  const username = document.createElement("span")
  username.innerText = ownUser.name
  innerUserDev.appendChild(username)

  innerUserDev.appendChild(document.createElement("br"))
  const badge = document.createElement("span")
  badge.innerText = ownUser.rank.toUpperCase()
  badge.classList.add("badge")
  badge.classList.add("badge-" + ownUser.rank)
  innerUserDev.appendChild(badge)
  
  user.appendChild(innerUserDev)
  container.appendChild(user)

  // content
  const content = document.createElement("div")
  content.classList.add("news-content")

  const title = document.createElement("h2")
  title.innerText = newsItem.title
  title.classList.add("title")
  content.appendChild(title)

  content.appendChild(document.createElement("br"))

  const p = document.createElement("p")
  p.innerText = newsItem.text
  content.appendChild(p)
  
  if (newsItem.id) {
    content.appendChild(document.createElement("br"))
    const date = document.createElement("i")
    date.classList.add("post-date")
    date.innerText = "Posted " + time_ago(newsItem.id)
    content.appendChild(date)
  }

  container.appendChild(content)
  

  newsElement.appendChild(container)
}