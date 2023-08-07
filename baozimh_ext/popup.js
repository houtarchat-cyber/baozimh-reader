document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('search-form').addEventListener('submit', function (event) {
        event.preventDefault();
        var query = document.getElementById('search-input').value;
        if (query) {
            chrome.tabs.create({ url: `https://cn.baozimh.com/search?q=${encodeURIComponent(query)}` });
        }
    });
});