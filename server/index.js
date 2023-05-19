// 引入 WebSocket 模块
const WebSocket = require('ws');
var user = 0;

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ port: 8080 });
const clients = new Set();

// 监听连接事件
wss.on('connection', (ws) => {
  // 处理新连接
  console.log('新连接已建立');
  user++;
  clients.add(ws);

  ws.nickname = `id${user}`
  ws.fd = `id${user}`
  var mes = {};
  mes.type = "enter";
  mes.data = `${ws.nickname} 进来啦`;
  broadcast(JSON.stringify(mes))

  // 监听消息事件
  ws.on('message', (message) => {
    console.log('接收到消息：', message.toString());
    mes.type = "message";
    let txt = message.toString();
    mes.data = `${ws.nickname}说：  ${txt}`

    // 发送消息给客户端
    // ws.send('服务器收到消息：' + message);
    broadcast(JSON.stringify(mes))
  });

  // 监听关闭事件
  ws.on('close', () => {
    console.log('连接已关闭');
    mes.type = "leave";
    mes.data = `${ws.nickname} 离开了`

    // 发送消息给客户端
    // ws.send('服务器收到消息：' + message);
    clients.delete(ws);

    broadcast(JSON.stringify(mes))
  });
});

function broadcast (str) {
    console.log(1111)
    for (const client of clients) {
        client.send(str)
    }
}
