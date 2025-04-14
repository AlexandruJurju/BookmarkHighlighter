import {GameHighlighting} from "./services/game-highlighting";
import {HighlightingService} from "./services/highlighting.service";
import {NexusHighlighting} from "./services/nexus-highlighting";
import {SteamWorkshopHighlighting} from "./services/steam-workshop-highlighting";

const highlightingService = HighlightingService.getInstance();
const games = new GameHighlighting();
const nexusMods = new NexusHighlighting();
const steamWorkshop = new SteamWorkshopHighlighting();

highlightingService.useHighlighter(games);
highlightingService.useHighlighter(nexusMods);
highlightingService.useHighlighter(steamWorkshop);