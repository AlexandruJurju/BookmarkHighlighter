export interface IHighlighting {
    initialize(): Promise<void>;
    applyHighlighting(): void;
    injectStyles(): void;
}
