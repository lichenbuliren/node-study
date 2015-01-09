/**
 * Created by heaven on 2015/1/9.
 */

var Photo = require('../models/Photo');
var path = require('path');
var fs = require('fs');
var join = path.join;

exports.list = function (req, res, next) {
    Photo.find({}, function (err, photos) {
        if (err) return next(err);
        res.render('photos/photos', {
            title: 'Photos',
            photos: photos
        });
    });
};

exports.form = function (req, res) {
    res.render('photos/upload', {
        title: 'Photo upload'
    });
};

exports.submit = function (dir) {
    return function (req, res, next) {

        var img = req.files.uploadFile;
        var name = req.body.photo.name || img.originalname;
        var path = join(dir,img.originalname);

        fs.rename(img.path, path, function (err) {
            if (err) return next(err);

            Photo.create({
                name: name,
                path: img.originalname
            }, function (err) {
                if (err) return next(err);
                res.redirect('/');
            })
        });
    }
};

exports.download = function(dir){
    return function(req,res,next){
        var id = req.params.id;
        Photo.findById(id,function(err,photo){
            if(err) return next(err);
            var path = join(dir,photo.path);
            var suffix = path.substring(path.indexOf('.'));
            res.download(path,photo.name + suffix);
        });
    }
};

