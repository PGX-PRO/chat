const input = document.getElementById("msg0");
const btnSend = document.getElementById("btnSend");
input.addEventListener("input", function () {
	if (this.value.length >= 1) {
		btnSend.style.display = "block";
	} else {
		btnSend.style.display = "none";
	}
});

const info = document.getElementById("info");
let isInitialLoad = true;

function notify(number) {
	if (number === 0) {
		info.innerHTML = "NO MESSAGES FOUND IN THE DATABASE";
	} else {
		info.innerHTML = "";
		info.style.display = "none";
	}
}

async function loadMessages() {
	try {
		const response = await fetch("/messages");
		const messages = await response.json();
		notify(messages.length);

		if (messages.length > 0) {
			info.style.display = "none";
			const container = document.getElementById("Allmsg");
			container.innerHTML = "";
			const sortedMessages = [...messages].sort((a, b) => {
				return new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`);
			});

			sortedMessages.forEach((msg) => {
				addMessageToContainer(msg.user, msg.msg, msg.token, msg.time, true);
			});

			isInitialLoad = false;
			container.scrollTop = container.scrollHeight;
		}
	} catch (error) {
		console.error("Error al cargar mensajes:", error);
	}
}

function addMessageToContainer(user, msg, token, time, isHistorical = false) {
	const container = document.getElementById("Allmsg");
	const msgDiv = document.createElement("div");
	msgDiv.style.width = "100%";
	let msgShow0 = "";

	if (msg.includes("://tmpfiles.org/dl/") === true) {
		if (localStorage.getItem("token") === token) {
			msgShow0 += `<div class="father-img-rmt"><div class="child-x-rmt [&>a]:text-white"><label class="flex items-center text-white pr-2 pl-2">${user}</label>`;
		} else {
			msgShow0 += `<div class="father-img-rcp"><div class="child-x-rcp [&>a]:text-black"><label class="flex items-center text-blue-500 pr-2 pl-2">${user}</label>`;
		}

		if (msg.includes(".png") === true || msg.includes(".jpg") === true) {
			msgShow0 += `<a class="pl-2 pr-2 font-bold text-sm inline-block" href="${msg}" download>IMAGEN ADJUNTA</a></div></div>`;
		} else {
			msgShow0 += `<a class="pl-2 pr-2 font-bold text-sm inline-block" href="${msg}" download>DOCUMENTO ADJUNTO</a></div></div>`;
		}
	} else {
		if (localStorage.getItem("token") === token) {
			msgShow0 += `
                <div class="father-msg-rmt">
                    <div class="msg-send-rmt">
                        <span class="user-rmt">${user}</span>
                        <span class="msg-rmt">${msg}</span>
                        <span class="time-rmt">${time}</span>
                    </div>
                </div>`;
		} else {
			msgShow0 += `
                <div class="father-msg">
                    <div class="child-div-one">
                        <div class="child-div-two">
                            <span id="showUser">${user}</span>
                            <span class="message">${msg}</span>
                            <span class="time-rcp">${time}</span>
                        </div>
                    </div>
                </div>`;
		}
	}

	msgDiv.innerHTML = msgShow0;

	if (isHistorical) {
		container.appendChild(msgDiv);
	} else {
		container.appendChild(msgDiv);
		container.scrollTop = container.scrollHeight;
	}
}

document.addEventListener("DOMContentLoaded", () => {
	loadMessages();
	const ws = new WebSocket("wss://chat-ad8d.onrender.com");

	ws.onmessage = (event) => {
		const message = JSON.parse(event.data);
		if (message.type === "new_message") {
			addMessageToContainer(message.data.user, message.data.msg, message.data.token, message.data.time);
			const container = document.getElementById("Allmsg");
			const currentMessages = container.querySelectorAll("div").length;
			notify(currentMessages + 1);
		}
	};

	const savedUser = localStorage.getItem("user");
	const savedToken = localStorage.getItem("token");

	if (savedUser && savedToken) {
		document.getElementById("user").value = savedUser;
		document.getElementById("inputUsername").style.display = "none";
		document.getElementById("showMessage").style.display = "flex";
		ensureUserInputExists(savedUser);
	}
});


