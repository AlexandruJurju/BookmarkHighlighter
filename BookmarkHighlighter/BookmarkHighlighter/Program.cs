using BookmarkHighlighter.Parser;

var bookmarksFilePath = @"X:\Misc Programs\Browser\Vivaldi\User Data\Default\Bookmarks";
IBookmarkParser parser = new BookmarkParser(bookmarksFilePath);
var bookmarkStructure = parser.GetBookmarkStructure();