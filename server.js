/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-9-10
 * Time: 下午8:40
 * To change this template use File | Settings | File Templates.
 */
var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    o  = require('util'),
    server;

server = http.createServer(function(req, res){
    // your normal server code
    var path = url.parse(req.url).pathname;
    o.log(path);
    switch (path){
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<h1>点这里>>><a href="/index.html">聊天</a><<<</h1>');
            res.end();
            break;
        case '/chat.html':
            fs.readFile(__dirname + path, function(err, data){
                if (err) return send404(res);
                res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
                res.write(data, 'utf8');
                res.end();
            });
            break;
        case '/chat.js':
            fs.readFile(__dirname + path, function(err, data){
                if (err) return send404(res);
                res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/javascript'})
                res.write(data, 'utf8');
                res.end();
            });
            break;
        default: send404(res);
    }
}),

    send404 = function(res){
        res.writeHead(404);
        res.write('404');
        res.end();
    };

server.listen(80);

var players = new Array();
var s = new Array();
var list = new Array();
var persons = 0;

var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){
    socket.on('msg',function(data){
        try
        {
            o.log(players[socket.id].name + ' to ' + players[data.tid].name + ' : ' + data.msg);
            data.timer = (new Date()).getTime();
            var d = data;
            d.socketid = players[socket.id].name;
            d.avatar = players[socket.id].avatar;
            socket.emit('message', d);
            var d = data;
            d.id = players[data.tid].name;
            d.lid = players[socket.id].name;
            d.socketid = socket.id;
            d.avatar = players[socket.id].avatar;
            s[data.tid].emit('messageTo', d);
        }catch(e){}
    });
    socket.on('login',function(user) {
        try
        {
            //persons++;

            //o.log(persons);
            o.log('正在发送用户列表给新用户...');
            socket.emit('getplayers', list);
            o.log('用户列表发送完成!');
            players[socket.id] = user;
            s[socket.id] = socket;
            socket.emit('login', socket.id);
            user.id = socket.id;
            list.push(user);
            socket.broadcast.emit('loginIn', user);
            o.log('用户 ' + user.name + ' 登录了！当前在线人数：' + String(list.length));
        }catch(e){}
    });
    socket.on('disconnect', function(){
        try
        {
            //persons--;

            //o.log(persons);
            players.splice(socket.id, 1);
            s.splice(socket.id, 1);
            for(var i=0; i < list.length; i++) {
                if(list[i].id == socket.id) {
                    list.splice(i, 1);
                }
            }
            socket.broadcast.emit('change', socket.id);
            o.log('用户 ' + players[socket.id].name + ' 退出了! 当前在线人数：' + String(list.length));
        }catch(e){}
    });
});