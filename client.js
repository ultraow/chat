/**
 * Created with JetBrains PhpStorm.
 * User: Ultra
 * Date: 13-1-24
 * Time: 上午11:17
 * To change this template use File | Settings | File Templates.
 */

$(function() {
    $('div.left ul li:last').css('border', 'none');
    $.getScript("socket.io/socket.io.js",
        function() {

        }
    );
});

var chat = function(name, avatar, ip, myip) {
    var socket = io.connect(ip);
    var spantimer = new Array();
    socket.on('message', function(msg) {
        var t = new Date(msg.timer);
        var span = $('<b />').text((t.getMonth() + 1) + '月' + t.getDate() + '日');
        //alert(spantimer[msg.tid]);
        if(spantimer[msg.tid]  != span.text()) {
            $('ul.chatroom li#' + msg.tid + ' div.message ul.msg').append(span);
            spantimer[msg.tid]  = span.text();
        }
        var li = $('<li />').addClass('own').html('<img src="' + msg.avatar + '" /><div class="tweet">' + msg.msg + '</div><span class="timer">' + t.getHours() + ':' + t.getMinutes() + '</span><br />').hover(
            function() {
                $(this).find('span.timer').show();
            },
            function() {
                $(this).find('span.timer').hide();
            }
        );
        $('ul.chatroom li#' + msg.tid + ' div.message ul.msg').append(li).animate({scrollTop:'+='+(li.height()+100)},200);
    });

    socket.on('messageTo', function(msg) {
        var cunzai = false;
        $('ul.chatroom li').each(
            function() {
                if($(this).attr('id') == msg.socketid) cunzai = true;
            }
        );
        if(!cunzai) {
            addchat(msg.socketid, msg.lid, msg.avatar);
        }
        var t = new Date(msg.timer);
        var span = $('<b />').text((t.getMonth() + 1) + '月' + t.getDate() + '日');
        if(spantimer[msg.socketid]  != span.text()) {
            $('ul.chatroom li#' + msg.socketid + ' div.message ul.msg').append(span);
            spantimer[msg.socketid] = span.text();
        }
        var li = $('<li />').addClass('player').html('<img src="' + msg.avatar + '" /><div class="tweet">' + msg.msg + '</div><span class="timer">' + t.getHours() + ':' + t.getMinutes() + '</span><br />').hover(
            function() {
                $(this).find('span.timer').show();
            },
            function() {
                $(this).find('span.timer').hide();
            }
        );
        $('ul.chatroom li#' + msg.socketid + ' div.message ul.msg').append(li).animate({scrollTop:'+='+(li.height()+100)}, 200);
    });

    socket.on('change', function(socketid) {
        $('ul.chatroom li#' + socketid).remove();
        $('ul.list li#' + socketid).remove();
    });

    socket.on('loginIn', function(user) {
        addplayer(user.id, user.name, user.avatar);
    });

    socket.on('getplayers', function(users) {
        for(var i = 0; i < users.length; i++) {
            addplayer(users[i].id, users[i].name, users[i].avatar);
        }
    });

    this.name = name;
    this.avatar = avatar;

    socket.emit('login', {
        name : this.name,
        avatar : this.avatar
    });


    var win = $('<div />').addClass('chat').attr('id', 'chat');
    var ctitle = $('<h1 />').addClass('title').text('即时聊天').click(function(e) {
        var cm = $(this).parent();
        if(cm.hasClass('on')) {
            cm.removeClass('on');
        }else{
            cm.addClass('on');
        }
    }).hover(
        function() {
            $(this).addClass('hover');
        },
        function() {
            $(this).removeClass('hover');
        }
    );
    var cbody = $('<div />').addClass('mian');
    var closing = $('<a />').addClass('close').text('×').click(function(e) {
        $(this).parent().parent().removeClass('on').css('top', 'auto').css('left', 'auto');
    });
    var list = $('<ul />').addClass('list');
    var chatroom = $('<ul />').addClass('chatroom').attr('valign','bottom');
    var user = $('<div />').addClass('user').append('<h1>' + this.name + '</h1><img src="' + this.avatar + '" />');

    function addplayer(socketid, player, avatar) {
        var one = $('<li />').attr('id', socketid).hover(
            function() {
                $(this).addClass('hover');
            },
            function() {
                $(this).removeClass('hover');
            }
        ).click(
            function(e) {
                //$(this).parent().find('li').removeClass('on');
                //$(this).addClass('on');
                var cunzai = false;
                $('ul.chatroom li').each(
                    function(e) {
                        if($(this).attr('id') == socketid) cunzai = true;
                    }
                );
                if(!cunzai) {
                    addchat(socketid, player, avatar);
                }

            }
        );
        var img = $('<img />').attr('src', avatar);
        var name = $('<h2 />').text(player);
//                message.append(input).append(to).append(by);
        one.append(img).append(name).appendTo(list); //.append(message);
    }

    function addchat(id, player, avatar) {
        var one = $('<li />').attr('id', id).hover(
            function() {
                $(this).addClass('hover');
            },
            function() {
                $(this).removeClass('hover');
            }
        ).click(
            function(e) {
                $(this).addClass('on');
            }
        );
        var message = $('<div />').addClass('message').append('<ul class="msg"></ul> ');
        var input = $('<input />').attr('name', 'msg').keypress(function(e) {
            by.text($(this).val().length + '/140 「ENTER」 发送');
            if($(this).val() != '') {
                to.hide();
            }else{
                to.show();
            }
        }).keydown(function(e) {
                by.text($(this).val().length + '/140 「ENTER」 发送');
                if($(this).val() != '') {
                    to.hide();
                }else{
                    to.show();
                }
                if(e.keyCode == 13) {
                    if($(this).val() != '') {
                        socket.emit('msg', {
                            tid   : id,
                            msg  : $(this).val(),
                            ip : myip,
                            timer : 0
                        });
                        $(this).val('');
                        to.show();
                    }
                    return false;
                }
            }).keyup(function(e) {
                by.text($(this).val().length + '/140 「ENTER」 发送');
                if($(this).val() != '') {
                    to.hide();
                }else{
                    to.show();
                }
            }).focus(function(e) {
                to.addClass('on');
            }).blur(function(e) {
                to.removeClass('on');
            });

        var to = $('<span />').addClass('to').text('to ' + player).click(function(e) {
            input.focus();
        });
        var by = $('<span />').addClass('by').text('0/140 「ENTER」 发送');

        var img = $('<img />').attr('src', avatar);
        var close = $('<a class="close" />').click(
            function() {
                spantimer[$(this).parent().parent().attr('id')] = '';
                //alert($(this).parent().parent().attr('id'));
                $(this).parent().parent().remove();
            }
        );
        var name = $('<h2 />').text(player).click(
            function() {
                if(!$(this).parent().hasClass('hide')) {
                    $(this).parent().addClass('hide').find('.message').hide();
                }else{
                    $(this).parent().removeClass('hide').find('.message').show();
                }
            }
        ).hover(
            function() {
                $(this).addClass('hover').find('a.close').show();
            },
            function() {
                if($(this).parent().hasClass('hide')) $(this).removeClass('hover').find('a.close').hide();
            }
        ).append(close);

        message.append(input); //.append(to).append(by);
        one.append(name).append(message).appendTo(chatroom); //.append(message);.append(img)
    }

    cbody.append(ctitle).append(list);//.append(user); //.append(closing)
    win.append(cbody).append('<span class="author"><a href="http://www.own.cm">Own</a></span>').appendTo('body');
    chatroom.appendTo('body');
}