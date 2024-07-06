using System.Text.RegularExpressions;
using BookmarkHighlighter.Constants;
using BookmarkHighlighter.Structure;

namespace BookmarkHighlighter.BookmarkParsers;

public class GamesParser : BookmarkParserBase
{
    private const string SteamAppPattern = @"/app/\d+/(.*?)/";

    public override List<BookmarkFolder> Parse(BookmarkFolder rootFolder)
    {
        // Find the "Games" folder in the root folder
        var gamesFolder = FindFolder(rootFolder, FolderNames.Games);
        if (gamesFolder == null)
        {
            throw new InvalidOperationException("Games folder not found");
        }

        // Process the Games folder and its subfolders
        return ProcessFolder(gamesFolder,
            bookmark => bookmark.Url.Contains("steampowered.com"),
            bookmark => new Bookmark(ExtractGameName(bookmark.Url), bookmark.Url));
    }

    private string ExtractGameName(string url)
    {
        // Use regex to extract game name from Steam URL
        var match = Regex.Match(url, SteamAppPattern);
        if (match.Success)
        {
            var gameName = match.Groups[1].Value;
            return NormalizeGameName(gameName);
        }

        throw new ArgumentException("Unable to extract game name from URL", nameof(url));
    }

    private string NormalizeGameName(string gameName)
    {
        // Convert underscores to spaces, split into words, convert to lowercase, and join back
        return string.Join(" ", gameName.Replace("_", " ").Split().Select(s => s.ToLower())).Trim();
    }
}