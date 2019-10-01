$(function () {
    var socket = io();
    var nickname = sessionStorage.getItem("nickname");
    var room = sessionStorage.getItem("room");

    $("form").submit(function (e) {
      e.preventDefault();
      socket.emit("chat message", { msg: $("#m").val(), nickname, date:moment().format('LT')});
      $("#m").val("");
      return false;
    });

    socket.on("chat message", function (msg) {
      const el = `
        <div class="d-flex w-100 justify-content-between">
          <span class="text-dark">${msg.nickname} : ${msg.msg}</span>
          <small>${msg.date}</small>
         </div>
        `
      $("#messages").append($("<li>").addClass("list-group-item list-group-item-light mx-5 my-1").html(el));
      document.getElementById("messages").lastElementChild.scrollIntoView();
    });

    socket.on("user_names", function (userNames) {
      const users = Object.values(userNames).filter(client=>client.room===room).map(client=>`<li class="list-group-item">${client.userName}</li>`);
      $("#users").html(users);
    });

    
    socket.on('connect', function () {
      data = {name: nickname, userId: socket.id, room};
      socket.emit('setSocketId', data);


      socket.emit("join", nickname);
      socket.on('join', function (data) {
        $("#messages").append($("<li>").addClass("list-group-item list-group-item-success mx-5 my-1").text(data));
      })
    });
  });