import {Bookmarks} from "../infrastructure/bookmarks";
import {addStyles, normalize, startPolling} from "../infrastructure/utils";
import {BookmarkNode} from "../infrastructure/types";

interface GameCategories {
    owned: string[];
    earlyAccess: string[];
    wishlist: string[];
}

export class Games {
    private games: GameCategories | null = null;
    private bookmarks = Bookmarks.getInstance();

    async init() {
        if (!this.matches()) {
            return;
        }

        addStyles(`
            .game-tag { font-size: 16px; color: white; padding: 2px 5px; border-radius: 3px; }
            .game-owned { background-color: #008000; }
            .game-early { background-color: #1034A6; }
            .game-wishlist { background-color: #666666; }
        `);

        this.games = await this.loadGames();
        startPolling(() => this.highlight(), 5000);
    }

    private matches(): boolean {
        const url = location.href;
        return url.includes('store.steampowered.com/search/') ||
            /steamdb\.info\/stats\/gameratings/i.test(url);
    }

    private async loadGames(): Promise<GameCategories> {
        const tree = await this.bookmarks.getTree();
        const gamesFolder = this.bookmarks.findFolder(tree[0], "Games");
        if (!gamesFolder) {
            return {owned: [], earlyAccess: [], wishlist: []};
        }

        const categories: GameCategories = {owned: [], earlyAccess: [], wishlist: []};

        const processFolder = (folder: BookmarkNode) => {
            if (!folder.children) {
                return;
            }

            for (const item of folder.children) {
                if (item.url?.includes('store.steampowered.com/app/')) {
                    const match = item.url.match(/\/app\/\d+\/(.*?)\//);
                    if (match) {
                        const name = normalize(match[1].replace(/_/g, ' '));
                        const folderName = folder.title.toLowerCase();

                        if (folderName === 'gearly') {
                            categories.earlyAccess.push(name);
                        } else if (folderName === 'gwaiting') {
                            categories.wishlist.push(name);
                        } else if (folderName === 'gdenuvo') {
                            categories.wishlist.push(name);
                        } else if (folderName === 'WaitForImprovements') {
                            categories.wishlist.push(name);
                        } else {
                            categories.owned.push(name);
                        }
                    }
                } else if (item.children) {
                    processFolder(item);
                }
            }
        };

        processFolder(gamesFolder);
        return categories;
    }

    private highlight() {
        if (!this.games) return;

        const elements = this.getElements();

        for (const el of elements) {
            const name = normalize(el.textContent || '');
            el.classList.add('game-tag');

            if (this.games.owned.includes(name)) {
                el.classList.add('game-owned');
            } else if (this.games.earlyAccess.includes(name)) {
                el.classList.add('game-early');
            } else if (this.games.wishlist.includes(name)) {
                el.classList.add('game-wishlist');
            }
        }
    }

    private getElements(): HTMLElement[] {
        const url = location.href;

        if (url.includes('store.steampowered.com/search/')) {
            return Array.from(document.getElementsByClassName('title')) as HTMLElement[];
        }
        if (/steamdb\.info\/stats\/gameratings/i.test(url)) {
            return Array.from(document.getElementsByClassName('b')) as HTMLElement[];
        }
        return [];
    }
}
