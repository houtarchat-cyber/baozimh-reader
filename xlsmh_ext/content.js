const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.js');
(document.head || document.documentElement).appendChild(script);
script.onload = () => script.remove();

window.addEventListener('message', function (event) {
    // 只接受来自当前页面的消息
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == 'FROM_PAGE')) {
        chrome.runtime.sendMessage([
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
            document.title,
            // 将字符串转换回JavaScript对象
            JSON.parse(event.data.text),
            document.querySelector("#cf-error-details"),
        ]);
    }
}, false);
