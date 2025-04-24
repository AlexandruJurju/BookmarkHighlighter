import {IHighlighting} from "../interfaces/IHighlighting";
import {BookmarkManager} from "./bookmark-manager";

export class NexusHighlighting implements IHighlighting {
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

    private async getNexusModUrls(): Promise<string[]> {
        const bookmarkTree = await BookmarkManager.getBookmarkTree();
        const nexusFolder = BookmarkManager.findFolder(bookmarkTree[0], "Nexus Mods");

        if (!nexusFolder) {
            return [];
        }

        return BookmarkManager.extractModUrls(nexusFolder)
            .filter(url => this.isValidNexusModLink(url));
    }

    private startPeriodicHighlighting(): void {
        setInterval(() => this.applyHighlighting(), 1000);
    }

    applyHighlighting(): void {
        const modLinks = document.querySelectorAll<HTMLAnchorElement>('a[data-e2eid="mod-tile-title"]');

        modLinks.forEach(modLink => {
            if (!modLink.href) return;

            this.applyStylesToModLink(modLink);
        });
    }

    private applyStylesToModLink(modLink: HTMLAnchorElement): void {
        const href = modLink.href;

        modLink.classList.add('nexus-highlighter');

        if (this.modUrls.includes(href)) {
            modLink.classList.add('nexus-highlighter--downloaded');
        } else {
            // modLink.classList.add('nexus-highlighter--not-downloaded');
        }
    }


    private isValidNexusModLink(url: string): boolean {
        return NexusHighlighting.NEXUS_MODS_PATTERN.test(url);
    }
}
