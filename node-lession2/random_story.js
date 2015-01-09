var fs = require('fs');

var request = require('request');

var htmlparser = require('htmlparser');

var configFilename = './rss_feeds.txt';

var tasks = [
    checkForRSSFile,
    readRSSFile,
    downloadRSSFeed,
    parseRSSFeed
];

function next(err,result){
    if(err) throw err;

    var currentTask = tasks.shift();
    if(currentTask){
        currentTask(result);
    }
}

//检查RSS预定源URL列表的存在
function checkForRSSFile(){
    fs.exists(configFilename, function (exists) {
        if(!exists){
            return next(new Error('Missing RSS file: ' + configFilename));
        }

        next(null,configFilename);
    });
}

//读取并解析包含预定源URL的文件
function readRSSFile(configFilename){
    fs.readFile(configFilename, function (err, feedList) {
        if(err) return next(err);

        feedList = feedList.toString().replace(/^\s+|\s+$/g,'').split('\n');

        var random = Math.floor(Math.random()*feedList.length);
        next(null,feedList[random]);
    })
}

//向选定的预定源发送HTTP请求以获取数据
function downloadRSSFeed(feedUrl){
    console.log(feedUrl);
    request({uri: feedUrl}, function (err, res, body) {
        if(err) return next(err);
        if(res.statusCode != 200){
            return next(new Error('Abnormal response status code'));
        }
        next(null,body);
    });
}

//将预定源数据解析到一个条目数组中
function parseRSSFeed(rss){
    var handler = new htmlparser.RssHandler();
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(rss);

    if(!handler.dom.items.length){
        return next(new Error('No RSS items found'));
    }

    var item = handler.dom.items.shift();
    console.log(item.title);
    console.log(item.link);
}

next();