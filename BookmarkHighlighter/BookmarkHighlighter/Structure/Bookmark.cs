namespace BookmarkHighlighter.Structure;

public class Bookmark
{
    public Bookmark(string name, string url)
    {
        Name = name;
        Url = url;
    }

    public string Name { get; }
    public string Url { get; }
}