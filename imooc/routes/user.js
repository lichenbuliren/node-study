var _ = require('lodash');
var Movie = require('../models/Movie');
var User = require('../models/User');

module.exports = function (app) {
    // prev handler user
    app.use(function (req, res, next) {
        var _user = req.session.user;
        if (_user) {
            app.locals.user = _user;
        }
        next();
    });

    // index page
    app.get('/', function (req, res) {
        Movie.fetch(function (err, movies) {
            if (err) {
                console.log(err);
                res.json({
                    'error': 1,
                    'message': 'query movies err' + err
                });
            }
            res.render('index', {
                title: 'imooc 首页',
                movies: movies
            });
        });
    });

    //signup
    app.post('/user/signup', function (req, res) {
        var _user = req.body.user;
        var user = new User(_user);
        user.save(function (err, user) {
            if (err) {
                console.log('user signup err: ' + err);
                res.json({
                    'error': 1,
                    'message': 'user singup err ' + err
                });
            }
            res.redirect('/');
        });
    });

    //signin
    app.post('/user/signin', function (req, res) {
        var _user = req.body.user;
        var _name = _user.name;
        var _password = _user.password;
        User.findOne({
            name: _name
        }, function (err, user) {
            if (err) {
                console.log("user find name err : " + err);
                res.json({
                    'error': 1,
                    'message': 'find by username err:' + err
                });
            }
            if (!user) {
                console.log('user is not exist');
                return res.redirect('/');
            }

            user.comparePassword(_password, function (err, isMatch) {
                if (err) {
                    console.log(err);
                    res.json({
                        'code': 500,
                        'message': 'login error' + err
                    });
                }
                if (isMatch) {
                    console.log('password is matched');
                    req.session.user = user;

                } else {
                    console.log('password is not matched');
                }
                return res.redirect('/');
            });
        });
    });

    // logout
    app.get('/logout', function (req, res) {
        delete req.session.user;
        delete app.locals.user;
        res.redirect('/');
    });

    // list users page
    app.get('/admin/userlist', function (req, res) {
        User.fetch(function (err, users) {
            if (err) {
                console.log(err);
            }
            res.render('userlist', {
                title: 'imooc 用户列表页',
                users: users
            });
        });
    });

    // detail page
    app.get('/movie/:id', function (req, res) {
        var id = req.params.id;
        console.log("id = " + id);
        Movie.findById(id, function (err, movie) {
            //TO DO deal err
            if (err) {
                console.log(err);
            }
            res.render('detail', {
                title: 'imooc 详情页',
                movie: movie
            });
        });
    });

    // admin page
    app.get('/admin/movie', function (req, res) {
        res.render('admin', {
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

    //admin post movie
    app.post('/admin/movie/new', function (req, res) {
        var id = req.body.movie._id;
        var movieObj = req.body.movie;
        var _movie;
        if (id !== 'undefined') {
            Movie.findById(id, function (err, movie) {
                if (err) {
                    console.log(err);
                }
                _movie = _.assign(movie, movieObj);
                _movie.save(function (err, movie) {
                    if (err) {
                        console.log(err);
                    }
                    res.redirect('/movie/' + _movie._id);
                });
            });
        } else {
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
            _movie.save(function (err, movie) {
                console.log("save call back");
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            });
        }
    });

    //admin update movie
    app.get('/admin/update/:id', function (req, res) {
        var id = req.params.id;
        if (id) {
            Movie.findById(id, function (err, movie) {
                res.render('admin', {
                    title: 'imooc 后台录入页',
                    movie: movie
                });
            })
        }
    });

    //list delete movie
    app.delete('/admin/list', function (req, res) {
        var id = req.query.id;
        if (id) {
            Movie.remove({
                _id: id
            }, function (err, movie) {
                if (err) {
                    console('list delete movie err:' + err);
                } else {
                    res.json({
                        success: 1
                    });
                }
            });
        }
    })

    // list page
    app.get('/admin/list', function (req, res) {
        Movie.fetch(function (err, movies) {
            if (err) {
                console.log(err);
            }
            res.render('list', {
                title: 'imooc 列表页',
                movies: movies
            });
        });
    });
}