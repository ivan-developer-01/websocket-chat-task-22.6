const wsURL = "wss://echo-ws-service.herokuapp.com/";
const inputForm = document.querySelector(".input-wrapper form"),
	input = document.querySelector(".input"),
	messages = document.querySelector(".messages");

const websocket = new WebSocket(wsURL);

inputForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const message = input.value;
	if (!message) return;

	appendMessage(message, "mine");
	websocket.send(message);
	input.value = "";
});

websocket.addEventListener("message", (event) => {
	appendMessage(event.data, "system");
});

function appendMessage(message, type) {
	let messageBlock = document.createElement("div");
	messageBlock.classList.add("message", type);
	messageBlock.textContent = message;
	messages.appendChild(messageBlock);
}
