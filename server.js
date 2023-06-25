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
    if (request.method === 'OPTIONS') {
        response.writeHead(204, {
            'Access-Control-Allow-Methods': 'OPTIONS, GET',
            'Access-Control-Max-Age': 2592000, // 30 days
        });
        response.end();
        return;
    }
    if (request.url === '/favicon.ico') {
        response.writeHead(200, {
            'Content-Type': 'image/x-icon',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, GET',
            'Access-Control-Max-Age': 2592000, // 30 days
        });
        response.end();
        return;
    }
    console.log('Received request from client: ', request.url);
    if (request.url === '/refresh-userscript') {
        // 向所有连接到 WebSocket 服务器的用户脚本发送刷新消息
        websocketServer.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('refresh');
            }
        });
        // 响应请求
        response.writeHead(200, {
            'Content-Type': 'text/plain;charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, GET',
            'Access-Control-Max-Age': 2592000, // 30 days
        });
        response.end('用户脚本已刷新');
        return;
    }
    if (request.url === '/execute') {
        websocketServer.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('goto');
            }
        });
        response.writeHead(200, {
            'Content-Type': 'text/plain;charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, GET',
            'Access-Control-Max-Age': 2592000, // 30 days
        });
        response.end('代码已执行');
        return;
    }
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
        response.writeHead(200, {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, GET',
            'Access-Control-Max-Age': 2592000, // 30 days
        });

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
        } else if (responseText[0] === '504') {
            throw new Error(responseText[1]);
        } else {
            throw new Error(`未知的源：${responseText[0]}\n` +
                '请检查源是否已经被支持\n或者联系开发者\n\n' +
                '支持的源：\nbaozimh\nxlsmh');
        }
        response.end(text);
    } catch (err) {
        // 设置响应头
        response.writeHead(500, {
            'Content-Type': 'text/html;charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, GET',
            'Access-Control-Max-Age': 2592000, // 30 days
        });

        // 返回响应
        const text = `
            <button id="refresh-page">刷新本地网页</button>
            <button id="refresh-userscript">刷新用户脚本</button>
            <script>
                // 获取按钮元素
                const refreshPageButton = document.getElementById('refresh-page');
                const refreshUserscriptButton = document.getElementById('refresh-userscript');
            
                // 为按钮绑定事件处理函数
                refreshPageButton.addEventListener('click', () => {
                    // 刷新本地网页
                    window.location.reload();
                });
            
                refreshUserscriptButton.addEventListener('click', () => {
                    // 向服务器发送刷新用户脚本的请求
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', '/refresh-userscript');
                    xhr.send();
                    xhr.onload = () => {
                        if (xhr.responseText === '用户脚本已刷新') {
                            document.write('<h1>用户脚本已刷新</h1>');
                        }
                    }
                });
            </script>
        `;
        response.end(`服务器内部错误：${err.message}<br><br>${text}`);
    }
});


// 监听 8080 端口
httpServer.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
