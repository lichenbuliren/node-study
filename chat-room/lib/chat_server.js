var Socketio = require('socket.io');

var io;

var guestNumber = 1;

var nickNames = {};

var nameUsed = [];

var currentRoom = {};

var userList = {};

var rooms = {};

exports.listen = function (server) {
	io = Socketio.listen(server);
	io.sockets.on('connection', function (socket) {
		// 在用户连接上来时，赋予其一个访客名
		guestNumber = assignGuestName(socket, guestNumber, nickNames, nameUsed);
		// 将用户连接上来时放入lobby
		joinRoom(socket, 'Lobby');

		// 处理用户的消息，更名，以及聊天室的创建和变更
		handleMessageBroadcasting(socket, nickNames);
		handleNameChangeAttempts(socket, nickNames, nameUsed);
		handleRoomJoining(socket);

		// 当用户发出请求时，向其提供已经被占用的聊天室的列表
		socket.on('rooms', function () {
			socket.emit('rooms', rooms);
		});

		// 定义用户断开连接后的清除逻辑
		handleClientDisconnection(socket, nickNames, nameUsed);
	});
}

// 给用户分配一个昵称
function assignGuestName(socket, guestNumber, nickNames, nameUsed) {
	// 生成新的昵称
	var name = 'Guest' + guestNumber;
	// 把用户昵称跟客户端连接ID关联上
	nickNames[socket.id] = name;
	// 让用户知道他们的昵称
	socket.emit('nameResult', {
		success: true,
		name: name
	});
	// 存放已经占用的昵称
	nameUsed.push(name);
	return guestNumber + 1;
}

//获取同一个房间里面的用户
function usersInRoom(room){
	var users = [];
	for(var id in currentRoom){
		if(currentRoom[id] === room){
			users.push(nickNames[id]);
		}
	}
	return users;
}

// 进入聊天室的逻辑
function joinRoom(socket, room) {

	// 让用户进入房间
	socket.join(room);

	// 记录用户的当前房间
	currentRoom[socket.id] = room;
	userList[socket.id] = room;
	if(!rooms[room]){
		rooms[room] = [];
	}
	rooms[room].push(socket.id);

	// 通知用户他进入了新的房间
	socket.emit('joinResult', {
		room: room
	});

	// 广播信息给房间里面的其他用户
	socket.broadcast.to(room).emit('message', {
		text: nickNames[socket.id] + ' has joined ' + room + '.'
	});

	// 读取房间里面的所有用户
	var users = usersInRoom(room);
	console.log(users);
	if (users.length > 1) {
		var usersInRoomSummary = 'Users currently in ' + room + ': ';
		for (var i = 0, len = users.length; i < len; i++) {
			usersInRoomSummary += i > 0 ? ', ' + users[i] : users[i];
		}
		usersInRoomSummary += '.';
		socket.emit('message', {
			text: usersInRoomSummary
		});
	}
}

//处理用户的消息
function handleMessageBroadcasting(socket,nickNames){
	socket.on('message',function(message){
		socket.broadcast.to(message.room).emit('message',{
			text: nickNames[socket.id] + ': ' + message.text
		});
	});
}

//修改名称
function handleNameChangeAttempts(socket, nickNames, nameUsed){
	//添加'nameAttempt'事件的监听器
	socket.on('nameAttempt',function(name){
		if(name.indexOf('Guest') == 0){	  //昵称不能以“Guest”开头
			socket.emit('nameResult',{
				success: false,
				message: 'Names cannot begin with "Guest".'
			});
		}else{
			if(nameUsed.indexOf(name) == -1){	//如果还没有注册，就注册该名称
				var previousName = nickNames[socket.id],
					previousNameIndex = nameUsed.indexOf(previousName);
				nameUsed.push(name);
				nickNames[socket.id] = name;
				delete nameUsed[previousNameIndex];
				socket.emit('nameResult',{
					success: true,
					name: name
				});

				socket.broadcast.to(currentRoom[socket.id]).emit('message',{
					text: previousName + ' is now know as ' + name + '.'
				});
			}else{
				socket.emit('nameResult',{
					success: false,
					message: 'That name is already in use'
				});
			}
		}
	});
}

//创建房间，如果房间不存在，则新建一个房间
function handleRoomJoining(socket){
	socket.on('join',function(room){
		var prevRoom = userList[socket.id];
		socket.leave(prevRoom);
		var oldUsers = rooms[prevRoom];
		for (var i = 0, len = oldUsers.length; i < len; i++) {
			if(oldUsers[i] == socket.id){
				oldUsers.splice(i,1);
				return;
			}
		}
		delete userList[socket.id];
		joinRoom(socket,room.newRoom);
	})
}

//清除离开的用户信息
function handleClientDisconnection(socket, nickNames, nameUsed){
	socket.on('discount',function(){
		var nameIndex = nameUsed.indexOf(nickNames[socket.id]);
		delete nameUsed[nameIndex];
		delete nickNames[socket.id];
	});
}