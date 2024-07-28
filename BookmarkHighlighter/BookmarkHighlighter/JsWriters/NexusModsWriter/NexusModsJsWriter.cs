using BookmarkHighlighter.Constants;
using BookmarkHighlighter.Structure;

namespace BookmarkHighlighter.JsWriters.NexusModsWriter;

public class NexusModsJsWriter : JsWriterBase
{
    public NexusModsJsWriter(string outputPath) : base(outputPath)
    {
    }

    protected override string GetTemplatePath()
    {
        return FilePaths.NexusModsTemplatePath;
    }

    protected override void WriteBookmarks(List<BookmarkFolder> bookmarkFolders, StreamWriter writer)
    {
        var allUrls = bookmarkFolders
            .SelectMany(folder => folder.Bookmarks)
            .Select(bookmark => $"\"{bookmark.Url}\"");

        var urlString = string.Join(", ", allUrls);
        writer.WriteLine($"const mods=[{urlString}];");
    }
}