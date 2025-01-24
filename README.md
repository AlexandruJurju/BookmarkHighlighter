# BookmarkHighlighter
# Overview
A TypeScript browser extension that highlights games and mods on Steam and Nexus Mods based on the browser bookmarks. The extension uses the Strategy pattern to handle different types of highlighting and makes it easy to add new highlighting behaviors.

# Installation
1. Clone this repository:
```git clone https://github.com/yourusername/bookmark-highlighter.git```

2. Install dependencies:
```npm install```

3. Build the extension:
```npm run build```

4. Load the extension in your browser:
- Chrome: Go to chrome://extensions/, enable "Developer mode", and click "Load unpacked"
- Firefox: Go to about:debugging#/runtime/this-firefox, click "Load Temporary Add-on"
- Edge: Go to edge://extensions/, enable "Developer mode", and click "Load unpacked"

# Usage
1. Organize your bookmarks:
  - Create a "Games" folder for Steam games
  - Optional subfolders: "GEarly" for Early Access, "GWaiting" for waitlist
  - Create a "Nexus Mods" folder for mod bookmarks

2. The extension will automatically:
  - Highlight Steam games in different colors based on their category
  - Show green borders for bookmarked Nexus mods
  - Update highlights immediately on page load and every 5 seconds


# How It Works
- Bookmark Processing: Reads Chrome bookmarks to categorize games and mods
- Strategy Pattern: The extension uses separate strategies for Steam and Nexus highlighting
- Highlighting: Applies visual indicators based on bookmark categories
- Extension Core: Built with TypeScript for better type safety and maintainability
