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
let userNames = {};

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get("/", function(req, res) {
  res.render("index");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/room", function(req, res) {
  if(nickname!==""&&room!==""){
    res.render("room",{nickname,room});
  } else {
    res.render("login");
  }
});
app.post("/room", function(req, res) {
  nickname = req.body.nickname;
  room = req.body.room;
  res.render("room",{nickname,room});
});

io.on("connection", function(socket) {
  console.log("a user connected");

  socket.join(room, () => {
    io.to(room).emit('a new user has joined the room');
  });
  

  socket.on("chat message", function(msg) {
    io.to(room).emit("chat message", msg);
  });

  socket.on("join", function(name) {
    socket.broadcast.to(room).emit("join", name + " has joined the chat");
  });


  socket.on('setSocketId', function(data) {
      var userName = data.name;
      var userId = data.userId;
      userNames[userId] = {userName,room};
      console.log(userNames)
      io.emit("user_names",userNames);
    });
    
    
    
    socket.on("disconnect", function() {
      // clients.splice(clients.indexOf(client), 1);
      console.log("user disconnected");
      // console.log(clients.filter(client=>client.connected).length);
      // io.emit("clients",clients);
      console.log(userNames[socket.id] + " disconnected")
      delete userNames[socket.id];
      console.log(userNames)
      io.emit("user_names",userNames);
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
