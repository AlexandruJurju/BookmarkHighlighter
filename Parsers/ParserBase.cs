using Newtonsoft.Json.Linq;

namespace BookmarkHighlighter.Parsers
{
    internal abstract class ParserBase
    {
        public abstract Dictionary<string, List<string>> GetLinks(String path);

        public List<string> GetLinksFromFolder(JToken folder)
        {
            List<string> links = new List<string>();

            // for each element in that folder
            foreach (var child in folder["children"])
            {
                // if the element is a link then add it to the list
                if (child["type"]?.ToString() == "url")
                {
                    string game_url = child["url"].ToString();
                    links.Add(game_url);

                }
                // if the element is a folder then recursively call the function to find all the links inside that folder
                else if (child["children"] != null)
                {
                    // Recursively get links from inner folders
                    links.AddRange(GetLinksFromFolder(child));
                }
            }

            return links;
        }
    }
}
