namespace BookmarkHighlighter.Structure;

public class Bookmark
{
    public string Name { get; }
    public string Url { get; }

    public Bookmark(string name, string url)
    {
        Name = name;
        Url = url;
    }
}