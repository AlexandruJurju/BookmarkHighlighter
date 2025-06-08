import {BaseHighlightingStrategy} from "./base-highlighting";
import {IBookmarkManager} from "../../interfaces/IBookmarkManager";
import {BookmarkNode} from "../../interfaces/BookmarkNode";

interface GameCategories {
    early: string[];
    waiting: string[];
    normal: string[];
}


interface GameSelector {
    matches: (url: string) => boolean;
    getElements: () => HTMLElement[];
}

export class GameHighlighting extends BaseHighlightingStrategy {
    private gameCategories: GameCategories | null = null;
    private readonly selectors: GameSelector[];

    constructor(bookmarkManager: IBookmarkManager) {
        super(bookmarkManager);
        this.selectors = this.initializeSelectors();
    }

    matchesCurrentUrl(): boolean {
        return this.selectors.some(selector =>
            selector.matches(window.location.href)
        );
    }

    async initialize(): Promise<void> {
        this.gameCategories = await this.getGameCategories();
        this.startPeriodicHighlighting();
    }

    injectStyles(): void {
        if (this.stylesInjected) return;

        const styles = `
            .steam-highlighter {
                font-size: 16px;
                color: white;
                padding: 2px 5px;
                border-radius: 3px;
            }
            .steam-highlighter--normal { background-color: #008000; }
            .steam-highlighter--early { background-color: #1034A6; }
            .steam-highlighter--waiting { background-color: #666666; }
            .steam-highlighter--not-played { background-color: transparent; }
        `;

        this.injectStyleSheet(styles);
        this.stylesInjected = true;
    }

    applyHighlighting(): void {
        if (!this.gameCategories) return;

        const currentUrl = window.location.href;
        const matchingSelector = this.selectors.find(selector =>
            selector.matches(currentUrl)
        );

        if (matchingSelector) {
            const elements = matchingSelector.getElements();
            this.applyClassesToElements(elements);
        }
    }

    private async getGameCategories(): Promise<GameCategories> {
        const bookmarkTree = await this.bookmarkManager.getBookmarkTree();
        const gamesFolder = this.bookmarkManager.findFolder(bookmarkTree[0], "Games");

        return gamesFolder ? this.categorizeGames(gamesFolder) : {
            early: [], waiting: [], normal: []
        };
    }

    private categorizeGames(gamesFolder: BookmarkNode): GameCategories {
        const categories: GameCategories = {
            early: [], waiting: [], normal: []
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

    private initializeSelectors(): GameSelector[] {
        return [
            {
                matches: (url) => url.includes('store.steampowered.com/search/'),
                getElements: () => Array.from(document.getElementsByClassName('title'))
                    .map(el => el as HTMLElement)
            },
            {
                matches: (url) => url.includes('steam250.com'),
                getElements: () => Array.from(document.querySelectorAll('.title a'))
                    .map(el => el as HTMLElement)
            },
            {
                matches: (url) => /steamdb\.info\/stats\/gameratings\/\d+/.test(url),
                getElements: () => Array.from(document.getElementsByClassName('b'))
                    .map(el => el as HTMLElement)
            },
            {
                matches: (url) => url.includes('steamdb.info/stats/gameratings'),
                getElements: () => {
                    const elements = document.getElementsByTagName('td');
                    return Array.from(elements)
                        .filter((_, i) => i % 7 === 2)
                        .map(td => td.querySelector('a') as HTMLElement)
                        .filter(link => link !== null);
                }
            }
        ];
    }

    private applyClassesToElements(elements: HTMLElement[]): void {
        elements.forEach(element => {
            if (element instanceof HTMLElement) {
                const textContent = this.normalizeGameTitle(element.textContent || '');
                this.applyClassesToElement(element, textContent);
            }
        });
    }

    private normalizeGameTitle(title: string): string {
        return this.normalizeText(title);
    }

    private applyClassesToElement(element: HTMLElement, gameName: string): void {
        element.classList.add('steam-highlighter');
        element.classList.add(this.getCategoryClassForGame(gameName));
    }

    private getCategoryClassForGame(gameName: string): string {
        if (this.gameCategories?.normal.includes(gameName)) {
            return 'steam-highlighter--normal';
        } else if (this.gameCategories?.early.includes(gameName)) {
            return 'steam-highlighter--early';
        } else if (this.gameCategories?.waiting.includes(gameName)) {
            return 'steam-highlighter--waiting';
        }
        return 'steam-highlighter--not-played';
    }

    private extractGameName(url: string): string {
        const match = url.match(/\/app\/\d+\/(.*?)\//);
        return match ? this.normalizeGameName(match[1]) : '';
    }

    private normalizeGameName(gameName: string): string {
        return this.normalizeText(gameName.replace(/_/g, ' '));
    }

    private injectStyleSheet(css: string): void {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = css;
        document.head.appendChild(styleSheet);
    }
}
