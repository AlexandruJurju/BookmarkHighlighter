import {BookmarkService} from "./bookmark.service";
import {FolderNames} from "../constants/folders";
import {BookmarkNode} from "../interfaces/types";

export class NexusBookmarkService extends BookmarkService {
    private static readonly NEXUS_MODS_PATTERN = /https?:\/\/www\.nexusmods\.com\/([^/]+)\/mods\/(\d+)/;
    protected static instance: NexusBookmarkService | null = null;

    protected constructor() {
        super();
    }

    static getInstance(): NexusBookmarkService {
        if (!NexusBookmarkService.instance) {
            NexusBookmarkService.instance = new NexusBookmarkService();
        }
        return NexusBookmarkService.instance;
    }

    async getNexusModUrls(): Promise<string[]> {
        const bookmarkTree = await this.getBookmarkTree();
        const nexusFolder = this.findFolder(bookmarkTree[0], FolderNames.NEXUS_MODS);

        if (!nexusFolder) {
            return [];
        }

        return this.extractModUrls(nexusFolder);
    }

    private extractModUrls(folder: BookmarkNode): string[] {
        const urls: string[] = [];

        const processNode = (node: BookmarkNode) => {
            if (node.children) {
                node.children.forEach(processNode);
            } else if (node.url && this.isValidNexusModLink(node.url)) {
                urls.push(node.url);
            }
        };

        processNode(folder);
        return urls;
    }

    private isValidNexusModLink(url: string): boolean {
        return NexusBookmarkService.NEXUS_MODS_PATTERN.test(url);
    }
}
