import {BaseHighlightingStrategy} from "./base-highlighting";
import {IBookmarkManager} from "../../interfaces/IBookmarkManager";

export class SteamWorkshopHighlighting extends BaseHighlightingStrategy {
    private static readonly STEAM_WORKSHOP_PATTERN =
        /https?:\/\/steamcommunity\.com\/(?:sharedfiles\/|workshop\/)/;
    private modUrls: string[] = [];
    private readonly highlightIntervalMs = 2000;

    constructor(bookmarkManager: IBookmarkManager) {
        super(bookmarkManager);
    }

    matchesCurrentUrl(): boolean {
        return SteamWorkshopHighlighting.STEAM_WORKSHOP_PATTERN.test(window.location.href);
    }

    async initialize(): Promise<void> {
        this.modUrls = await this.getSteamWorkshopMods();
        this.startPeriodicHighlighting(this.highlightIntervalMs);
    }

    injectStyles(): void {
        if (this.stylesInjected) return;

        const styles = `
            .steam-workshop-highlighter {
                // padding: 5px;
            }
            .steam-workshop-highlighter--downloaded {
                border: 5px solid #008000;
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

    private async getSteamWorkshopMods(): Promise<string[]> {
        const bookmarkTree = await this.bookmarkManager.getBookmarkTree();
        const workshopFolder = this.bookmarkManager.findFolder(bookmarkTree[0], "Steam Workshop Mods");

        if (!workshopFolder) return [];

        return this.bookmarkManager.extractUrlsFromFolder(workshopFolder)
            .filter(url => this.isValidSteamWorkshopLink(url));
    }

    private getModLinks(): HTMLAnchorElement[] {
        return Array.from(
            document.querySelectorAll<HTMLAnchorElement>(
                'a.item_link[href*="filedetails/?id="], a.workshopItemTitle'
            )
        ).filter(link => this.isValidSteamWorkshopLink(link.href));
    }

    private applyStylesToModLink(modLink: HTMLAnchorElement): void {
        if (!modLink.href) return;

        // Find the parent workshop item container
        const workshopItem = modLink.closest('.workshopItem') ||
            modLink.closest('.workshopItemListItem') ||
            modLink.parentElement;

        if (workshopItem) {
            workshopItem.classList.add('steam-workshop-highlighter');

            if (this.modUrls.includes(modLink.href)) {
                workshopItem.classList.add('steam-workshop-highlighter--downloaded');
                workshopItem.classList.remove('steam-workshop-highlighter--not-downloaded');
            } else {
                workshopItem.classList.add('steam-workshop-highlighter--not-downloaded');
                workshopItem.classList.remove('steam-workshop-highlighter--downloaded');
            }
        }
    }

    private isValidSteamWorkshopLink(url: string): boolean {
        return SteamWorkshopHighlighting.STEAM_WORKSHOP_PATTERN.test(url);
    }
}