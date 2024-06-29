using BookmarkHighlighter.Structure;

namespace BookmarkHighlighter.Parser;

public interface IBookmarkParser
{
    BookmarkFolder GetBookmarkStructure();
}