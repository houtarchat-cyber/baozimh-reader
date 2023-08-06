'use strict';

let ws;

chrome.runtime.onMessage.addListener(
    async function (arg, sender) {
        // 创建 WebSocket 连接
        ws ??= new WebSocket('ws://localhost:8080');

        // 监听错误事件
        ws.onerror = error => chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            function: (args) => window.alert(args),
            args: [`Error occurred: ${error.message ?? 'Unknown error.'}`],
        });

        // 监听服务器断开连接事件
        ws.onclose = () => chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            function: () => window.alert('Server connection closed.'),
        }).then(() => ws = null);

        // 接收服务器的响应消息
        ws.onmessage = event => {
            if (event.data === 'goto') {
                // 跳转至下一章
                chrome.scripting.executeScript({
                    target: { tabId: sender.tab.id },
                    function: (url) => window.location.href = url,
                    args: [arg[2][1]],
                });
            } else if (event.data === 'refresh') {
                // 刷新网页
                chrome.scripting.executeScript({
                    target: { tabId: sender.tab.id },
                    function: () => window.location.reload(),
                });
            }
        };

        // 等待 WebSocket 连接成功
        if (ws.readyState !== WebSocket.OPEN) {
            await new Promise(resolve => {
                ws.addEventListener('open', resolve, { once: true });
            });
        }

        if (arg[1] === '504 Gateway Time-out' ||
            arg[1] === 'www.xlsmh.com | 504: Gateway time-out' ||
            arg[3]) {
            // 向服务器发送信息
            ws.send(JSON.stringify([
                '504',
                arg[1],
            ]));
            return;
        }

        // 向服务器发送消息
        ws.send(JSON.stringify([
            'xlsmh',
            arg[0],
            arg[2][0],
        ]));
    }
);