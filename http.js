const fs = require("fs");
const express = require("express");
const webSocket = require("ws");
function createServer(port_ = 3000){

    // 서버 설정
    const app = express();
    app.use("/",express.static("./src"));
    const httpServer = app.listen(port_,()=>{
        console.log(`express app listen ${port_}`);
    });

    // 웹소켓 설정
    const sockets = [];
    const webSocketServer = new webSocket.Server({
        server:httpServer
    });
    
    webSocketServer.on("connection",(ws,req) => {
        sockets.push(ws);
        const originIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const ip = originIp.replace("::ffff:",""); // 접속한 IP

        ws.on("message",(msg)=>{
            console.log(msg);
            sockets.forEach((socket)=>{
                socket.send(`${msg}`);
            });
        });
    });
};
createServer(); // 호스팅용 서버