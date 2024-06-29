namespace BookmarkHighlighter.JsWriters;

public interface IJsWriter
{
    void Write(Dictionary<string, List<string>> links);
}