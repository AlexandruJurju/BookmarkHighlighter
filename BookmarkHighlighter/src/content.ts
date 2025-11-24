import {Games} from "./bookmark-highlighters/Games";
import {NexusMods} from "./bookmark-highlighters/NexusMods";
import {SteamWorkshopExternal} from "./bookmark-highlighters/SteamWorkshopExternal";
import {SteamWorkshopInternal} from "./bookmark-highlighters/SteamWorkflowInternal";

const games = new Games();
const nexus = new NexusMods();
const externalWorkshop = new SteamWorkshopExternal();
const internalWorkshop = new SteamWorkshopInternal();

games.init().catch(console.error);
nexus.init().catch(console.error);
// externalWorkshop.init().catch(console.error);
internalWorkshop.init().catch(console.error);