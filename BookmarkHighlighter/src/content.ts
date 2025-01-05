import { GameHighlightingStrategy } from "./services/game-highlighting-strategy";
import { HighlightingService } from "./services/highlighting.service";
import { NexusHighlightingStrategy } from "./services/nexus-highlighting-strategy";

const highlightingService = HighlightingService.getInstance();
const gameStrategy = new GameHighlightingStrategy();
const nexusStrategy = new NexusHighlightingStrategy();

highlightingService.setStrategy(gameStrategy);
highlightingService.setStrategy(nexusStrategy);