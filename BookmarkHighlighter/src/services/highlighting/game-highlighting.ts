import {IHighlighting} from "../../interfaces/IHighlighting";
import {BookmarkNode, ElementSelector, GameCategories} from "../../interfaces/types";
import {BookmarkManager} from "../bookmark-manager";

export class GameHighlighting implements IHighlighting {
    private gameCategories: GameCategories | null = null;
    private readonly selectors: ElementSelector[];

    constructor() {
        this.selectors = this.initializeSelectors();
    }

    async initialize(): Promise<void> {
        this.gameCategories = await this.getGameCategories();
        this.applyHighlighting();
        this.startPeriodicHighlighting();
    }

    injectStyles(): void {
        const styles = `
            .steam-highlighter {
                font-size: 16px;
                color: white;
            }
            .steam-highlighter--normal {
                background-color: #008000;
            }
            .steam-highlighter--early {
                background-color: #1034A6;
            }
            .steam-highlighter--waiting {
                background-color: #666666;
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    private async getGameCategories(): Promise<GameCategories> {
        const bookmarkTree = await BookmarkManager.getBookmarkTree();
        const gamesFolder = BookmarkManager.findFolder(bookmarkTree[0], "Games");

        if (!gamesFolder) {
            return {early: [], waiting: [], normal: []};
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

    private initializeSelectors(): ElementSelector[] {
        return [
            {
                matches: (url: string) => url.includes('store.steampowered.com/search/'),
                getElements: () => Array.from(document.getElementsByClassName('title')).map(el => el as HTMLElement)
            },
            {
                matches: (url: string) => url.includes('steam250.com'),
                getElements: () => Array.from(document.querySelectorAll('.title a')).map(el => el as HTMLElement)
            },
            {
                matches: (url: string) => /steamdb\.info\/stats\/gameratings\/\d+/.test(url),
                getElements: () => Array.from(document.getElementsByClassName('b')).map(el => el as HTMLElement)
            },
            {
                matches: (url: string) => url.includes('steamdb.info/stats/gameratings'),
                getElements: () => {
                    const elements = document.getElementsByTagName('td');
                    return Array.from(elements)
                        .filter((_, i) => i % 7 === 2)
                        .map(td => {
                            const link = td.querySelector('a');
                            return link as HTMLElement;
                        })
                        .filter((link): link is HTMLElement => link !== null);
                }
            }
        ];
    }

    private startPeriodicHighlighting(): void {
        setInterval(() => this.applyHighlighting(), 5000);
    }

    applyHighlighting(): void {
        if (!this.gameCategories) return;

        const currentUrl = window.location.href;
        const matchingSelector = this.selectors.find(selector => selector.matches(currentUrl));

        if (matchingSelector) {
            const elements = matchingSelector.getElements();
            if (elements && elements.length > 0) {
                this.applyClassesToElements(elements);
            }
        }
    }

    private applyClassesToElements(elements: HTMLElement[]): void {
        for (const element of elements) {
            if (element instanceof HTMLElement) {
                const textContent = this.normalizeGameTitle(element.textContent || '');
                this.applyClassesToElement(element, textContent);
            }
        }
    }

    private normalizeGameTitle(title: string): string {
        return title
            .replace('amp', '')
            .replace(/(?!\w|\s)./g, '')
            .replace(/™/g, '')
            .trim()
            .toLowerCase();
    }

    private applyClassesToElement(element: HTMLElement, gameName: string): void {
        element.classList.add('steam-highlighter');

        if (!this.gameCategories) {
            element.classList.add('steam-highlighter--not-played');
            return;
        }

        const categoryClass = this.getCategoryClassForGame(gameName);
        element.classList.add(categoryClass);
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
        return gameName.replace(/_/g, ' ').toLowerCase().trim();
    }
}
