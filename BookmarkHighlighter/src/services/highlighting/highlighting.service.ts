import {IHighlightingStrategy} from "../../interfaces/IHighlightingStrategy";

export class HighlightingService {
    private static instance: HighlightingService;
    private strategies: IHighlightingStrategy[] = [];

    private constructor() {}

    public static getInstance(): HighlightingService {
        if (!HighlightingService.instance) {
            HighlightingService.instance = new HighlightingService();
        }
        return HighlightingService.instance;
    }

    public register(strategy: IHighlightingStrategy): void {
        this.strategies.push(strategy);
    }

    public async initializeStrategies(): Promise<void> {
        const applicableStrategies = this.strategies.filter(strategy =>
            strategy.matchesCurrentUrl()
        );

        for (const strategy of applicableStrategies) {
            strategy.injectStyles();
            await strategy.initialize();
        }
    }
}