/**
 * Created by heaven on 2015/1/6.
 * 构建简单的路由中间件
 */

var logger = require('./middleware/logger');
var router = require('./middleware/router');
var connect = require('connect');

var app = connect();

var routes = {
    GET: {
        '/users': function(req,res){
            res.end('tobi, loki, ferret');
        },
        '/user/:id': function (req, res, id) {
            res.end('user ' + id);
        }
    },
    DELETE: {
        '/user/:id': function (req, res, id) {
            res.end('deleted user ' + id);
        }
    }
};

//启用路由中间件
app.use(logger(':method :url')).use(router(routes));

app.listen(3000);
