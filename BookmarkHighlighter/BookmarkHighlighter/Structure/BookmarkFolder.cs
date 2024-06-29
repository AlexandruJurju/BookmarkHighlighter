namespace BookmarkHighlighter.Structure;

public class BookmarkFolder
{
    public string Name { get; }
    public List<BookmarkFolder> Subfolders { get; } = new();
    public List<Bookmark> Bookmarks { get; } = new();

    public BookmarkFolder(string name)
    {
        Name = name;
    }
}