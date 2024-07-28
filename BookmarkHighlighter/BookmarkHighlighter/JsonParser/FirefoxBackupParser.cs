using System.Text.Json;
using BookmarkHighlighter.Structure;

namespace BookmarkHighlighter.JsonParser;

public class FirefoxBackupParser : IBookmarkParser
{
    private readonly string _bookmarkFilePath;

    public FirefoxBackupParser(string bookmarkFilePath)
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
        if (!root.TryGetProperty("children", out var children))
            throw new InvalidOperationException("Invalid bookmark structure.");

        return ParseBookmarkFolder("Root", children);
    }

    private BookmarkFolder ParseBookmarkFolder(string name, JsonElement element)
    {
        var folder = new BookmarkFolder(name);

        foreach (var child in element.EnumerateArray())
            if (child.TryGetProperty("type", out var type))
            {
                var typeValue = type.GetString() ?? "";
                var itemName = child.GetProperty("title").GetString() ?? "";

                if (typeValue == "text/x-moz-place-container")
                {
                    if (child.TryGetProperty("children", out var subChildren))
                        folder.Subfolders.Add(ParseBookmarkFolder(itemName, subChildren));
                }
                else if (typeValue == "text/x-moz-place")
                {
                    if (child.TryGetProperty("uri", out var uriElement))
                    {
                        var url = uriElement.GetString() ?? "";
                        folder.Bookmarks.Add(new Bookmark(itemName, url));
                    }
                }
            }

        return folder;
    }
}