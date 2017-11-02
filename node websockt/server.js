var redis = require("redis");
var redis_config = {
    "host": "10.100.208.69",
    "port": 6379
};
client = redis.createClient(redis_config);//创建一个redis客户端
client.on('ready', function (req, res) {
    console.log('ready');
});
client.on("error", function (error) {
    console.log(error);
});



var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/', express.static('public'));
http.listen(8080);
//socket部分

var result = {
    info: ""
}
io.on('connection', function (socket) {
    //接收并处理客户端的hi事件
    socket.on('hi', function (data) {
        GET();
        function GET() {
            client.lpop("image", function (err, data) {
                if (data !== null) {
                    img = "data:image/jpeg;base64,";
                    result.info = "";
                    result.info = img + data;
                    socket.emit('c_hi', result)
                } else {
                    GET()
                }
            });
        }

        //触发客户端事件c_hi
        //socket.emit('c_hi','hello too!')
    })

    //断开事件
    socket.on('disconnect', function (data) {
        console.log('断开', data)
        socket.emit('c_leave', '离开');
    })

});

