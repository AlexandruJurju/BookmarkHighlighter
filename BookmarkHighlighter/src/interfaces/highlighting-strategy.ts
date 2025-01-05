export interface HighlightingStrategy {
    initialize(): Promise<void>;
    applyHighlighting(): void;
    injectStyles(): void;
}
