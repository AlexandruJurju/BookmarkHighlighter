using System.Text.RegularExpressions;
using BookmarkHighlighter.JsWriters;
using BookmarkHighlighter.Structure;

namespace BookmarkHighlighter.BookmarkParsers;

public class GamesParser : BookmarkParserBase
{
    private const string SteamAppPattern = @"/app/\d+/(.*?)/";

    protected override Dictionary<string, List<string>> Parse(BookmarkFolder rootFolder)
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
            ["Waiting"] = new(),
            ["Early"] = new(),
            ["Normal"] = new()
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
            "gwaiting" => "Waiting",
            "gearly" => "Early",
            _ => "Normal"
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

    public GamesParser(IJsWriter jsWriter) : base(jsWriter)
    {
    }
}