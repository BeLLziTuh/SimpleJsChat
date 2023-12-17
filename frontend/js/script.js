const login = document.querySelector('.login')
const loginForm = login.querySelector('.login__form')
const loginInput = login.querySelector('.login__input')

const chat = document.querySelector('.chat')
const chatForm = chat.querySelector('.chat__form')
const chatInput = chat.querySelector('.chat__input')
const chatMessages = chat.querySelector('.chat__messages')

const user = { id: '', name: ''}

let websocket

const createMessageSelfElement = (content, sender) => {
    const div = document.createElement('div')
    const span = document.createElement('span')

    div.classList.add('self__message')

    span.classList.add('message__sender')

    div.appendChild(span)

    span.innerHTML = `${sender} 《YOU》`
    div.innerHTML += content

    return div
}

const createMessageOtherElement = (content, sender) => {
    const div = document.createElement('div')
    const span = document.createElement('span')
    const hr = document.createElement('hr')

    div.classList.add('other__message')

    span.classList.add('message__sender')

    hr.classList.add('message__sender__hr')

    div.appendChild(span)
    div.appendChild(hr)

    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const createMessageConsoleElement = (content) => {
    const div = document.createElement('div')

    div.classList.add('console__message')
    
    div.innerHTML = content

    return div
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    })
}

const processMessage = ({ data }) => {
    const { userId, userName, content } = JSON.parse(data)
    
    const message = msgSenderVerify()

    function msgSenderVerify() {
        if (userId == user.id) {
            return createMessageSelfElement(content, userName)
        } if (userId != user.id && userId == 1) {
            return createMessageConsoleElement(content, userName)
        } else {
            return createMessageOtherElement(content, userName)
        }
    }

    chatMessages.appendChild(message)

    scrollScreen()
}

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value.toUpperCase()

    login.style.display = 'none'
    chat.style.display = 'flex'

    websocket = new WebSocket('wss://chat-backend-q6gu.onrender.com')
    websocket.onmessage = processMessage
    
    websocket.onopen = () => {
        const loiginNoticeMessage = {
            userId: 1,
            userName: 'SYSTEM',
            content: `(◞ꈍ∇ꈍ)っ🎁(( ${user.name} )) ~~~> connected! ٩(º▽º๑)`
        }

        websocket.send(JSON.stringify(loiginNoticeMessage))
    }

    chatInput.value = ''
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))

    chatInput.value = ''
}

loginForm.addEventListener('submit', handleLogin)
chatForm.addEventListener('submit', sendMessage)

function rainbow(){
    message__sender.classList.add('rainbow_effect')
}
