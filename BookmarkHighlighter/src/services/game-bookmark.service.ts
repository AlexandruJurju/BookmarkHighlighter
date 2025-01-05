import {BookmarkService} from "./bookmark.service";
import {BookmarkNode, GameCategories} from "../interfaces/types";

export class GameBookmarkService extends BookmarkService {
    static getInstance(): GameBookmarkService {
        if (!GameBookmarkService.instance) {
            GameBookmarkService.instance = new GameBookmarkService();
        }
        return GameBookmarkService.instance as GameBookmarkService;
    }

    protected constructor() {
        super();
    }

    async getGameCategories(): Promise<GameCategories> {
        const bookmarkTree = await this.getBookmarkTree();
        const gamesFolder = this.findFolder(bookmarkTree[0], "Games");

        if (!gamesFolder) {
            return { early: [], waiting: [], normal: [] };
        }

        return this.categorizeGames(gamesFolder);
    }

    private categorizeGames(gamesFolder: BookmarkNode): GameCategories {
        const categories: GameCategories = {
            early: [],
            waiting: [],
            normal: []
        };

        this.processGamesFolder(gamesFolder, categories);
        return categories;
    }

    private processGamesFolder(folder: BookmarkNode, categories: GameCategories): void {
        if (!folder.children) return;

        for (const item of folder.children) {
            if (item.url?.includes('store.steampowered.com/app/')) {
                const gameName = this.extractGameName(item.url);
                if (!gameName) continue;

                switch (folder.title.toLowerCase()) {
                    case 'gearly':
                        categories.early.push(gameName);
                        break;
                    case 'gwaiting':
                        categories.waiting.push(gameName);
                        break;
                    default:
                        categories.normal.push(gameName);
                        break;
                }
            } else if (item.children) {
                this.processGamesFolder(item, categories);
            }
        }
    }

    private extractGameName(url: string): string {
        const match = url.match(/\/app\/\d+\/(.*?)\//);
        return match ? this.normalizeGameName(match[1]) : '';
    }

    private normalizeGameName(gameName: string): string {
        return gameName.replace(/_/g, ' ').toLowerCase().trim();
    }
}