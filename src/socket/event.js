const formatMessage = require("../utils/formatMessage");

const user = {};

module.exports = (io, socket) => {
    console.log("Usuário conectado:", socket.id);

    socket.on("set username", (username) => {
        user[socket.id] = username;

        io.emit("chat message", formatMessage("Sistema", `${username} entrou no chat`));

        io.emit("user list", Object.values(users));
    });

    socket.on("chat message", (data) => {
        const {user, text} = data;

        io.emit("chat message", formatMessage(user, text));
    });

    socket.on("private message", ({to, message}) => {
        const from = user[socket.id];

        const targetId = Object.keys(users).find(
            (id) => users[id] === to
        );

        if (targetId) {
            io.to(targetId).emit(
                "private message",
                formatMessage(from, message)
            );
        }
    });

    socket.on("get users", () => {
        socket.emit("user list", Object.values(users));
    });

    socket.on("disconnect", () => {
        const username = user[socket.id];

        if (username) {
            delete user[socket.id];

            io.emit("chat message", formatMessage("Sistema", `${username} saiu do chat`));
            io.emit("user list", Object.values(user));
        }

        console.log("Usuário desconectado:", socket.id);
    })
}