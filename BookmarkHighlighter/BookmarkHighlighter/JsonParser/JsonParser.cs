using System.Text.Json;
using BookmarkHighlighter.Structure;

namespace BookmarkHighlighter.Parser;

public class JsonParser : IJsonParser
{
    private readonly string _bookmarkFilePath;

    public JsonParser(string bookmarkFilePath)
    {
        if (string.IsNullOrWhiteSpace(bookmarkFilePath))
        {
            throw new ArgumentException("Bookmark file path cannot be null or empty.", nameof(bookmarkFilePath));
        }

        if (!File.Exists(bookmarkFilePath))
        {
            throw new FileNotFoundException("Bookmark file not found.", bookmarkFilePath);
        }

        _bookmarkFilePath = bookmarkFilePath;
    }

    public BookmarkFolder GetBookmarkStructure()
    {
        string json = File.ReadAllText(_bookmarkFilePath);
        using JsonDocument document = JsonDocument.Parse(json);

        JsonElement root = document.RootElement;
        if (!root.TryGetProperty("roots", out JsonElement roots) ||
            !roots.TryGetProperty("bookmark_bar", out JsonElement bookmarkBar) ||
            !bookmarkBar.TryGetProperty("children", out JsonElement bookmarkFolders))
        {
            throw new InvalidOperationException("Invalid bookmark structure.");
        }

        return ParseBookmarkFolder("Root", bookmarkFolders);
    }

    private BookmarkFolder ParseBookmarkFolder(string name, JsonElement element)
    {
        var folder = new BookmarkFolder(name);

        foreach (JsonElement child in element.EnumerateArray())
        {
            if (child.TryGetProperty("type", out JsonElement type))
            {
                string typeValue = type.GetString() ?? "";
                string itemName = child.GetProperty("name").GetString() ?? "";

                if (typeValue == "folder")
                {
                    if (child.TryGetProperty("children", out JsonElement children))
                    {
                        folder.Subfolders.Add(ParseBookmarkFolder(itemName, children));
                    }
                }
                else if (typeValue == "url")
                {
                    string url = child.GetProperty("url").GetString() ?? "";
                    folder.Bookmarks.Add(new Bookmark(itemName, url));
                }
            }
        }

        return folder;
    }
}