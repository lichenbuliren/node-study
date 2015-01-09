/**
 * Created by heaven on 2015/1/9.
 */

var express = require('express');
var photos = require('./routes/photos');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('photos', path.join(__dirname, '/public/photos'));

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
    saveUninitialized: true,
    secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//处理文件上传中间件
app.use(multer({ dest: path.join(__dirname,'public/photos')}));
//处理静态文件中间件
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', photos.list);
app.get('/upload',photos.form);
app.post('/upload',photos.submit(app.get('photos')));
app.get('/photo/:id/download',photos.download(app.get('photos')));

// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});