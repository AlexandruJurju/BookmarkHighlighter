import {IBookmarkManager} from "../interfaces/IBookmarkManager";
import {BookmarkNode} from "../interfaces/BookmarkNode";

export class ChromeBookmarkManager implements IBookmarkManager {
    private static instance: ChromeBookmarkManager;

    private constructor() {}

    public static getInstance(): ChromeBookmarkManager {
        if (!ChromeBookmarkManager.instance) {
            ChromeBookmarkManager.instance = new ChromeBookmarkManager();
        }
        return ChromeBookmarkManager.instance;
    }

    async getBookmarkTree(): Promise<BookmarkNode[]> {
        return new Promise((resolve, reject) => {
            try {
                chrome.runtime.sendMessage(
                    { action: "getBookmarks" },
                    (bookmarkTree: BookmarkNode[]) => {
                        if (chrome.runtime.lastError) {
                            reject(new Error(chrome.runtime.lastError.message));
                            return;
                        }
                        resolve(bookmarkTree || []);
                    }
                );
            } catch (error) {
                reject(new Error("Failed to retrieve bookmarks"));
            }
        });
    }

    findFolder(root: BookmarkNode, folderName: string): BookmarkNode | null {
        if (!root || !folderName) return null;

        if (root.title === folderName) {
            return root;
        }

        if (root.children?.length) {
            for (const child of root.children) {
                const found = this.findFolder(child, folderName);
                if (found) {
                    return found;
                }
            }
        }

        return null;
    }

    extractUrlsFromFolder(folder: BookmarkNode): string[] {
        const urls: string[] = [];

        if (!folder) return urls;

        const stack: BookmarkNode[] = [folder];

        while (stack.length > 0) {
            const node = stack.pop()!;

            if (node.children?.length) {
                stack.push(...node.children);
            } else if (node.url) {
                urls.push(node.url);
            }
        }

        return urls;
    }
}