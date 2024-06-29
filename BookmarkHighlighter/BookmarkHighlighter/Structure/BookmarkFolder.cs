using System.Collections.Concurrent;

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

    public Dictionary<string, List<string>> FlattenStructure()
    {
        var result = new ConcurrentDictionary<string, List<string>>();

        FlattenStructureInternal(this, result);

        return new Dictionary<string, List<string>>(result);
    }

    private void FlattenStructureInternal(BookmarkFolder folder, ConcurrentDictionary<string, List<string>> result)
    {
        var links = new List<string>(folder.Bookmarks.Select(b => b.Url));
        result.TryAdd(folder.Name, links);

        foreach (var subfolder in folder.Subfolders)
        {
            FlattenStructureInternal(subfolder, result);
        }
    }
}