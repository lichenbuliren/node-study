/**
 * Created by heaven on 2015/1/6.
 * 构建简单的路由中间件
 * 构建一个重写URL的中间件
 */

var logger = require('./middleware/logger');
var rewrite = require('./middleware/rewrite');
var connect = require('connect');

var app = connect();

//启用路由中间件
app.use(logger(':method :url'))
    .use(rewrite)
    .use(showPost);

function showPost(req,res,next){
    res.redirect(req.url);
}

app.listen(3000);
