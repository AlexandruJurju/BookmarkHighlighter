export interface IHighlightingStrategy {
    initialize(): Promise<void>;
    applyHighlighting(): void;
    injectStyles(): void;
    matchesCurrentUrl(): boolean;
}