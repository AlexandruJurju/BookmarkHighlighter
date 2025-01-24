import { HighlightingStrategy } from "../interfaces/highlighting-strategy";
import { BookmarkManager } from "./bookmark-manager";

export class NexusHighlightingStrategy implements HighlightingStrategy {
    private static readonly NEXUS_MODS_PATTERN = /https?:\/\/www\.nexusmods\.com\/([^/]+)\/mods\/(\d+)/;
    private modUrls: string[] = [];

    async initialize(): Promise<void> {
        this.modUrls = await this.getNexusModUrls();
        this.applyHighlighting();
        this.startPeriodicHighlighting();
    }

    injectStyles(): void {
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

    // get all the urls from the Nexus Mods folder
    private async getNexusModUrls(): Promise<string[]> {
        const bookmarkTree = await BookmarkManager.getBookmarkTree();
        const nexusFolder = BookmarkManager.findFolder(bookmarkTree[0], "Nexus Mods");

        if (!nexusFolder) {
            return [];
        }

        return BookmarkManager.extractModUrls(nexusFolder)
            .filter(url => this.isValidNexusModLink(url));
    }

    // every second, apply highlighting to the mod urls
    private startPeriodicHighlighting(): void {
        setInterval(() => this.applyHighlighting(), 1000);
    }

    applyHighlighting(): void {
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

    private isValidNexusModLink(url: string): boolean {
        return NexusHighlightingStrategy.NEXUS_MODS_PATTERN.test(url);
    }
}
