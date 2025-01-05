export interface GameCategories {
    early: string[];
    waiting: string[];
    normal: string[];
}

export interface ElementSelector {
    matches: (url: string) => boolean;
    getElements: () => HTMLElement[];
}

export interface BookmarkNode extends chrome.bookmarks.BookmarkTreeNode {
    children?: BookmarkNode[];
}