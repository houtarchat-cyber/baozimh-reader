const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

// 创建 HTTP 服务器
const httpServer = http.createServer();

// 创建 WebSocket 服务器
const websocketServer = new WebSocket.Server({ server: httpServer });

// 响应文本
// 读取文件
let responseText, file, pack1, pack2;

// 当客户端连接到 WebSocket 服务器时触发
websocketServer.on('connection', ws => {
    console.log('WebSocket connection established');

    // 当客户端发送消息给 WebSocket 服务器时触发
    ws.on('message', message => {
        responseText = JSON.parse(message.toString());
        console.log('Received message from client: ', responseText[1]);
        ws.send('connected');
    });
});

// 当 HTTP 服务器接收到请求时触发
httpServer.on('request', async (request, response) => {
    if (request.url === '/favicon.ico') {
        response.writeHead(200, { 'Content-Type': 'image/x-icon' });
        response.end();
        return;
    }
    console.log('Received request from client: ', request.url);
    if (request.url === '/execute') {
        websocketServer.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('goto');
            }
        });
        response.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
        response.end('代码已执行');
    } else {
        try {
            if (!responseText) {
                throw new Error('用户脚本未连接');
            }

            if (!file) {
                file = (await fs.promises.readFile('general.html')).toString();
            }
            if (!pack1) {
                pack1 = (await fs.promises.readFile('pack_baozimh.html')).toString();
            }
            if (!pack2) {
                pack2 = (await fs.promises.readFile('pack_xlsmh.html')).toString();
            }

            // 设置响应头
            response.writeHead(200, { 'Content-Type': 'text/html' });

            // 替换响应内容中的变量
            // 返回响应
            let text = file.replace('Manga Reader', responseText[1]);
            if (responseText[0] === 'baozimh') {
                text = text.replace('$pack', pack1)
                    .replaceAll('$resText', responseText[2]);
            } else if (responseText[0] === 'xlsmh') {
                text = text.replace('$pack', pack2)
                    .replace('$resText',
                        JSON.stringify(responseText[2])
                    );
            } else {
                throw new Error(`未知的源：${responseText[0]}\n` +
                    '请检查源是否已经被支持\n或者联系开发者\n\n' +
                    '支持的源：\nbaozimh\nxlsmh');
            }
            response.end(text);
        } catch (err) {
            // 设置响应头
            response.writeHead(500, { 'Content-Type': 'text/plain;charset=utf-8' });

            // 返回响应
            response.end(`服务器内部错误：${err.message}`);
        }
    }
});


// 监听 8080 端口
httpServer.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
