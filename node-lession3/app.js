/**
 * Created by heaven on 2015/1/6.
 */

var logger = require('./middleware/logger');
var hello = require('./middleware/hello');
var restrict = require('./middleware/restrict');
var admin = require('./middleware/admin');

var connect = require('connect');

var app = connect();

app.use(logger(':method :url'));

/**
 * 当.use()的第一个参数是个字符串时，只有URL前缀与之匹配时，Connect才会调用后面的中间件
 * 这个可以当做我们验证管理后台的用户的认证中间件
 */
app.use('/admin',restrict);
app.use('/admin',admin);
app.use(hello);

app.listen(3000);
