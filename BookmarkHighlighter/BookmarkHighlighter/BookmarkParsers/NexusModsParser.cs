using System.Text.RegularExpressions;
using BookmarkHighlighter.Constants;
using BookmarkHighlighter.Structure;

namespace BookmarkHighlighter.BookmarkParsers;

public class NexusModsParser : BookmarkParserBase
{
    private const string NexusModsPattern = @"https?://www\.nexusmods\.com/([^/]+)/mods/(\d+)";

    public override List<BookmarkFolder> Parse(BookmarkFolder rootFolder)
    {
        // Find the "Nexus Mods" folder in the root folder
        var nexusModsFolder = FindFolder(rootFolder, FolderNames.NexusMods);
        if (nexusModsFolder == null) throw new InvalidOperationException($"{FolderNames.NexusMods} folder not found");

        // Process the Nexus Mods folder and its subfolders
        return ProcessFolder(nexusModsFolder,
            bookmark => IsValidNexusModLink(bookmark.Url),
            bookmark => bookmark); // Return the original bookmark without modification
    }

    private bool IsValidNexusModLink(string url)
    {
        return Regex.IsMatch(url, NexusModsPattern);
    }
}