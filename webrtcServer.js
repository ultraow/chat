/**
 * Created by Ultra on 2014/7/9.
 */
var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    o  = require('util'),
    server;

server = http.createServer(function(req, res){
    req.setEncoding(encoding="utf8");
    var path = url.parse(req.url).pathname;
    o.log(path);   //显示用户打开扫描页面

    if(path == '/') path = '/index.html';

    fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path.substr(path.length - 2) == 'js' ? 'text/javascript, charset=UTF-8' : 'text/html, charset=UTF-8'});
        res.write(data, 'utf8');
        res.end();
    });
});

send404 = function(res){
    res.writeHead(404);
    res.write('404 Not Found');
    res.end();
};

server.listen(8080);

var webRTC = require('webrtc.io').listen(server),
    o  = require('util');

o.log('视频服务器已经启动，开始监听80端口!');