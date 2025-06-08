export interface BookmarkNode extends chrome.bookmarks.BookmarkTreeNode {
    children?: BookmarkNode[];
}