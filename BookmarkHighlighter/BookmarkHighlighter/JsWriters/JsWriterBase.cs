using BookmarkHighlighter.Structure;

namespace BookmarkHighlighter.JsWriters;

public abstract class JsWriterBase
{
    protected readonly string TemplatePath;
    protected readonly string OutputPath;

    protected JsWriterBase(string outputPath)
    {
        TemplatePath = GetTemplatePath();
        OutputPath = outputPath;
    }

    protected abstract string GetTemplatePath();

    public void Write(List<BookmarkFolder> bookmarkFolders)
    {
        // Write content to the file
        using (var writer = new StreamWriter(OutputPath, true)) 
        {
            // Write processed bookmarks
            WriteBookmarks(bookmarkFolders, writer);

            // Append template content
            writer.WriteLine(File.ReadAllText(TemplatePath));
        }
    }

    protected abstract void WriteBookmarks(List<BookmarkFolder> bookmarkFolders, StreamWriter writer);
}