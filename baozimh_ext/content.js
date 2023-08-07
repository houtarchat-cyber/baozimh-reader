(async () => {
    do {
        imgElement = document.querySelector('#chapter-img-0-0');
        // 使用 await 来阻塞线程，每次循环等待 0.2 秒钟
        await new Promise(resolve => setTimeout(resolve, 200));
    } while (imgElement === null);
    // 获取到 imgElement 后，处理这个元素
    return imgElement.getAttribute('src');
})().then((imgSrc) => {
    chrome.runtime.sendMessage([
        'baozimh',
        document.title.slice(0, -7),
        imgSrc.substring(0, imgSrc.lastIndexOf('/') + 1)
    ]);
});