const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const socketInit = require("./socket");

const app = express();

app.use(cors());

app.use(express.static("public"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

socketInit(io);

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});