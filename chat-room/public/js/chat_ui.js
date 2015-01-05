$(function(){

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
                $('#messages').append(divSystemContentElement(systemMessage));
            }
        }else{
            chatApp.sendMessage($('#room').text(),message);
            $('#messages').append(divEscapedContentElement(message));
            $('#messages').scrollTop($('#messages').prop('scrollHeight'));
        }

        $('#send-message').val('');
    }

    var socket = io.connect();

    var chatApp = new Chat(socket);

    $('#room-list').delegate('div','click',function(){
        chatApp.processCommand('/join ' + $(this).text());
        $('#send-message').focus();
    });

    setInterval(function () {
        socket.emit('rooms');
    },1000);

    $('#send-message').focus();

    $('#send-button').click(function(){
        processUserInput(chatApp,socket);
    });

    $('#send-form').submit(function(){
        $('#send-button').trigger('click');
        return false;
    });

    //监听修改名字消息
    socket.on('nameResult',function(result){
        var message;
        if(result.success){
            message = 'You are now know as ' + result.name + '.';
        }else{
            message = result.message;
        }

        $('#messages').append(divSystemContentElement(message));
    });

    //监听加入房间消息
    socket.on('joinResult',function(result){
        $('#room').text(result.room);
        $('#messages').append(divSystemContentElement('Room changed.'));
    });

    socket.on('message', function (message) {
        var newElement = $('<div></div>').text(message.text);
        $('#messages').append(newElement);
    });

    socket.on('rooms',function(rooms){
        $('#room-list').empty();
        for(var room in rooms){
            if(room != ''){
                $('#room-list').append(divEscapedContentElement(room));
            }
        }
    });
});