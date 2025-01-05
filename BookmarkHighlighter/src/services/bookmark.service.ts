import {BookmarkNode} from "../interfaces/types";

export class BookmarkService {
    protected static instance: BookmarkService | null = null;

    protected constructor() {
    }

    static getInstance(): BookmarkService {
        if (!this.instance) {
            this.instance = new BookmarkService();
        }
        return this.instance;
    }

    protected async getBookmarkTree(): Promise<BookmarkNode[]> {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({action: "getBookmarks"}, (bookmarkTree) => {
                resolve(bookmarkTree);
            });
        });
    }

    protected findFolder(root: BookmarkNode, folderName: string): BookmarkNode | null {
        if (root.title === folderName) return root;
        if (root.children) {
            for (const child of root.children) {
                const found = this.findFolder(child, folderName);
                if (found) return found;
            }
        }
        return null;
    }
}
