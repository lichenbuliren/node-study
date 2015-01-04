/**
 * Created by heaven on 2014/12/30.
 */

var http = require('http');
var url = require('url');

function start(route,handle){

    http.createServer(function(request,response){

        var pathname = url.parse(request.url).pathname;
        console.log('Request for ' + pathname + ' received');
        route(handle,pathname,request,response);

    }).listen(4000);

    console.log('server had started !');
}

exports.start = start;





