/**
 * Created by heaven on 2015/1/6.
 * @version 1.0.1  实现可配置的logger中间件
 */

function setup(format){

    //匹配包括下划线的任何单词字符。等价于 '[A-Za-z0-9_]'。
    var regexp = /:(\w+)/g;
    return function logger(req,res,next){
        var str = format.replace(regexp, function (match, property) {
            return req[property];
        });
        console.log(str);
        next();
    }
}

module.exports = setup;