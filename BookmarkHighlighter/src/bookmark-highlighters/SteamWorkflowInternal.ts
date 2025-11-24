import {addStyles, startPolling} from "../infrastructure/utils";

export class SteamWorkshopInternal {
    async init() {
        if (!this.matches()) {
            return;
        }

        // Add border style
        addStyles(`
            .workshop-subscribed { 
                border: 3px solid green; 
            }
        `);

        startPolling(() => this.highlight(), 3000);
    }

    private matches(): boolean {
        return /https?:\/\/steamcommunity\.com\/(sharedfiles|workshop)/.test(location.href);
    }

    private applyTitleStyle(titleEl: HTMLElement | null) {
        if (!titleEl) {
            return;
        }

        titleEl.style.backgroundColor = "green";
        titleEl.style.fontWeight = "bold";
        titleEl.style.fontSize = "16px";
    }

    private highlight() {
        // Case 1: Normal workshop pages
        const subscribedIcons = Array.from(
            document.querySelectorAll<HTMLElement>(".user_action_history_icon.subscribed")
        ).filter(icon => window.getComputedStyle(icon).display !== "none");

        for (const icon of subscribedIcons) {
            const item = icon.closest(".workshopItem, .workshopItemListItem");
            if (!item) {
                continue;
            }

            item.classList.add("workshop-subscribed");

            const titleEl = item.querySelector<HTMLElement>(".workshopItemTitle");
            this.applyTitleStyle(titleEl);
        }

        // Case 2: Collection pages
        const collectionButtons = document.querySelectorAll<HTMLAnchorElement>(
            ".subscriptionControls .subscribe"
        );

        for (const btn of Array.from(collectionButtons)) {
            if (!btn.classList.contains("toggled")) {
                continue;
            }

            const item = btn.closest(".collectionItem");
            if (!item) {
                continue;
            }

            item.classList.add("workshop-subscribed");

            const titleEl = item.querySelector<HTMLElement>(".workshopItemTitle");
            this.applyTitleStyle(titleEl);
        }
    }
}
