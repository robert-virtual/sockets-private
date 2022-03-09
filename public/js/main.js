const socket = io();
const me = document.getElementById("me");
const form = document.getElementById("form");
const insertName = document.getElementById("insert-name");
const messages = document.getElementById("messages");
const chatContainer = document.getElementById("chat-container");
const usersContainer = document.getElementById("users-container");
let CURRENT_CHAT;

socket.on("open", (id) => {
  console.log("my id: ", id);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (CURRENT_CHAT) {
    socket.emit("private-chat", CURRENT_CHAT, form.msg.value);
  }
});

insertName.addEventListener("click", () => {
  const myName = prompt("ingrese su nombre");
  if (myName) {
    alert("Usuario agregado exitosamente");
    socket.emit("join", myName);
    me.textContent = myName;
  }
});

socket.on("new-msg", (sender, msg) => {
  console.log(sender, msg);
  chatContainer.classList.remove("d-none");
  let senderDiv = document.getElementById(sender);
  let p = document.createElement("p");
  p.textContent = `${senderDiv.textContent}: ${msg}`;
  messages.append(p);
  // senderDiv.addEventListener("click", () => {
  // });
});

socket.on("new-user", ({ socketId, name }) => {
  const div = document.createElement("div");
  div.id = socketId;
  div.classList.add("user");
  div.classList.add("list-group-item");
  div.textContent = name;
  div.addEventListener("click", () => {
    chatContainer.classList.remove("d-none");
    CURRENT_CHAT = socketId;
  });

  usersContainer.append(div);
  console.log("new-user", socketId);
});

socket.on("users", (users = []) => {
  console.log("users: ", users);

  usersContainer.innerHTML = "";
  users.forEach((u) => {
    const div = document.createElement("div");
    div.classList.add("user", "list-group-item");
    div.id = u.socketId;
    div.textContent = u.name;
    usersContainer.append(div);
  });
});

socket.on("user-left", (user) => {
  const div = document.getElementById(user.socketId);
  if (div) {
    console.log("user-left");
    div.remove();
    return;
  }
  console.log("user-left: Not Found");
});
