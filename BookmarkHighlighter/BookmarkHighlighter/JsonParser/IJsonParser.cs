using BookmarkHighlighter.Structure;

namespace BookmarkHighlighter.Parser;

public interface IJsonParser
{
    BookmarkFolder GetBookmarkStructure();
}