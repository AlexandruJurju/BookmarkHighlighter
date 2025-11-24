chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getBookmarks") {
        chrome.bookmarks.getTree(sendResponse);
        return true;
    }
});