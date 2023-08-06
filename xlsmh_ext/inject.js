// 将全局变量chapterImages的值发送到内容脚本
window.postMessage({
    type: 'FROM_PAGE',
    text: JSON.stringify([
        chapterImages,
        nextChapterData.url
    ])
}, '*');
