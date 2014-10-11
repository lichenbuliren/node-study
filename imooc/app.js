
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var mongoose = require('mongoose');
var _ = require('lodash');
var Movie = require('./models/Movie');
var path = require('path');

var app = express();
mongoose.connect('mongodb://localhost:27017/imooc');

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

app.use(app.router);
app.use(express.static(path.join(__dirname, 'bower_components')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// index page
app.get('/', function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
		res.render('index',{
			title: 'imooc 首页',
			movies: movies
		});
	});
});

// detail page
app.get('/movie/:id', function(req,res){
	var id = req.params.id;
	console.log("id = " + id);
	Movie.findById(id, function(err,movie){
		//TO DO deal err
		if(err){
			console.log(err);
		}
		res.render('detail',{
			title: 'imooc 详情页',
			movie: movie
		});
	});
});

// admin page
app.get('/admin/movie', function(req,res){
	res.render('admin',{
		title: 'imooc 后台录入页',
		movie: {
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			language: '',
			flash: '',
			summary: ''
		}
	});
});

//admin update movie
app.get('/admin/update/:id',function(req,res){
	var id = req.params.id;
	if(id){
		Movie.findById(id,function(err,movie) {
			res.render('admin',{
				title: 'imooc 后台录入页',
				movie: movie
			});
		})
	}
});

//admin post movie
app.post('/admin/movie/new',function(req,res){
	var id = req.body.movie._id;
	console.log("id=" + id);
	var movieObj = req.body.movie;
	console.dir(movieObj);
	var _movie;
	if(id !== 'undefined'){
		Movie.findById(id,function(err,movie) {
			if(err){
				console.log(err);
			}
			_movie = _.assign(movie,movieObj);
			_movie.save(function(err,movie) {
				if(err){
					console.log(err);
				}
				res.redirect('/movie/' + _movie._id);
			});
		});
	}else{
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		});
		console.dir(_movie);
		_movie.save(function(err,movie) {
			console.log("save call back");
			if(err){
				console.log(err);
			}
			res.redirect('/movie/' + movie._id);
		});
	}
});

// list page
app.get('/admin/list', function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
		res.render('index',{
			title: 'imooc 首页',
			movies: movies
		});
	});
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
