using System.Text.RegularExpressions;
using BookmarkHighlighter.Structure;

namespace BookmarkHighlighter.BookmarkParsers;

public class GamesParser : BookmarkParserBase
{
    private const string SteamAppPattern = @"/app/\d+/(.*?)/";

    public override void Parse(BookmarkFolder rootFolder)
    {
        var gamesFolder = FindFolder(rootFolder, "Games");
        if (gamesFolder == null)
        {
            throw new InvalidOperationException("Games folder not found");
        }

        var categories = new Dictionary<string, List<string>>
        {
            ["waiting"] = new(),
            ["early"] = new(),
            ["normal"] = new()
        };

        ProcessFolder(gamesFolder, categories);
    }

    private void ProcessFolder(BookmarkFolder folder, Dictionary<string, List<string>> categories)
    {
        foreach (var subfolder in folder.Subfolders)
        {
            var category = GetCategory(subfolder.Name);
            if (subfolder.Subfolders.Any())
            {
                ProcessFolder(subfolder, categories);
            }
            else
            {
                var games = GetGamesFromFolder(subfolder);
                categories[category].AddRange(games);
            }
        }

        var currentCategory = GetCategory(folder.Name);
        var gamesInCurrentFolder = GetGamesFromFolder(folder);
        categories[currentCategory].AddRange(gamesInCurrentFolder);
    }

    private List<string> GetGamesFromFolder(BookmarkFolder folder)
    {
        return folder.Bookmarks
            .Where(b => b.Url.Contains("steampowered.com"))
            .Select(b => ExtractGameName(b.Url))
            .ToList();
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