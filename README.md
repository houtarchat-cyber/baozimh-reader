# baozimh-reader

这个仓库包含了一个简洁的阅读器，可以从 [包子漫画（baozimh）](http://baozimh.com) 中获取图片并提供更好的阅读体验。

## 用途

- 可以从包子漫画网站中获取图片，并提供更好的阅读体验。
- 可以通过本地服务器和 WebSocket 通信实现图片的发送和跳转到下一话的命令。

## 原理

本软件包含三个文件：

- wsclient.js: 是一个用户脚本，向本地服务器使用WebSocket通信，发送的信息是页面中图片的URL，还可以接受跳转到下一话的命令；
- wsserver.js: 是一个NodeJS脚本，提供一个HTTP服务器和一个WebSocket服务器，可以接受用户脚本的信息，并与本地文件结合，提供给HTTP请求；也可以从HTTP接受命令，发送至用户脚本；
- wst.html: 是一个阅读器，包含图片加载、图片插入、智能判断是否加载完毕、向服务器发送下一话信号的功能。

## 用法

1. 下载并安装 Node.js，可以从 [官网](https://nodejs.org) 中获取。
2. 在命令行中进入到本软件的文件夹，并运行 `npm install` 命令，安装所需的依赖。
3. 运行 `node wsserver.js` 命令，启动 HTTP 和 WebSocket 服务器。
4. 使用用户脚本管理器，安装 wsclient.js 脚本。
5. 打开任意包子漫画的具体阅读页面（不是详情页），安装完用户脚本后，图片会自动加载。
6. 打开浏览器中的 localhost:8080，即可使用阅读器。

## 注意事项

- 请确保已经安装了 Node.js 和相关的用户脚本管理器。
- 使用阅读器时，请打开具体阅读页面，而不是漫画的详情页。
- 请在本地服务器和 WebSocket 服务器运行后，再打开浏览器并使用阅读器。
- 在使用阅读器时，可以通过点击“下一话”按钮，跳转到下一话。

## 其他

本软件使用 MIT license，可以在仓库中查看详细信息。

### 常见报错

- 服务器无法启动：
    - 请确认已经安装了 Node.js。
    - 请确认已经运行了 `npm install` 命令。
    - 请确认当前目录是否包含 wsserver.js 文件。
- 图片无法加载：
    - 请确认已经安装了用户脚本管理器。
    - 请确认已经添加了 wsclient.js 脚本。
    - 请确认已经打开了包子漫画的具体阅读页面。
    - 请确认已经启动了本地服务器和 WebSocket 服务器。
- 无法跳转到下一话：
    - 请确认已经安装了用户脚本管理器。
    - 请确认已经添加了 wsclient.js 脚本。
    - 请确认已经打开了包子漫画的具体阅读页面。
    - 请确认已经启动了本地服务器和 WebSocket 服务器。
    - 请确认已经在阅读器中点击了“下一话”按钮。

### 安装 Node.js

1. 打开 [官网](https://nodejs.org)，点击“Download”。
2. 选择适合自己操作系统的版本，下载并安装。
3. 在命令行中输入 `node -v`，确认 Node.js 已经成功安装。

### 安装用户脚本管理器

#### Chrome

1. 打开 [Chrome 扩展商店](https://chrome.google.com/webstore/category/extensions)，搜索“Tampermonkey”并安装。
2. 在 Tampermonkey 的控制面板中，点击“添加新脚本”，复制并粘贴 wsclient.js 脚本的内容。

#### Firefox

1. 打开 [Firefox 扩展商店](https://addons.mozilla.org/en-US/firefox/extensions/)，搜索“Greasemonkey”并安装。
2. 在 Greasemonkey 的控制面板中，点击“新建用户脚本”，复制并粘贴 wsclient.js 脚本的内容。

#### Safari

1. 打开 [Safari 扩展商店](https://safari-extensions.apple.com)，搜索“Tampermonkey”并安装。
2. 在 Tampermonkey 的控制面板中，点击“添加新脚本”，复制并粘贴 wsclient.js 脚本的内容。

#### Edge

1. 打开 [Edge 扩展商店](https://www.microsoft.com/store/apps/9NBLGGH5162S)，搜索“Tampermonkey”并安装。
2. 在 Tampermonkey 的控制面板中，点击“添加新脚本”，复制并粘贴 wsclient.js 脚本的内容。

#### 其它浏览器

1. 查找适合当前浏览器的用户脚本管理器。
2. 打开浏览器扩展商店，搜索用户脚本管理器，并安装。
3. 在用户脚本管理器的控制面板中，添加 wsclient.js 脚本。
