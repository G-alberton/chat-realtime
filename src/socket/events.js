const formatMessage = require("../utils/formatMessage");

const users = {}; // 🔥 CORRETO (plural)

module.exports = (io, socket) => {
    console.log("Usuário conectado:", socket.id);

    // 👤 definir nome
    socket.on("set username", (username) => {
        users[socket.id] = username.trim().toLowerCase();

        io.emit(
            "chat message",
            formatMessage("Sistema", `${username} entrou no chat`, "system")
        );

        io.emit("user list", Object.values(users));
    });

    // 💬 mensagem normal
    socket.on("chat message", (data) => {
        const { text } = data;
        const user = users[socket.id] || "Anônimo";

        io.emit("chat message", formatMessage(user, text));
    });

    // 📩 mensagem privada
    socket.on("private message", ({ to, message }) => {
        const from = users[socket.id] || "Anônimo";

        const targetId = Object.keys(users).find(
            (id) => users[id] === to.trim().toLowerCase()
        );

        console.log("USERS:", users);
        console.log("TO:", to);
        console.log("TARGET:", targetId);

        if (targetId) {
            const msg = formatMessage(from, message, "private");

            // envia para quem recebe
            io.to(targetId).emit("private message", msg);

            // envia para quem enviou
            socket.emit("private message", msg);
        } else {
            socket.emit(
                "chat message",
                formatMessage("Sistema", "Usuário não encontrado", "system")
            );
        }
    });

    // 📋 listar usuários
    socket.on("get users", () => {
        socket.emit("user list", Object.values(users));
    });

    // ❌ desconectar
    socket.on("disconnect", () => {
        const username = users[socket.id];

        if (username) {
            delete users[socket.id];

            io.emit(
                "chat message",
                formatMessage("Sistema", `${username} saiu do chat`, "system")
            );

            io.emit("user list", Object.values(users));
        }

        console.log("Usuário desconectado:", socket.id);
    });
};