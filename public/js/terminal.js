import socket from "./socket.js";
import { handleCommand } from "./commands.js";

const terminal = document.getElementById("terminal");
const input = document.getElementById("msg");

let username = "Anônimo";

function print(text, className = "") {
    const line = document.createElement("div");
    line.classList.add("line");

    if (className) {
        line.classList.add(className);
    }

    line.textContent = text;
    terminal.appendChild(line);

    terminal.scrollTop = terminal.scrollHeight;
}

print("Bem-vindo ao Terminal Chat!", "system");
print("Digite /help para ver os comandos disponíveis", "system");

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const value = input.value.trim();

        if (!value) return;

        print(`> ${value}`);

        if (value.startsWith("/")) {
            handleCommand(value, { print, socket, setUsername });
        } else {
            socket.emit("chat message", {
                user: username,
                text: value,
            });
        }

        input.value = "";
    }
});

socket.on("chat message", (data) => {
    const { user, text } = data;
    print(`${user}: ${text}`);
});

function setUsername(name) {
    username = name;
}