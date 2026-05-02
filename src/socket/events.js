const formatMessage = require("../utils/formatMessage");

const users = {}; 

module.exports = (io, socket) => {
    console.log("Usuário conectado:", socket.id);

    socket.on("set username", (username) => {
        users[socket.id] = username.trim().toLowerCase();

        io.emit(
            "chat message",
            formatMessage("Sistema", `${username} entrou no chat`, "system")
        );

        io.emit("user list", Object.values(users));
    });

    socket.on("chat message", (data) => {
        const { text } = data;
        const user = users[socket.id] || "Anônimo";

        io.emit("chat message", formatMessage(user, text));
    });

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

            io.to(targetId).emit("private message", msg);

            socket.emit("private message", msg);
        } else {
            socket.emit(
                "chat message",
                formatMessage("Sistema", "Usuário não encontrado", "system")
            );
        }
    });

    socket.on("get users", () => {
        socket.emit("user list", Object.values(users));
    });

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