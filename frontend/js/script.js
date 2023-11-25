const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

const user = { id: "", name: ""}

let websocket

const createMessageSelfElement = (content, sender) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("self__message")

    span.classList.add("message__sender")

    div.appendChild(span)

    span.innerHTML = `${sender} 《YOU》`
    div.innerHTML += content

    return div
}

const createMessageOtherElement = (content, sender) => {
    const div = document.createElement("div")
    const span = document.createElement("span")
    const hr = document.createElement("hr")

    div.classList.add("other__message")

    span.classList.add("message__sender")

    hr.classList.add("message__sender__hr")

    div.appendChild(span)
    div.appendChild(hr)

    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({ data }) => {
    const { userId, userName, content } = JSON.parse(data)

    const message =
        userId == user.id ?
            createMessageSelfElement(content, userName) : createMessageOtherElement(content, userName)

    chatMessages.appendChild(message)

    scrollScreen()
}

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value.toUpperCase()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("wss://chat-backend-q6gu.onrender.com")
    websocket.onmessage = processMessage
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))

    chatInput.value = ""
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)