export function normalize(text: string): string {
    return text.replace(/[™®©]/g, '').replace(/[^\w\s]/g, '').trim().toLowerCase();
}

export function addStyles(css: string) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
}

export function startPolling(fn: () => void, intervalMs = 3000) {
    fn();
    setInterval(fn, intervalMs);
}