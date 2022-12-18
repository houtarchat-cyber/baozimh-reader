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

    // let imgElement = document.querySelector('#chapter-img-0-0');
    // // 如果 imgElement 为 null，则循环获取这个元素，直到获取到为止
    // while (imgElement === null) {
    //     imgElement = document.querySelector('#chapter-img-0-0');
    //     // 使用 await 来阻塞线程，每次循环等待 0.2 秒钟
    //     await new Promise(resolve => setTimeout(resolve, 200));
    // }
    // 获取到 imgElement 后，处理这个元素
    // const imgSrc = Array.prototype.map.call(
    //     document.querySelectorAll('#images > img'),
    //     e => e.src);


    // 等待WebSocket连接成功
    const ws = new WebSocket('ws://localhost:8080');
    // 向服务器发送消息
    ws.onopen = () => ws.send(JSON.stringify([
        document.querySelector("body > h1").innerText
            .split(' ').slice(1, -1)
            .concat('-',
                document.querySelector("body > h1")
                    .innerText.split(' ')[0]
            ).join(' '),
        chapterImages
    ]))

    // 接收服务器的响应消息
    ws.onmessage = event => {
        if (event.data === 'goto') {
            // 跳转至下一章
            // 使用这个正则表达式搜索 URL，并获取匹配到的部分
            // const regex = /0_\d+/;
            // const execResult = regex.exec(window.location.href);

            // // 取出匹配到的字符串中 "_" 后面的数字
            // const oldHrefPart = execResult[0];
            // const oldHrefSuffix = oldHrefPart.split("_")[1];

            // // 用新的数字替换原来的数字
            // const newHrefSuffix = parseInt(oldHrefSuffix) + 1;
            // const newHref = window.location.href.replace(oldHrefPart, `0_${newHrefSuffix}`);
            window.location.href = nextChapterData.url;
        }
    }

    // 监听服务器断开连接事件
    ws.onclose = () => window.alert('Server connection closed.')

    // 监听错误事件
    ws.onerror = error => window.alert(`Error occurred: ${error.message}`)
})();
