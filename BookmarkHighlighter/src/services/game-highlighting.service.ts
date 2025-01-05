import {ElementSelector, GameCategories} from "../interfaces/types";
import {GameBookmarkService} from "./game-bookmark.service";

export class GameHighlightingService {
    private static instance: GameHighlightingService;
    private gameCategories: GameCategories | null = null;
    private readonly selectors: ElementSelector[];

    private constructor() {
        this.selectors = this.initializeSelectors();
        this.initializeService();
        this.injectStyles();
    }

    static getInstance(): GameHighlightingService {
        if (!this.instance) {
            this.instance = new GameHighlightingService();
        }
        return this.instance;
    }

    private injectStyles(): void {
        const styles = `
            .steam-highlighter {
                font-size: 20px;
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
            .steam-highlighter--not-played {
                background-color: #a71930;
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    private async initializeService(): Promise<void> {
        const gameBookmarkService = GameBookmarkService.getInstance();
        this.gameCategories = await gameBookmarkService.getGameCategories();
        this.applyHighlighting();
        this.startPeriodicHighlighting();
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
            },
        ];
    }

    private startPeriodicHighlighting(): void {
        setInterval(() => this.applyHighlighting(), 5000);
    }

    private applyHighlighting(): void {
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
}
