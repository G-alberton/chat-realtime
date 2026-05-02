export function handleCommand(input, { print, socket, setUsername }) {
    const [command, ...args] = input.split(" ");

    switch (command) {
        case "/help":
            print("Comandos disponíveis:", "system");
            print("/help - listar comandos", "system");
            print("/nick [nome] - definir nome", "system");
            print("/clear - limpar terminal", "system");
            print("/users - listar usuários online", "system");
            print("/msg [usuario] [mensagem] - mensagem privada", "system");
            break;

        case "/clear":
            document.getElementById("terminal").innerHTML = "";
            break;

        case "/nick":
            const name = args[0]?.trim().toLowerCase();

            if (!name) {
                print("Uso: /nick [nome]", "system");
                return;
            }

            setUsername(name);
            socket.emit("set username", name);
            print(`Nome definido como ${name}`, "system");
            break;

        case "/users":
            socket.emit("get users");
            break;

        case "/msg":
            const to = args[0]?.trim().toLowerCase();
            const message = args.slice(1).join(" ");

            if (!to || !message) {
                print("Uso: /msg [usuario] [mensagem]", "system");
                return;
            }

            console.log("ENVIANDO PARA:", to); // DEBUG

            socket.emit("private message", { to, message });
            print(`[PRIVADO -> ${to}] ${message}`, "private");
            break;

        default:
            print("Comando não reconhecido. Digite /help", "system");
    }
}