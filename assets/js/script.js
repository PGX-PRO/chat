const btnSend0 = document.getElementById("btnSend");
function ensureUserInputExists(username) {
	const form = document.getElementById("form");
	let userInput = form.querySelector('input[name="username1"]');



	if (!userInput) {
		userInput = document.createElement("input");
		userInput.type = "hidden";
		userInput.name = "username1";
		userInput.value = username;
		form.insertBefore(userInput, form.firstChild);
	} else {
		userInput.value = username;
	}
}

document.getElementById("form").addEventListener("submit", async function (e) {
	e.preventDefault();
	const savedUser = localStorage.getItem("user");
	const token = localStorage.getItem("token");
	console.log(token);
	if (!savedUser) {
		console.error("No se encontró usuario en localStorage");
		return;
	}
	ensureUserInputExists(savedUser);

	const formData = new FormData(this);
	const msgInput = this.querySelector('input[name="msg"]');
	const message = msgInput.value.trim();

	if (!message) {
		console.error("El mensaje está vacío");
		return;
	}

	try {
  if(message === "exit" || message === "salir" || message === "logout"){
localStorage.clear();
location.reload();
return;
  } 

  let msgArray = message.split(" ");
let rangeArray = msgArray.length;
if(rangeArray === 3){ 
if (msgArray[0] === "change" && msgArray[1] === "username" || msgArray[1] === "user"){
 localStorage.setItem('user', msgArray[2]);
 location.reload();
}
}



		const response = await fetch("/send", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username1: savedUser,
				msg: message,
				token: token,
				time: new Date().toLocaleTimeString("es-ES", {
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
					hour12: false, // Formato 24h
				}),
			}),
		});

		const result = await response.json();

		if (response.ok) {
			console.log("Mensaje enviado:", result);
   btnSend0.style.display="none";
			msgInput.value = "";
		} else {
			console.error("Error al enviar:", result.error);
		}
	} catch (error) {
		console.error("Error en la solicitud:", error);
	}
});



function chat(username){
 	
		if (!username) return;
		const token = Math.random().toString(36).slice(2, 14).toUpperCase();
		localStorage.setItem("user", username);
		localStorage.setItem("token", token);
		document.getElementById("inputUsername").style.display = "none";
		document.getElementById("showMessage").style.display = "flex";
		ensureUserInputExists(username);
	}


document.getElementById("user").addEventListener("keyup", function (event) {
 const username = this.value.trim();
 if (event.key === "Enter") {
chat(username);
}
});
