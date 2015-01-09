/**
 * Created by heaven on 2015/1/6.
 */
function hello(req,res){
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world');
}

module.exports = hello;
