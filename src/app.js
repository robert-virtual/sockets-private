const express = require("express");
const app = express();
const { createServer } = require("http");
const server = createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
let users = [];

io.on("connection", (socket) => {
  console.log("someone get in");
  socket.on("join", (name) => {
    console.log(`${name} joined`);
    io.to(socket.id).emit("users", users);
    const newUser = { socketId: socket.id, name };
    users.push(newUser);
    socket.on("private-chat", (reciever, msg) => {
      socket.to(reciever).emit("new-msg", socket.id, msg);
    });

    socket.broadcast.emit("new-user", newUser);

    socket.on("disconnect", () => {
      console.log(`${newUser.name} left`);
      users = users.splice(({ socketId }) => socketId == socket.id);
      io.emit("user-left", newUser);
    });
  });
});

app.use(express.static("public"));

server.listen(3000, () => {
  console.log("listening on *:3000");
});
