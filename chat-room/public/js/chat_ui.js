/**
 * 用来显示可疑的文本
 * @param message
 * @returns {*|jQuery}
 */
function divEscapedContentElement(message){
    return $('<div></div>').text(message);
}

/**
 * 用来显示系统创建的受信内容
 * @param message
 * @returns {*|jQuery}
 */
function divSystemContentElement(message){
    return $('<div></div>').html('<i>' + message + '</i>');
}

/**
 * 处理用户输入请求
 * @param chatApp 聊天室原型对象
 * @param socket
 */
function processUserInput(chatApp,socket){
    var message = $('#send-message').val();
    var systemMessage;

    if(message.charAt(0) == '/'){
        systemMessage = chatApp.processCommand(message);
        if(systemMessage){
            $('#message').append(divSystemContentElement(systemMessage));
        }
    }else{
        chatApp.sendMessage($('#room').text(),message);
        $('#message').append(divEscapedContentElement(message));
        $('#message').scrollTo($('#message').prop('scrollHeight'));
    }

    $('#send-message').val('');
}


var socket = io.connect();

$(function(){
    var chatApp = new Chat(socket);

    //监听修改名字消息
    socket.on('nameResult',function(result){
        var message;
        if(result.success){
            message = 'You are now know as ' + result.name + '.';
        }else{
            message = result.message;
        }

        $('#message').append(divSystemContentElement(message));
    });

    //监听加入房间消息
    socket.on('joinResult',function(result){
        $('#room').text(result.room);
        $('#message').append(divSystemContentElement('Room changed.'));
    });

    socket.on('message', function (message) {
        var newElement = $('<div></div>').text(message.text);
        $('#message').append(newElement);
    });

    socket.on('rooms',function(rooms){
        $('#room-list').empty();

        for(var room in rooms){
            room = room.substring(1,room.length);
            if(room != ''){
                $('#room-list').append(divEscapedContentElement(room));
            }
        }

        $('#room-list div').click(function(){
            chatApp.processCommand('/join ' + $(this).text());
            $('#send-message').focus();
        });
    });

    setInterval(function () {
        socket.emit('rooms');
    },1000);

    $('#send-message').focus();

    $('#send-form').submit(function(){
        processUserInput(chatApp,socket);
        return false;
    });
});