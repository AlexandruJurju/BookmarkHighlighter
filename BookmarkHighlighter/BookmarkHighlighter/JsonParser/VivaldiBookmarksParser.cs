using System.Text.Json;
using BookmarkHighlighter.Structure;

namespace BookmarkHighlighter.JsonParser;

public class VivaldiBookmarksParser : IBookmarkParser
{
    private readonly string _bookmarkFilePath;

    public VivaldiBookmarksParser(string bookmarkFilePath)
    {
        if (string.IsNullOrWhiteSpace(bookmarkFilePath))
            throw new ArgumentException("Bookmark file path cannot be null or empty.", nameof(bookmarkFilePath));

        if (!File.Exists(bookmarkFilePath))
            throw new FileNotFoundException("Bookmark file not found.", bookmarkFilePath);

        _bookmarkFilePath = bookmarkFilePath;
    }

    public BookmarkFolder GetBookmarkStructure()
    {
        var json = File.ReadAllText(_bookmarkFilePath);
        using var document = JsonDocument.Parse(json);

        var root = document.RootElement;
        if (!root.TryGetProperty("roots", out var roots) ||
            !roots.TryGetProperty("bookmark_bar", out var bookmarkBar) ||
            !bookmarkBar.TryGetProperty("children", out var bookmarkFolders))
            throw new InvalidOperationException("Invalid bookmark structure.");

        return ParseBookmarkFolder("Root", bookmarkFolders);
    }

    private BookmarkFolder ParseBookmarkFolder(string name, JsonElement element)
    {
        var folder = new BookmarkFolder(name);

        foreach (var child in element.EnumerateArray())
            if (child.TryGetProperty("type", out var type))
            {
                var typeValue = type.GetString() ?? "";
                var itemName = child.GetProperty("name").GetString() ?? "";

                if (typeValue == "folder")
                {
                    if (child.TryGetProperty("children", out var children))
                        folder.Subfolders.Add(ParseBookmarkFolder(itemName, children));
                }
                else if (typeValue == "url")
                {
                    var url = child.GetProperty("url").GetString() ?? "";
                    folder.Bookmarks.Add(new Bookmark(itemName, url));
                }
            }

        return folder;
    }
}