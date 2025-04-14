import {IHighlighting} from "../interfaces/IHighlighting";

export class HighlightingService {
    private static instance: HighlightingService = new HighlightingService();
    private strategy: IHighlighting | null = null;

    private constructor() {
    }

    static getInstance(): HighlightingService {
        return this.instance;
    }

    useHighlighter(strategy: IHighlighting): void {
        this.strategy = strategy;
        strategy.injectStyles();
        strategy.initialize();
    }
}