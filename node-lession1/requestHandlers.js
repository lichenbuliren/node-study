/**
 * Created by heaven on 2014/12/31.
 */
var querystring = require('querystring'),
    fs = require('fs'),
    formidable = require('formidable'),
    path = require('path');

function start(request,response) {
    console.log('Request handler "start" was called.');
    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" ' +
        'content="text/html; charset=UTF-8" />' +
        '</head>' +
        '<body>' +
        '<form action="/upload" enctype="multipart/form-data" ' +
        'method="post">' +
        '<input type="file" name="upload">' +
        '<input type="submit" value="Upload file" />' +
        '</form>' +
        '</body>' +
        '</html>';
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(body);
    response.end();
}

function upload(request,response) {
    console.log('Request handler "upload" was called');
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname,'/tmp');
    console.log('about to parse');
    form.parse(request, function(error, fields, files) {
        console.log('parsing done');
        console.log(files);
        fs.renameSync(files.upload.path, './tmp/test.png');
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('received image:<br/>');
        response.write('<img src="/show" />');
        response.end();
    });
}

function show(request, response) {
    console.log('Request handler "show" was called.');

    fs.exists('./tmp/test.png', function (exists) {
        if (exists) {
            fs.createReadStream('./tmp/test.png').pipe(response);
        } else {
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.write(error + '\n');
            response.end();
        }
    });
}

exports.start = start;
exports.upload = upload;
exports.show = show;