// login elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")
const loginLogo = document.querySelector(".container__logo")

// chat elements
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

const colors = [
    "palevioletred",
    "lightcoral",
    "aquamarine",
    "lightsalmon",
    "cornflowerblue",
    "hotpink",
    "plum",
    "gold"
]

const user = { id: "", name: "", color: "" }

let websocket

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")
    const timestamp = document.createElement("div")

    div.classList.add("message--self")
    timestamp.classList.add("message--timestamp")
    div.innerHTML = content
    timestamp.innerHTML = getCurrentDateTime() // Adiciona a data e hora atual

    div.appendChild(timestamp);

    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")
    const timestamp = document.createElement("div")

    div.classList.add("message--other")
    timestamp.classList.add("message--timestamp")

    span.classList.add("message--sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content

    timestamp.innerHTML = getCurrentDateTime()
    div.appendChild(timestamp)

    return div
}

const getCurrentDateTime = () => {
    const now = new Date();
    const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };

    const date = now.toLocaleDateString(undefined, dateOptions);
    const time = now.toLocaleTimeString(undefined, timeOptions);

    return `${date} ${time}`;
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data)

    const message =
        userId == user.id
            ? createMessageSelfElement(content)
            : createMessageOtherElement(content, userName, userColor)

    chatMessages.appendChild(message)

    scrollScreen()
}

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    // Adiciona a classe 'hidden' ao container__logo
    loginLogo.classList.add("hidden");

    websocket = new WebSocket("wss://freechat-backend.onrender.com")
    websocket.onmessage = processMessage
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))

    chatInput.value = ""
    console.log(message)
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)