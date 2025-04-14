import {IHighlighting} from "../interfaces/IHighlighting";
import {BookmarkManager} from "./bookmark-manager";

export class SteamWorkshopHighlighting implements IHighlighting {
    private static readonly STEAM_WORKSHOP_PATTERN = /https?:\/\/steamcommunity\.com\/sharedfiles\/filedetails\/\?id=\d+/;
    private modUrls: string[] = [];

    async initialize(): Promise<void> {
        console.log("INITIALIZED");
        this.modUrls = await this.getSteamWorkshopMods();
        this.applyHighlighting();
        this.startPeriodicHighlighting();
    }

    private async getSteamWorkshopMods(): Promise<string[]> {
        const bookmarkTree = await BookmarkManager.getBookmarkTree();
        const steamWorkshopFolder = BookmarkManager.findFolder(bookmarkTree[0], "Steam Workshop Mods");

        if (!steamWorkshopFolder) {
            return [];
        }

        return BookmarkManager.extractModUrls(steamWorkshopFolder)
            .filter(url => this.isValidSteamWorkshopLink(url));
    }

    applyHighlighting(): void {
        const modLinks = document.querySelectorAll<HTMLAnchorElement>('a.item_link[href*="steamcommunity.com/sharedfiles/filedetails/?id="]');

        modLinks.forEach(modLink => {
            if (!modLink.href) return;

            this.applyStylesToModLink(modLink);
        });
    }

    injectStyles(): void {
        const styles = `
            .steam-workshop-highlighter {
                // padding: 5px;
            }
            .steam-workshop-highlighter--downloaded {
                border: 5px solid #008000;
            }
            .steam-workshop-highlighter--not-downloaded {
                border: 5px solid #a71930;
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    private applyStylesToModLink(modLink: HTMLAnchorElement): void {
        const href = modLink.href;

        modLink.classList.add('steam-workshop-highlighter');

        if (this.modUrls.includes(href)) {
            modLink.classList.add('steam-workshop-highlighter--downloaded');
            modLink.classList.remove('steam-workshop-highlighter--not-downloaded');
        } else {
            modLink.classList.add('steam-workshop-highlighter--not-downloaded');
            modLink.classList.remove('steam-workshop-highlighter--downloaded');
        }
    }

    private startPeriodicHighlighting(): void {
        setInterval(() => this.applyHighlighting(), 1000);
    }

    private isValidSteamWorkshopLink(url: string): boolean {
        return SteamWorkshopHighlighting.STEAM_WORKSHOP_PATTERN.test(url);
    }
}