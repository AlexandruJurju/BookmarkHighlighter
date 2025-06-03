import {BookmarkNode} from "../interfaces/types";

export class BookmarkManager {
    static async getBookmarkTree(): Promise<BookmarkNode[]> {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({action: "getBookmarks"}, (bookmarkTree) => {
                resolve(bookmarkTree);
            });
        });
    }

    static findFolder(root: BookmarkNode, folderName: string): BookmarkNode | null {
        if (root.title === folderName) {
            return root
        }


        if (root.children) {
            for (const child of root.children) {
                const found = BookmarkManager.findFolder(child, folderName);
                if (found) {
                    return found
                }
            }
        }
        return null;
    }

    static extractModUrls(folder: BookmarkNode): string[] {
        const urls: string[] = [];

        const processNode = (node: BookmarkNode) => {
            if (node.children) {
                node.children.forEach(processNode);
            } else if (node.url) {
                urls.push(node.url);
            }
        };

        processNode(folder);
        return urls;
    }
}
