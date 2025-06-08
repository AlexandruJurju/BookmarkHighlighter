import {IBookmarkManager} from "../../interfaces/IBookmarkManager";
import {BaseHighlightingStrategy} from "./base-highlighting";

export class NexusHighlighting extends BaseHighlightingStrategy {
    private static readonly NEXUS_MODS_PATTERN =
        /https?:\/\/www\.nexusmods\.com\/(?:games\/)?([^/?]+)(?:\/mods(?:\/(\d+))?)?/;
    private modUrls: string[] = [];
    private readonly highlightIntervalMs = 2000;

    constructor(bookmarkManager: IBookmarkManager) {
        super(bookmarkManager);
    }

    matchesCurrentUrl(): boolean {
        return NexusHighlighting.NEXUS_MODS_PATTERN.test(window.location.href);
    }

    async initialize(): Promise<void> {
        this.modUrls = await this.getNexusModUrls();
        this.startPeriodicHighlighting(this.highlightIntervalMs);
    }

    injectStyles(): void {
        if (this.stylesInjected) return;

        const styles = `
            .nexus-highlighter {
                padding: 5px;
            }
            .nexus-highlighter--downloaded {
                border: 10px solid #008000;
            }
            .nexus-highlighter__title {
                font-size: 20px;
                color: white;
            }
        `;

        this.injectStyleSheet(styles);
        this.stylesInjected = true;
    }

    protected injectStyleSheet(css: string): void {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = css;
        document.head.appendChild(styleSheet);
    }

    applyHighlighting(): void {
        const modLinks = this.getModLinks();
        modLinks.forEach(modLink => this.applyStylesToModLink(modLink));
    }

    private async getNexusModUrls(): Promise<string[]> {
        const bookmarkTree = await this.bookmarkManager.getBookmarkTree();
        const nexusFolder = this.bookmarkManager.findFolder(bookmarkTree[0], "Nexus Mods");

        if (!nexusFolder) return [];

        return this.bookmarkManager.extractUrlsFromFolder(nexusFolder)
            .filter(url => this.isValidNexusModLink(url));
    }

    private getModLinks(): HTMLAnchorElement[] {
        return Array.from(
            document.querySelectorAll<HTMLAnchorElement>(
                'a[data-e2eid="mod-tile-title"], a[href*="/mods/"]'
            )
        ).filter(link => this.isValidNexusModLink(link.href));
    }

    private applyStylesToModLink(modLink: HTMLAnchorElement): void {
        if (!modLink.href) return;

        modLink.classList.add('nexus-highlighter');

        if (this.modUrls.includes(modLink.href)) {
            modLink.classList.add('nexus-highlighter--downloaded');
            modLink.classList.remove('nexus-highlighter--not-downloaded');
        } else {
            modLink.classList.add('nexus-highlighter--not-downloaded');
            modLink.classList.remove('nexus-highlighter--downloaded');
        }
    }

    private isValidNexusModLink(url: string): boolean {
        return NexusHighlighting.NEXUS_MODS_PATTERN.test(url);
    }
}