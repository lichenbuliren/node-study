/**
 * 聊天室对象
 * @param socket
 * @constructor
 */
function Chat(socket){
    this.socket = socket;
}

/**
 * 发送消息
 * @param room 发送消息的接收房间
 * @param text 消息内容
 */
Chat.prototype.sendMessage = function(room,text){
    var message = {
        room: room,
        text: text
    }
    this.socket.emit('message',message);
}

/**
 * 给更换聊天室
 * @param room 新的聊天室名称
 */
Chat.prototype.changeRoom = function (room) {
    this.socket.emit('join',{
        newRoom: room
    });
}

/**
 * 处理用户请求操作
 * @param commands
 */
Chat.prototype.processCommand = function (commands) {
    var words = commands.split(' ');
    var command = words[0].substring(1,words[0].length).toLocaleLowerCase();
    var message = false;

    switch (command){
        case 'join':
            words.shift();
            var room = words.join(' ');
            this.changeRoom(room);
            break;
        case 'nick':
            words.shift();
            var name = words.join(' ');
            this.socket.emit('nameAttempt',name);
            break;
        default :
            message = 'Unrecognized command.';
            break;
    }

    return message;
}