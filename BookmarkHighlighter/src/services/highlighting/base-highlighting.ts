import {IHighlightingStrategy} from "../../interfaces/IHighlightingStrategy";
import {IBookmarkManager} from "../../interfaces/IBookmarkManager";

export abstract class BaseHighlightingStrategy implements IHighlightingStrategy {
    protected bookmarkManager: IBookmarkManager;
    protected stylesInjected = false;

    protected constructor(bookmarkManager: IBookmarkManager) {
        this.bookmarkManager = bookmarkManager;
    }

    abstract matchesCurrentUrl(): boolean;

    abstract applyHighlighting(): void;

    abstract injectStyles(): void;

    abstract initialize(): Promise<void>;

    protected startPeriodicHighlighting(intervalMs: number = 5000): void {
        this.applyHighlighting();
        setInterval(() => this.applyHighlighting(), intervalMs);
    }

    protected normalizeText(text: string): string {
        return text
            .replace(/[™®©]/g, '')
            .replace(/[^\w\s]/g, '')
            .trim()
            .toLowerCase();
    }
}