using System.Text.RegularExpressions;
using BookmarkHighlighter.JsWriters;
using BookmarkHighlighter.Structure;

namespace BookmarkHighlighter.BookmarkParsers;

public class GamesParser : BookmarkParserBase
{
    private const string SteamAppPattern = @"/app/\d+/(.*?)/";

    public override Dictionary<string, List<string>> Parse(BookmarkFolder rootFolder)
    {
        // Find the "Games" folder in the root folder
        var gamesFolder = FindFolder(rootFolder, "Games");
        if (gamesFolder == null)
        {
            throw new InvalidOperationException("Games folder not found");
        }

        // Flatten the folder structure
        var flattenedStructure = gamesFolder.FlattenStructure();
        // Process the flattened structure and return the result
        return ProcessFlattenedStructure(flattenedStructure);
    }

    private Dictionary<string, List<string>> ProcessFlattenedStructure(Dictionary<string, List<string>> flattenedStructure)
    {
        var result = new Dictionary<string, List<string>>();

        foreach (var (folderName, links) in flattenedStructure)
        {
            // Filter Steam URLs and extract game names
            var games = links
                .Where(url => url.Contains("steampowered.com"))
                .Select(ExtractGameName)
                .ToList();

            // Only add non-empty folders to the result
            if (games.Count > 0)
            {
                result[folderName] = games;
            }
        }

        return result;
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