# BookmarkHighlighter
# Overview
This C# application automates the process of creating a browser extension that highlights specific games on web pages based on bookmarked URLs. It reads bookmark data in JSON format, processes a JavaScript template, and generates the necessary code for a browser extension.

# Installation

Clone this repository:
Copygit clone https://github.com/yourusername/game-highlighter-extension-generator.git
Open the solution file (GameHighlighterExtensionGenerator.sln) in Visual Studio.
Build the solution (Press F6 or use Build > Build Solution).

# Usage

Prepare your bookmarks JSON file (see Configuration for format details).
Run the application:
CopyGameHighlighterExtensionGenerator.exe path/to/bookmarks.json path/to/template.js path/to/output/extension

The generated extension will be in the specified output directory.
Load the extension in your browser:

- Chrome: Go to chrome://extensions/, enable "Developer mode", and click "Load unpacked".
- Firefox: Go to about:debugging#/runtime/this-firefox, click "Load Temporary Add-on", and select the manifest.json file.
- Edge: Go to edge://extensions/, enable "Developer mode", and click "Load unpacked".



# How It Works

- Bookmark Processing: The application reads the JSON file containing bookmark data. It extracts relevant information such as URLs and titles.
- Template Processing: A JavaScript template file is read and processed. This template contains placeholders for bookmark data and extension logic.
- Code Generation: The application generates the necessary JavaScript code by combining the processed bookmark data with the template.
- Extension Creation: The generated code, along with other required files (manifest.json, icons, etc.), is written to the output directory, creating a complete browser extension.
- Highlighting: When installed, the extension monitors web page URLs and applies highlighting to games that match the bookmarked URLs.


