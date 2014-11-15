var socketio = require('socket.io');

var io;

var guestNumber = 1;

var nickNames = {};

var nameUsed = [];

var currentRoom = {};


exports.listen = function (server) {
	io = socketio.listen(server);
	io.set('log level', 1);

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
			socket.emit('rooms', io.sockets.manager.rooms);
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

// 进入聊天室的逻辑
function joinRoom(socket, room) {
	// 让用户进入房间
	socket.join(room);
	// 记录用户的当前房间
	currentRoom[socket.id] = room;
	// 通知用户他进入了新的房间
	socket.emit('joinResult', {
		room: room
	});

	// 广播信息给房间里面的其他用户
	socket.broadcast.to(room).emit('message', {
		text: nickNames[socket.id] + ' has joined ' + room + '.'
	});

	// 读取房间里面的所有用户
	var usersInRoom = io.sockets.clients(room);
	if (usersInRoom.length > 1) {
		var usersInRoomSummary = 'Users currently in ' + room + ': ';
		for (var i in usersInRoom) {
			var userSocketId = usersInRoom[i].id;
			if (userSocketId != socket.id) {
				usersInRoomSummary += i > 0 ? ', ' : nickNames[userSocketId];
			}
		}
		usersInRoomSummary += '.';
		socket.emit('message', {
			text: usersInRoomSummary
		});
	}
}