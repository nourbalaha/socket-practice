const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const ejs = require("ejs");
const expressLayouts = require('express-ejs-layouts');

app.set("view engine","ejs");
app.use(expressLayouts);

app.use(express.static(__dirname + '/public'));

let room = "";
let nickname = "";

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get("/", function(req, res) {
  res.render("index");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/room", function(req, res) {
  res.render("room");
});
app.post("/room", function(req, res) {
  console.log(req.body)
  nickname = req.body.nickname;
  room = req.body.room;
  res.render("room");
});

io.on("connection", function(socket) {
  console.log("a user connected");

  socket.join(room, () => {
    let rooms = Object.keys(socket.rooms);
    console.log(rooms); // [ <socket.id>, room ]
    io.to(room).emit('a new user has joined the room'); // broadcast to everyone in the room
  });

  socket.on("chat message", function(msg) {
    io.to(room).emit("chat message", msg);
  });

  socket.on("join", function(name) {
    socket.broadcast.to(room).emit("join", name + " has joined the chat");
  });

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
