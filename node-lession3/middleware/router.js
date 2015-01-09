/**
 * Created by heaven on 2015/1/6.
 * 简单的路由中间件
 */

var parse = require('url').parse;

module.exports = function route(obj){
    return function(req,res,next){
        if(!obj[req.method]){
            next();
            return;
        }

        //查找req.method对应的路径
        var routes = obj[req.method];

        //解析URL,以便跟pathname匹配
        var url = parse(req.url);
        var paths = Object.keys(routes);
        console.log(paths);

        for(var i = 0; i < paths.length; i++) {
            var path = paths[i];
            var fn = routes[path];
            path = path.replace(/\//g, '\\/')
                .replace(/:(\w+)/g, '([^\\/]+)');
            var re = new RegExp('^' + path + '$');
            var captures = url.pathname.match(re);
            if(captures){
                var args = [req,res].concat(captures.slice(1));
                fn.apply(null,args);
                return;
            }
        }
        next();
    }
};