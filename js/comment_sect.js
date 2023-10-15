import { time_ago } from "./date_util.js"
import { API_URL } from "./global_config.js"
import { getQuery } from "./query_util.js"

const _newsElement = document.getElementById("news")
const _commentsElement = document.getElementById("comments")

let cachedNews = {}

mainRender()

async function mainRender(refetch = false) {
  if (!refetch) {
    _newsElement.innerText = "Fetching news post..."
  }
  _commentsElement.innerText = "Fetching comments..."
  try {
    if (!refetch) {
      const resNews = await fetch(API_URL + "/api/news?id=" + getQuery("id"))
      const news = await resNews.json()
      cachedNews = news
    }
    
    // comments time
    // TODO: Use real comments
    const resComments = await fetch(API_URL + "/api/news_comments?id=" + getQuery("id"))
    const comments = await resComments.json()
    
    renderEverything(cachedNews, comments, refetch)
  } catch (e) {
    _newsElement.innerText = "Failed to fetch post. Please refresh if this issue continues contact a site administrator."
    _commentsElement = "Failed to fetch comments. Please refresh if this issue continues contact a site administrator."
  }
}

async function renderEverything(news, comments, refetch) {
  if (news.length == 0) {
    _newsElement.innerText = "The news item was not found."
    _commentsElement.innerText = "Comments cannot be shown on an invalid post."
    return
  }
  await fetch(API_URL + "/api/users?id=" + [...new Set([
    ...news.map(i => i.owner),
    ...comments.map(i => i.owner)
  ])].join(","))
  .then(res => res.json())
  .then(users => {
    if (!refetch) {
      _newsElement.innerHTML = ""
      news.forEach(i => renderNewsItem(i, users, _newsElement, true, false))
    }
    _commentsElement.innerHTML = ""
    comments.forEach(i => renderNewsItem(i, users, _commentsElement, false, true))
  })
  .catch(error => {
    console.error(error)
    _newsElement.innerText = "Failed to fetch users. Please refresh, if this issue continues contact a site administrator."
    _commentsElement.innerText = "Failed to fetch users. Please refresh, if this issue continues contact a site administrator."
  })
}

function renderNewsItem(newsItem, users, newsElement, commentable, isComment) {
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

  if (!isComment) {
    const title = document.createElement("h2")
    title.innerText = newsItem.title
    title.classList.add("title")
    content.appendChild(title)
    content.appendChild(document.createElement("br"))
  }

  const p = document.createElement("p")
  p.innerText = newsItem.text
  content.appendChild(p)
  
  if (newsItem.id) {
    content.appendChild(document.createElement("br"))
    const dataContainer = document.createElement("div")

    dataContainer.classList.add("data-container")

    const date = document.createElement("i")
    date.classList.add("post-date")
    date.innerText = (isComment ? "Commented" : "Posted") + " " + time_ago(newsItem.id) + (commentable ? ` - ${newsItem.comments} Comment${newsItem.comments == 1 ? "" : "s"}` : "")

    const actions = document.createElement("div")
    actions.classList.add("f-right")


    if (commentable) {
      const commentSection = document.createElement("a")
      commentSection.classList.add("post-date")
      commentSection.href = "#"
      commentSection.addEventListener("click", () => {
        ShowCommentModal()
      })
      commentSection.innerText = "[Add Comment]"
      actions.appendChild(commentSection)
    }
    
    dataContainer.appendChild(date)
    dataContainer.appendChild(actions)

    content.appendChild(dataContainer)
  }

  container.appendChild(content)
  

  newsElement.appendChild(container)
}

function ShowCommentModal() {
  const modal = document.getElementById("comment-modal")
  modal.hidden = false
}

function HideCommentModal() {
  const modal = document.getElementById("comment-modal")
  modal.hidden = true
}

document.getElementById("comment-modal-form").addEventListener("submit", async e => {
  e.preventDefault()
  const text = document.getElementById("comment-modal-text")

  try {
    const res = await fetch(API_URL + "/api/news_comments?id=" + getQuery("id"), {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text.value
      })
    })

    const json = await res.json()

    if (json.error) {
      alert("Error: " + json.message)
      return
    }

    text.value = ""

    mainRender(true)
    HideCommentModal()
  } catch (e) {
    console.error(e)
    alert("Failed to post comment. Please try again later.")
  }
})