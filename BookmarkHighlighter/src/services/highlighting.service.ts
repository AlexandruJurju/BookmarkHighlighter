import { HighlightingStrategy } from "../interfaces/highlighting-strategy";

// service that contains the highlighting strategy
export class HighlightingService {
    private static instance: HighlightingService = new HighlightingService();
    private strategy: HighlightingStrategy | null = null;

    private constructor() { }

    static getInstance(): HighlightingService {
        return this.instance;
    }

    setStrategy(strategy: HighlightingStrategy): void {
        this.strategy = strategy;
        strategy.injectStyles();
        strategy.initialize();
    }
}