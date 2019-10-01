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

require("./socket")(io,room);

http.listen(3000, function() {
  console.log("listening on *:3000");
});
