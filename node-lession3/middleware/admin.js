/**
 * Created by heaven on 2015/1/6.
 */

function admin(req,res,next){

    // 这里要注意的是case中用的是字符串，是/和/users，而不是/admin和/admin/users。
    // 这是因为在调用中间件之前，Connect从req.url中去掉了前缀，就像URL挂载在/上一样。
    // 这个简单的技术让程序和中间件更灵
    switch (req.url){
        case '/':
            res.end('try /uses');
            break;
        case '/users':
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(['tobi', 'loki', 'jane']));
            break;
    }
}

module.exports = admin;