using BookmarkHighlighter.Structure;

namespace BookmarkHighlighter.BookmarkParsers;

public abstract class BookmarkParserBase
{
    public abstract List<BookmarkFolder> Parse(BookmarkFolder rootFolder);

    protected BookmarkFolder? FindFolder(BookmarkFolder folder, string name)
    {
        if (folder.Name.Equals(name, StringComparison.OrdinalIgnoreCase))
        {
            return folder;
        }

        foreach (var subfolder in folder.Subfolders)
        {
            var result = FindFolder(subfolder, name);
            if (result != null)
            {
                return result;
            }
        }

        return null;
    }

    protected List<BookmarkFolder> ProcessFolder(BookmarkFolder folder, Func<Bookmark, bool> filterPredicate, Func<Bookmark, Bookmark> transformFunc)
    {
        var result = new List<BookmarkFolder>();

        // Process current folder
        var processedFolder = ProcessSingleFolder(folder, filterPredicate, transformFunc);
        if (processedFolder.Bookmarks.Count > 0)
        {
            result.Add(processedFolder);
        }

        // Process subfolders
        foreach (var subfolder in folder.Subfolders)
        {
            result.AddRange(ProcessFolder(subfolder, filterPredicate, transformFunc));
        }

        return result;
    }

    private BookmarkFolder ProcessSingleFolder(BookmarkFolder folder, Func<Bookmark, bool> filterPredicate, Func<Bookmark, Bookmark> transformFunc)
    {
        var processedFolder = new BookmarkFolder(folder.Name);

        foreach (var bookmark in folder.Bookmarks)
        {
            if (filterPredicate(bookmark))
            {
                processedFolder.Bookmarks.Add(transformFunc(bookmark));
            }
        }

        return processedFolder;
    }
}