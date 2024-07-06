using BookmarkHighlighter.BookmarkParsers;
using BookmarkHighlighter.JsonParser;
using BookmarkHighlighter.JsWriters;
using BookmarkHighlighter.Parser;

// todo: make it so js file is only written once, first find all the links then write

var bookmarksFilePath = @"X:\Misc Programs\Browser\Vivaldi\User Data\Default\Bookmarks";
IJsonParser parser = new JsonParser(bookmarksFilePath);
var bookmarkStructure = parser.GetBookmarkStructure();

var templatePath = @"JsWriters\template.js";
var outputPath = @"Highlighter Extension\GameHighlighter.js";
IJsWriter writer = new JsWriter(templatePath, outputPath);

BookmarkParserBase gameParser = new GamesParser();
var bookmarkFolders = gameParser.Parse(bookmarkStructure);



