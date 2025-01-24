// used just to get the bookmarks from the browser
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getBookmarks") {
        chrome.bookmarks.getTree((bookmarkTree) => {
            sendResponse(bookmarkTree);
        });
        return true;
    }
});
