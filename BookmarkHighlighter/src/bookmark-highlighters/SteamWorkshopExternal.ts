import {Bookmarks} from "../infrastructure/bookmarks";
import {addStyles, startPolling} from "../infrastructure/utils";

export class SteamWorkshopExternal {
    private modUrls: string[] = [];
    private bookmarks = Bookmarks.getInstance();

    async init() {
        if (!this.matches()) return;

        addStyles(`
            .workshop-downloaded { border: 5px solid #008000; }
        `);

        this.modUrls = await this.loadMods();
        startPolling(() => this.highlight(), 60000);
    }

    private matches(): boolean {
        return /https?:\/\/steamcommunity\.com\/(sharedfiles|workshop)/.test(location.href);
    }

    private async loadMods(): Promise<string[]> {
        const tree = await this.bookmarks.getTree();
        const folder = this.bookmarks.findFolder(tree[0], "Steam Workshop Mods");
        if (!folder) {
            return [];
        }

        return this.bookmarks.extractUrls(folder)
            .filter(url => /https?:\/\/steamcommunity\.com\/(sharedfiles|workshop)/.test(url));
    }

    private highlight() {
        const links = Array.from(
            document.querySelectorAll<HTMLAnchorElement>(
                'a.item_link[href*="filedetails/?id="], a.workshopItemTitle'
            )
        ).filter(link => /https?:\/\/steamcommunity\.com\/(sharedfiles|workshop)/.test(link.href));

        for (const link of links) {
            const container = link.closest('.workshopItem') ||
                link.closest('.workshopItemListItem') ||
                link.parentElement;

            if (container && this.modUrls.includes(link.href)) {
                container.classList.add('workshop-downloaded');
            }
        }
    }
}
