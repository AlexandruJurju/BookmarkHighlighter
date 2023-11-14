namespace BookmarkHighlighter;

//         string bookmarksFilePath = @"C:\Users\realb\AppData\Local\Vivaldi\User Data\Default\Bookmarks";

class Program
{
    static void Main()
    {
        string bookmarksFilePath = @"C:\Users\realb\AppData\Local\Vivaldi\User Data\Default\Bookmarks";
        Parser parser = new Parser();
        Dictionary<String, List<String>> games = parser.GetLinks(bookmarksFilePath);
        Highlighter.WriteGameJsFiles(games);
    }
}