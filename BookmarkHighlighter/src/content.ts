import {GameHighlighting} from "./services/highlighting/game-highlighting";
import {HighlightingService} from "./services/highlighting/highlighting.service";
import {NexusHighlighting} from "./services/highlighting/nexus-highlighting";
import {SteamWorkshopHighlighting} from "./services/highlighting/steam-workshop-highlighting";

const highlightingService = HighlightingService.getInstance();
const games = new GameHighlighting();
const nexusMods = new NexusHighlighting();
const steamWorkshop = new SteamWorkshopHighlighting();

highlightingService.useHighlighter(games);
highlightingService.useHighlighter(nexusMods);
highlightingService.useHighlighter(steamWorkshop);