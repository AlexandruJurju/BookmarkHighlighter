using BookmarkHighlighter.Parser;

var bookmarksFilePath = @"X:\Misc Programs\Browser\Vivaldi\User Data\Default\Bookmarks";
IJsonParser parser = new JsonParser(bookmarksFilePath);
var bookmarkStructure = parser.GetBookmarkStructure();