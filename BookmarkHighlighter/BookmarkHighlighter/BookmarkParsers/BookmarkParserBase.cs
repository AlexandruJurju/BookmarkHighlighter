﻿using BookmarkHighlighter.JsWriters;
using BookmarkHighlighter.Structure;

namespace BookmarkHighlighter.BookmarkParsers;

public abstract class BookmarkParserBase
{
    private readonly IJsWriter _jsWriter;

    protected BookmarkParserBase(IJsWriter jsWriter)
    {
        _jsWriter = jsWriter;
    }

    public void ParseAndWriteToJson(BookmarkFolder rootFolder)
    {
        var result = Parse(rootFolder);
        _jsWriter.Write(result);
    }

    protected abstract Dictionary<string, List<string>> Parse(BookmarkFolder rootFolder);

    protected BookmarkFolder? FindFolder(BookmarkFolder folder, string name)
    {
        if (folder.Name == name)
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

    protected IEnumerable<Bookmark> GetLinksFromFolder(BookmarkFolder folder)
    {
        foreach (var bookmark in folder.Bookmarks)
        {
            yield return bookmark;
        }

        foreach (var subfolder in folder.Subfolders)
        {
            foreach (var bookmark in GetLinksFromFolder(subfolder))
            {
                yield return bookmark;
            }
        }
    }
}