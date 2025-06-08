import { HighlightingService } from "./services/highlighting/highlighting.service";
import { ChromeBookmarkManager } from "./services/bookmark-manager";
import { GameHighlighting } from "./services/highlighting/game-highlighting";
import { NexusHighlighting } from "./services/highlighting/nexus-highlighting";
import { SteamWorkshopHighlighting } from "./services/highlighting/steam-workshop-highlighting";

const bookmarkManager = ChromeBookmarkManager.getInstance();
const highlightingService = HighlightingService.getInstance();

highlightingService.register(
    new GameHighlighting(bookmarkManager)
);
highlightingService.register(
    new NexusHighlighting(bookmarkManager)
);
highlightingService.register(
    new SteamWorkshopHighlighting(bookmarkManager)
);

highlightingService.initializeStrategies().catch(console.error);