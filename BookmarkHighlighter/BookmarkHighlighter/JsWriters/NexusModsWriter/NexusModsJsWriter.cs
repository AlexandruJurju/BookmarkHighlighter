using BookmarkHighlighter.Constants;
using BookmarkHighlighter.Structure;

namespace BookmarkHighlighter.JsWriters.NexusModsWriter;

public class NexusModsJsWriter : JsWriterBase
{
    public NexusModsJsWriter(string outputPath) : base(outputPath)
    {
    }

    protected override string GetTemplatePath() => FilePaths.NexusModsTemplatePath;

    protected override void WriteBookmarks(List<BookmarkFolder> bookmarkFolders, StreamWriter writer)
    {
        foreach (var folder in bookmarkFolders)
        {
            var linkUrlString = string.Join(", ", folder.Bookmarks.Select(b => $"\"{b.Url}\""));
            var folderNameWithoutSpaces = RemoveSpaces(folder.Name);
            writer.WriteLine($"const {folderNameWithoutSpaces}=[{linkUrlString}];");
        }
    }

    private string RemoveSpaces(string input)
    {
        return new string(input.Where(c => !char.IsWhiteSpace(c)).ToArray());
    }
}