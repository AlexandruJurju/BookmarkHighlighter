import {BookmarkNode} from "./types";

export class Bookmarks {
    private static instance: Bookmarks;
    private cache: BookmarkNode[] | null = null;
    private cacheTime = 0;
    private cacheDuration = 60000; // 1 minute

    static getInstance() {
        if (!this.instance) {
            this.instance = new Bookmarks();
        }
        return this.instance;
    }

        async getTree(): Promise<BookmarkNode[]> {
        const now = Date.now();

        if (this.cache && (now - this.cacheTime) < this.cacheDuration) {
            return this.cache;
        }

        const tree = await new Promise<BookmarkNode[]>((resolve, reject) => {
            chrome.runtime.sendMessage({ action: "getBookmarks" }, (tree: BookmarkNode[]) => {
                chrome.runtime.lastError ? reject(new Error(chrome.runtime.lastError.message)) : resolve(tree || []);
            });
        });

        this.cache = tree;
        this.cacheTime = now;
        return tree;
    }

    findFolder(root: BookmarkNode, name: string): BookmarkNode | null {
        if (!root) {
            return null;
        }
        if (root.title === name) {
            return root;
        }

        if (root.children) {
            for (const child of root.children) {
                const found = this.findFolder(child, name);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    }

    extractUrls(folder: BookmarkNode): string[] {
        const urls: string[] = [];
        const stack = [folder];

        while (stack.length) {
            const node = stack.pop()!;
            if (node.children) {
                stack.push(...node.children);
            } else if (node.url) {
                urls.push(node.url);
            }
        }
        return urls;
    }
}
