/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(express);
var path = require('path');
var app = express();
var dbUrl = 'mongodb://localhost:27017/imooc';
app.locals.moment = require('moment');

mongoose.connect('mongodb://localhost:27017/imooc');
console.log('mongoose is connected');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views/pages'));

//改变默认模板后缀
app.set('view engine', 'jade');
// app.engine('.html', require("jade").__express);
// app.set('view engine', 'html'); // app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));


// app.use(express.json());
// app.use(express.urlencoded());
app.use(express.bodyParser({
	keepExtensions: true,
	uploadDir: './public/images'
}));

app.use(express.methodOverride());

//express.cookieParser()是Cookie解析的中间件
app.use(express.cookieParser());
app.use(express.session({
	secret: 'imooc',
	store: new mongoStore({
		url: dbUrl,
		connection: 'session'
	})
}));

// app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

routes(app);

http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});