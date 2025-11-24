import {Bookmarks} from "../infrastructure/bookmarks";
import {addStyles, startPolling} from "../infrastructure/utils";

export class NexusMods {
    private modUrls: string[] = [];
    private bookmarks = Bookmarks.getInstance();

    async init() {
        if (!this.matches()) {
            return;
        }

        addStyles(`
            .nexus-tag { padding: 5px; }
            .nexus-downloaded { border: 10px solid #008000; }
        `);

        this.modUrls = await this.loadMods();
        startPolling(() => this.highlight(), 60000);
    }

    private matches(): boolean {
        return /https?:\/\/www\.nexusmods\.com/.test(location.href);
    }

    private async loadMods(): Promise<string[]> {
        const tree = await this.bookmarks.getTree();
        const folder = this.bookmarks.findFolder(tree[0], "Nexus Mods");
        if (!folder) {
            return [];
        }

        return this.bookmarks.extractUrls(folder)
            .filter(url => /https?:\/\/www\.nexusmods\.com/.test(url));
    }

    private highlight() {
        const links = Array.from(
            document.querySelectorAll<HTMLAnchorElement>(
                'a[data-e2eid="mod-tile-title"], a[href*="/mods/"]'
            )
        ).filter(link => /https?:\/\/www\.nexusmods\.com/.test(link.href));

        for (const link of links) {
            link.classList.add('nexus-tag');

            if (this.modUrls.includes(link.href)) {
                link.classList.add('nexus-downloaded');
            }
        }
    }
}
