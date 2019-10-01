module.exports = function(io,room){
    let userNames = {};

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
}
