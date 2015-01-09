/**
 * Created by heaven on 2015/1/6.
 */
function restrict(req,res,next){
    var authorization = req.headers.authorization;
    if(!authorization){
        return next(new Error('Unauthorized'));
    }

    var parts = authorization.split(' ');
    var scheme = parts[0];
    var auth = new Buffer(parse[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];

    authenticateWithDatabase(user,pass, function (err) {
        if(err) return next(err);

        next();
    });
}

//模拟验证，真实环境需在数据库验证信息
function authenticateWithDatabase(user,pass,callback){
    callback(null);
}

exprots = restrict;
