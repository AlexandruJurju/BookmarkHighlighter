import {NexusBookmarkService} from "./nexus-bookmarks.service";

export class NexusHighlightingService {
    private static instance: NexusHighlightingService | null = null;
    private modUrls: string[] = [];

    private constructor() {
        this.initializeService();
        this.injectStyles();
    }

    static getInstance(): NexusHighlightingService {
        if (!this.instance) {
            this.instance = new NexusHighlightingService();
        }
        return this.instance;
    }

    private injectStyles(): void {
        const styles = `
            .nexus-highlighter {
                padding: 5px;
            }
            .nexus-highlighter--downloaded {
                border: 10px solid #008000;
            }
            .nexus-highlighter--not-downloaded {
                border: 10px solid #a71930;
            }
            .nexus-highlighter__title {
                font-size: 20px;
                color: white;
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    private async initializeService(): Promise<void> {
        const nexusBookmarkService = NexusBookmarkService.getInstance();
        this.modUrls = await nexusBookmarkService.getNexusModUrls();
        this.startPeriodicHighlighting();
    }

    private startPeriodicHighlighting(): void {
        setInterval(() => this.applyHighlighting(), 1000);
    }

    private applyHighlighting(): void {
        const modTiles = document.querySelectorAll('.mod-tile-left');
        modTiles.forEach(tileElement => {
            if (!(tileElement instanceof HTMLElement)) return;

            const modLink = tileElement.querySelector('a');
            if (!modLink) return;

            const href = modLink.getAttribute('href');
            if (!href) return;

            this.applyStylesToTile(tileElement, href);
            this.applyStylesToTitle(tileElement);
        });
    }

    private applyStylesToTile(tileElement: HTMLElement, href: string): void {
        tileElement.classList.add('nexus-highlighter');

        if (this.modUrls.includes(href)) {
            tileElement.classList.add('nexus-highlighter--downloaded');
            tileElement.classList.remove('nexus-highlighter--not-downloaded');
        } else {
            tileElement.classList.add('nexus-highlighter--not-downloaded');
            tileElement.classList.remove('nexus-highlighter--downloaded');
        }
    }

    private applyStylesToTitle(tileElement: HTMLElement): void {
        const tileName = tileElement.querySelector('.tile-name a');
        if (tileName instanceof HTMLElement) {
            tileName.classList.add('nexus-highlighter__title');
        }
    }
}