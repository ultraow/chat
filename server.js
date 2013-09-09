var http    = require('http'),
    io      = require('socket.io'),
    fs      = require('fs'),
    o       = require('util');
o.log('服务器启动中...');
var config = {
    port : 2012
}
//http = http.createServer(handler);
//http.listen(config.port);
io = io.listen(config.port);

//function handler(req, res) {
//    fs.readFile(__dirname+'/client.js',
//        function(err, data){
//            req.setEncoding(encoding="utf8");
//            res.writeHead(200);
//            res.end(data);
//        });
//}
var players = new Array();
var s = new Array();
var list = new Array();
var persons = 0;

io.sockets.on('connection',function(socket){
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
o.log('服务器已经启动!');
