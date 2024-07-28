using BookmarkHighlighter.Structure;

namespace BookmarkHighlighter.JsonParser;

public interface IBookmarkParser
{
    BookmarkFolder GetBookmarkStructure();
}