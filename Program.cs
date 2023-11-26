using BookmarkHighlighter.Parsers;

namespace BookmarkHighlighter;

//         string bookmarksFilePath = @"C:\Users\realb\AppData\Local\Vivaldi\User Data\Default\Bookmarks";

class Program
{
    static void Main()
    {
        string bookmarksFilePath = @"C:\Users\realb\AppData\Local\Vivaldi\User Data\Default\Bookmarks";
        GamesParser parser = new GamesParser();
        Dictionary<String, List<String>> games = parser.GetLinks(bookmarksFilePath);
        Highlighter.WriteGameJsFiles(games);
    }
}