// ==UserScript==
// @name         Xlsmh Ext++ with WebSocket
// @namespace    https://xlsmh.houtar.eu.org/ws-ext++
// @version      0.4
// @description  Provide codes of a manga reader.
// @author       Houtar
// @match        *://*.xlsmh.com/manhua/*/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xlsmh.com
// @license      GNU GPLv3
// ==/UserScript==

(async function () {
    'use strict';

    // 等待WebSocket连接成功
    const ws = new WebSocket('ws://localhost:8080');
    // 向服务器发送消息
    ws.onopen = () => ws.send(JSON.stringify([
        'xlsmh',
        document.querySelector("body > h1").innerText
            .split(' ').slice(1, -1)
            .concat('-',
                document.querySelector("body > h1")
                    .innerText.split(' ')[0]
            ).join(' ')
            // 先将“话”字全部替换为“回”
            .replace(/话/g, '回')
            // 再将符合“...回”的字符串替换为“...话”
            .replace(/[一二三四五六七八九十百千万亿\d]+回/g, (match) => {
                return match.replace('回', '话');
            }),
        chapterImages
    ]));

    // 接收服务器的响应消息
    ws.onmessage = event => {
        if (event.data === 'goto') {
            // 跳转至下一章
            window.location.href = nextChapterData.url;
        } else if (event.data === 'refresh') {
            // 刷新网页
            window.location.reload();
        }
    }

    // 监听服务器断开连接事件
    ws.onclose = () => window.alert('Server connection closed.');

    // 监听错误事件
    ws.onerror = error => window.alert(`Error occurred: ${error.message}`);

    if (document.title === '504 Gateway Time-out' ||
        document.title === 'www.xlsmh.com | 504: Gateway time-out' ||
        document.querySelector("#cf-error-details")) {
        // 向服务器发送信息
        ws.onopen = () => ws.send(JSON.stringify([
            '504',
            document.title
        ]));
    }
})();
