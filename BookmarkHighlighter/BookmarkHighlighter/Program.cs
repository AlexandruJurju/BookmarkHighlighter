using BookmarkHighlighter.BookmarkParsers;
using BookmarkHighlighter.Constants;
using BookmarkHighlighter.JsonParser;
using BookmarkHighlighter.JsWriters.GamesWriter;
using BookmarkHighlighter.JsWriters.NexusModsWriter;
using BookmarkHighlighter.Parser;

// todo: make it so js file is only written once, first find all the links then write

var bookmarksFilePath = @"X:\Misc Programs\Browser\Vivaldi\User Data\Default\Bookmarks";
IJsonParser parser = new JsonParser(bookmarksFilePath);
var bookmarkStructure = parser.GetBookmarkStructure();

var outputPath = @"Highlighter Extension\GameHighlighter.js";

if (File.Exists(outputPath))
{
    File.Delete(outputPath);
}

BookmarkParserBase gameParser = new GamesParser();
BookmarkParserBase nexusModsParser = new NexusModsParser();

var games = gameParser.Parse(bookmarkStructure);
GamesJsWriter gamesJsWriter = new GamesJsWriter(outputPath);
gamesJsWriter.Write(games);

var nexusMods = nexusModsParser.Parse(bookmarkStructure);
NexusModsJsWriter nexusModsJsWriter = new NexusModsJsWriter(outputPath);
nexusModsJsWriter.Write(nexusMods);
