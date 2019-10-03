module.exports = function (io) {
  let userNames = {}
  let room = "";
  io.on('connection', function (socket) {
    socket.on('setSocketId', function (data) {
      var userName = data.name
      var userId = data.userId
      userNames[userId] = { userName, room: data.room }
      console.log(userNames)
      console.log(userNames[socket.id].room)
      room = userNames[socket.id].room;
      io.emit('user_names', userNames)
    })
    
    socket.join(room, () => {
      io.to(room).emit('a new user has joined the room')
    })

    socket.on('chat message', function (msg) {
      io.to(msg.room).emit('chat message', msg)
    })

    socket.on('join', function (name) {
      socket.broadcast.to(room).emit('join', name + ' has joined the chat')
    })


    socket.on('disconnect', function () {
      // console.log('user disconnected')
      console.log(userNames[socket.id].userName + ' disconnected')
      delete userNames[socket.id]
      console.log(userNames)
      io.emit('user_names', userNames)
    })

  })
}
