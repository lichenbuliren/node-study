/**
 * Created by heaven on 2015/1/7.
 *
 * 路由重写中间件
 * 接受一个到/blog/posts/my-post-title的请求，
 * 基于这个URL最后的文章标题（通常称为URL的缩略名部分）查找文章的ID，
 * 然后将URL转换成/blog/ posts/。
 */

var url = require('url');

module.exports = function rewrite(req,res,next){

    var path = url.parse(req.url).pathname;
    var match = path.match(/^\/blog\/posts\/(.+)/);
    console.log(match);
    if(match){
        findPostIdBySlug(match[1],function(err,id){
            console.log('id :' + id);
            if(err) return next(err);
            if(!id) return next(new Error('User not found'));
            req.url = '/blog/post/' + id;
            console.log('id :' + id);
            next();
        });
    }else{
        next();
    }
};

//模拟找到id
function findPostIdBySlug(id,callback){
    callback(null,1);
}
