document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('search-form').addEventListener('submit', function (event) {
        event.preventDefault();
        var keywords = document.getElementById('search-input').value;
        if (keywords) {
            chrome.tabs.create({ url: `https://www.xlsmh.com/search/?keywords=${encodeURIComponent(keywords)}` });
        }
    });
});