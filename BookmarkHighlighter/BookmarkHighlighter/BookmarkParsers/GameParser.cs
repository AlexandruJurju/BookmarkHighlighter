using System.Text.RegularExpressions;
using BookmarkHighlighter.Structure;

namespace BookmarkHighlighter.BookmarkParsers;

public class GamesParser : BookmarkParserBase
{
    private const string SteamAppPattern = @"/app/\d+/(.*?)/";

    public override Dictionary<string, List<string>> Parse(BookmarkFolder rootFolder)
    {
        var gamesFolder = FindFolder(rootFolder, "Games");
        if (gamesFolder == null)
        {
            throw new InvalidOperationException("Games folder not found");
        }

        var flattenedStructure = gamesFolder.FlattenStructure();
        var result = ProcessFlattenedStructure(flattenedStructure);
        return result;
    }

    private Dictionary<string, List<string>> ProcessFlattenedStructure(Dictionary<string, List<string>> flattenedStructure)
    {
        var categories = new Dictionary<string, List<string>>
        {
            ["waiting"] = new(),
            ["early"] = new(),
            ["normal"] = new()
        };

        foreach (var (folderName, links) in flattenedStructure)
        {
            var category = GetCategory(folderName);
            var games = links
                .Where(url => url.Contains("steampowered.com"))
                .Select(ExtractGameName)
                .ToList();

            categories[category].AddRange(games);
        }

        return categories;
    }

    private string GetCategory(string folderName)
    {
        return folderName.ToLower() switch
        {
            "gwaiting" => "waiting",
            "gearly" => "early",
            _ => "normal"
        };
    }

    private string ExtractGameName(string url)
    {
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
        return string.Join(" ", gameName.Replace("_", " ").Split().Select(s => s.ToLower())).Trim();
    }
}