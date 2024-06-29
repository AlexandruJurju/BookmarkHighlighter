using BookmarkHighlighter.BookmarkParsers;
using BookmarkHighlighter.JsonParser;
using BookmarkHighlighter.JsWriters;
using BookmarkHighlighter.Parser;

var bookmarksFilePath = @"X:\Misc Programs\Browser\Vivaldi\User Data\Default\Bookmarks";
IJsonParser parser = new JsonParser(bookmarksFilePath);
var bookmarkStructure = parser.GetBookmarkStructure();

GamesParser gameParser = new GamesParser();
gameParser.Parse(bookmarkStructure);

IJsWriter writer = new JsWriter(@"JsWriters\template.js");
writer.Write();