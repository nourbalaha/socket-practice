var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var bodyParser = require("body-parser");

let room = "";
let nickname = "";

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/start.html");
});
app.get("/login", function(req, res) {
  res.sendFile(__dirname + "/login.html");
});
app.get("/index", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.post("/index", function(req, res) {
  console.log(req.body)
  nickname = req.body.nickname;
  room = req.body.room;
  res.sendFile(__dirname + "/index.html");
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
