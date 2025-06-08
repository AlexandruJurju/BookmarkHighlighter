import {BookmarkNode} from "./BookmarkNode";

export interface IBookmarkManager {
    getBookmarkTree(): Promise<BookmarkNode[]>;

    findFolder(root: BookmarkNode, folderName: string): BookmarkNode | null;

    extractUrlsFromFolder(folder: BookmarkNode): string[];
}