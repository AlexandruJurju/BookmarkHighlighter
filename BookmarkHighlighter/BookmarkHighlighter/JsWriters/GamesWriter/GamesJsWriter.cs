using BookmarkHighlighter.Constants;
using BookmarkHighlighter.Structure;

namespace BookmarkHighlighter.JsWriters.GamesWriter;

public class GamesJsWriter : JsWriterBase
{
    public GamesJsWriter(string outputPath) : base(outputPath)
    {
    }

    protected override string GetTemplatePath()
    {
        return FilePaths.GamesTemplatePath;
    }

    protected override void WriteBookmarks(List<BookmarkFolder> bookmarkFolders, StreamWriter writer)
    {
        var earlyGames = new List<string>();
        var waitingGames = new List<string>();
        var normalGames = new List<string>();

        foreach (var folder in bookmarkFolders)
        {
            var games = folder.Bookmarks.Select(b => b.Name).ToList();
            switch (folder.Name.ToLower())
            {
                case "gearly":
                    earlyGames.AddRange(games);
                    break;
                case "gwaiting":
                    waitingGames.AddRange(games);
                    break;
                default:
                    normalGames.AddRange(games);
                    break;
            }
        }

        WriteGameList(writer, "Early", earlyGames);
        WriteGameList(writer, "Waiting", waitingGames);
        WriteGameList(writer, "Normal", normalGames);
    }

    private void WriteGameList(StreamWriter writer, string key, List<string> games)
    {
        var gamesString = string.Join(", ", games.Select(g => $"\"{g}\""));
        writer.WriteLine($"const {key}=[{gamesString}];");
    }
}