using BookmarkHighlighter.BookmarkParsers;
using BookmarkHighlighter.JsonParser;
using BookmarkHighlighter.JsWriters.GamesWriter;
using BookmarkHighlighter.JsWriters.NexusModsWriter;

// todo: make it so js file is only written once, first find all the links then write

var bookmarksFilePath = @"/run/media/alex/storage/Browser Downloads/bookmarks-2024-07-28.json";
IBookmarkParser parser = new FirefoxBackupParser(bookmarksFilePath);
var bookmarkStructure = parser.GetBookmarkStructure();

var outputPath = @"Highlighter Extension/GameHighlighter.js";

if (File.Exists(outputPath)) File.Delete(outputPath);

BookmarkParserBase gameParser = new GamesParser();
BookmarkParserBase nexusModsParser = new NexusModsParser();

var games = gameParser.Parse(bookmarkStructure);
var gamesJsWriter = new GamesJsWriter(outputPath);
gamesJsWriter.Write(games);

var nexusMods = nexusModsParser.Parse(bookmarkStructure);
var nexusModsJsWriter = new NexusModsJsWriter(outputPath);
nexusModsJsWriter.Write(nexusMods);