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
                    function: () => {
                        const regex = /0_\d+/;
                        const execResult = regex.exec(window.location.href);

                        // 取出匹配到的字符串中 "_" 后面的数字
                        const oldHrefPart = execResult[0];
                        const oldHrefSuffix = oldHrefPart.split("_")[1];

                        // 用新的数字替换原来的数字
                        const newHrefSuffix = parseInt(oldHrefSuffix) + 1;
                        window.location.href = window.location.href
                            .replace(oldHrefPart, `0_${newHrefSuffix}`);
                    },
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

        // 向服务器发送消息
        ws.send(JSON.stringify([
            'baozimh',
            arg[0],
            arg[1],
        ]));
    }
);