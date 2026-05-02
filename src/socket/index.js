const events = require("./events");

module.exports = (io) => {
    io.on("connection", (socket) => {
        events(io, socket);
    });
};