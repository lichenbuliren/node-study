/**
 * Created by heaven on 2014/12/31.
 */

var app = require('./app');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

var handle = {}
handle['/'] = requestHandlers.start;
handle['/start'] = requestHandlers.start;
handle['/upload'] = requestHandlers.upload;
handle['/show'] = requestHandlers.show;

app.start(router.route,handle);