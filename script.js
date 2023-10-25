const wsURL = "wss://echo-ws-service.herokuapp.com/";
const inputForm = document.querySelector(".input-wrapper form"),
	submitButton = document.querySelector(".input-wrapper form button.submit"),
	geolocationButton = document.querySelector(
		".input-wrapper form button.geolocation"
	),
	input = document.querySelector(".input"),
	messages = document.querySelector(".messages");

const actions = {
	NONE: "NONE",
	START: "START",
	SEND_USUAL: "SEND_USUAL",
	SEND_GEOLOCATION: "SEND_GEOLOCATION",
	RECEIVE: "RECEIVE",
	APPEND_MESSAGE: "APPEND_MESSAGE",
};

let lastAction = actions.NONE;

const websocket = new WebSocket(wsURL);
lastAction = actions.START;

inputForm.addEventListener("submit", (event) => {
	event.preventDefault();
});

submitButton.addEventListener("click", sendUsual);
geolocationButton.addEventListener("click", () => {
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition((position) => {
			lastAction = actions.SEND_GEOLOCATION;
			const data = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			};

			websocket.send(JSON.stringify(data));
			appendMessage(
				`<a href="https://www.openstreetmap.org/#map=18/${data.latitude}/${data.longitude}">Гео-локация</a>`,
				"mine",
				true
			);
		});
	}
});

input.addEventListener("keypress", (event) => {
	if (event.key === "Enter") {
		sendUsual(event);
	}
});

websocket.addEventListener("message", (event) => {
	if (lastAction === actions.SEND_USUAL) {
		appendMessage(event.data, "system");
	}

	lastAction = actions.RECEIVE;
});

function sendUsual(event) {
	lastAction = actions.SEND_USUAL;
	event.preventDefault();
	const message = input.value;
	if (!message) return;

	appendMessage(message, "mine");
	websocket.send(message);
	input.value = "";
}

function appendMessage(message, type, useInnerHTML = false) {
	let messageBlock = document.createElement("div");
	messageBlock.classList.add("message", type);
	if (useInnerHTML) {
		messageBlock.innerHTML = message;
	} else {
		messageBlock.textContent = message;
	}

	messages.appendChild(messageBlock);
}
