export interface GameCategories {
    early: string[];
    waiting: string[];
    normal: string[];
}

// element used to select which part of the page to be highlighted
export interface ElementSelector {
    matches: (url: string) => boolean;
    getElements: () => HTMLElement[];
}

// interface for the bookmark node of the bookmarks tree
export interface BookmarkNode extends chrome.bookmarks.BookmarkTreeNode {
    children?: BookmarkNode[];
}