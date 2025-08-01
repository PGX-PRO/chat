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
			msgShow0 += `<div class="father-img-rmt"><div class="child-x-rmt [&>a]:text-white">`;
		} else {
			msgShow0 += `<div class="father-img-rcp"><div class="child-x-rcp [&>a]:text-black"><label class="flex items-center text-blue-500 pr-2 pl-2">${user}</label>`;
		}

		if (msg.includes(".png") === true || msg.includes(".jpg") === true) {
			msgShow0 += `<div class=" relative flex justify-center items-center flex-col"><img class="img0" src="${msg}"><a href="#" onclick="downloadImg('${msg}')"><svg class="h-5 w-20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z" fill="#1C274C"></path> <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" fill="#1C274C"></path> </g></svg></a><span class="absolute bottom-0 right-0 time-rcp">${time}</span></div></div></div>`;
		} else {
			msgShow0 += `<div class="flex justify-center items-center flex-col"><a target="_blank" class="pl-2 pr-2 font-bold text-sm inline-block" href="${msg}" download><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
<path fill="#90CAF9" d="M40 45L8 45 8 3 30 3 40 13z"></path><path fill="#E1F5FE" d="M38.5 14L29 14 29 4.5z"></path><path fill="#1976D2" d="M16 21H33V23H16zM16 25H29V27H16zM16 29H33V31H16zM16 33H29V35H16z"></path>
</svg></a><span class=" w-full text-right mr-2 text-xs text-black">${time}</span></div></div></div>`;
		}
	} else {
		if (localStorage.getItem("token") === token) {
			msgShow0 += `
                <div class="father-msg-rmt">
                    <div class="msg-send-rmt">
                        <span class="msg-rmt">${msg}</span>
                        <span class="time-rmt ">${time}</span>
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

function downloadImg(urlImagen) {
	const now = new Date();
	const timestamp = `${now.getFullYear().toString().slice(-2)}:${(now.getMonth() + 1).toString().padStart(2, "0")}:${now
		.getDate()
		.toString()
		.padStart(
			2,
			"0",
		)}_${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
		.getSeconds()
		.toString()
		.padStart(2, "0")}`;

	const extension = urlImagen.split(".").pop().split("?")[0].toLowerCase();
	const link = document.createElement("a");
	link.href = urlImagen;
	link.download = `IMG-${timestamp}.${extension}`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
document.addEventListener("DOMContentLoaded", () => {
	loadMessages();
	const ws = new WebSocket("wss://chat-ad8d.onrender.com");

	ws.onmessage = (event) => {
		const message = JSON.parse(event.data);
		if (message.type === "new_message") {
			addMessageToContainer(
				message.data.user,
				message.data.msg,
				message.data.token,
				message.data.time,
			);
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
